import crypto from 'crypto';
import { x509_1 } from '@fidm/x509';
import { CertificateException } from './exceptions';
import { IPayRequest } from './pay-request.interface';
import { Output } from './interface-v2';

/**
 * 微信支付平台证书信息
 */
export interface CertificateInfo {
  serialNo: string;
  publicKey: string;
  effectiveTime: string;
  expireTime: string;
}

/**
 * 自动证书管理器
 * 自动下载并更新微信支付平台证书，每 60 分钟刷新一次
 */
export class AutoCertificateManager {
  private certificates: Map<string, string> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;
  private readonly updateIntervalMs = 60 * 60 * 1000; // 60 分钟
  private isUpdating = false;
  private apiSecret?: string;
  private httpService?: IPayRequest;
  private mchid?: string;
  private serialNo?: string;
  private privateKey?: Buffer;

  constructor() {}

  /**
   * 初始化证书管理器
   * @param params 初始化参数
   */
  public async initialize(params: {
    mchid: string;
    serialNo: string;
    privateKey: Buffer;
    apiSecret: string;
    httpService: IPayRequest;
  }): Promise<void> {
    this.mchid = params.mchid;
    this.serialNo = params.serialNo;
    this.privateKey = params.privateKey;
    this.apiSecret = params.apiSecret;
    this.httpService = params.httpService;

    // 首次立即获取证书
    await this.fetchCertificates();

    // 启动定时更新
    this.startAutoUpdate();
  }

  /**
   * 启动自动更新
   */
  private startAutoUpdate(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(async () => {
      await this.fetchCertificates();
    }, this.updateIntervalMs);

    // 确保进程退出时清理定时器
    if (typeof process !== 'undefined') {
      process.on('exit', () => {
        this.stop();
      });
    }
  }

  /**
   * 停止自动更新
   */
  public stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * 获取微信支付平台证书
   */
  private async fetchCertificates(): Promise<void> {
    if (this.isUpdating) {
      return;
    }

    try {
      this.isUpdating = true;

      if (!this.httpService || !this.apiSecret) {
        throw new CertificateException('证书管理器未初始化', 'fetch');
      }

      const url = 'https://api.mch.weixin.qq.com/v3/certificates';
      const authorization = this.buildAuthorization('GET', url);
      const headers = this.getHeaders(authorization);

      const result: Output = await this.httpService.get(url, headers);

      if (result.status === 200 && result.data?.data) {
        const certificates = result.data.data as Array<{
          effective_time: string;
          expire_time: string;
          serial_no: string;
          encrypt_certificate: {
            algorithm: string;
            associated_data: string;
            ciphertext: string;
            nonce: string;
          };
        }>;

        const newCertificates = new Map<string, string>();

        for (const cert of certificates) {
          try {
            const decryptCertificate = this.decipherGcm(
              cert.encrypt_certificate.ciphertext,
              cert.encrypt_certificate.associated_data,
              cert.encrypt_certificate.nonce,
              this.apiSecret
            );

            const publicKey = x509_1.Certificate.fromPEM(
              Buffer.from(decryptCertificate)
            ).publicKey.toPEM();

            newCertificates.set(cert.serial_no, publicKey);
          } catch (error) {
            console.error(`解密证书失败，序列号：${cert.serial_no}`, error);
          }
        }

        if (newCertificates.size > 0) {
          this.certificates = newCertificates;
          console.log(`成功更新 ${newCertificates.size} 个微信支付平台证书`);
        } else {
          throw new CertificateException('未能成功解密任何证书', 'fetch');
        }
      } else {
        throw new CertificateException(
          `获取证书失败，状态码：${result.status}`,
          'fetch'
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new CertificateException(message, 'fetch');
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * 获取公钥
   * @param serialNo 证书序列号
   */
  public getPublicKey(serialNo: string): string | undefined {
    return this.certificates.get(serialNo);
  }

  /**
   * 获取所有证书序列号
   */
  public getSerialNumbers(): string[] {
    return Array.from(this.certificates.keys());
  }

  /**
   * 获取证书数量
   */
  public getCertificateCount(): number {
    return this.certificates.size;
  }

  /**
   * 构建请求签名参数
   */
  private buildAuthorization(method: string, url: string): string {
    const nonceStr = Math.random().toString(36).substr(2, 15);
    const timestamp = parseInt((+new Date() / 1000).toString()).toString();
    const urlPath = url.replace('https://api.mch.weixin.qq.com', '');

    let str = `${method}\n${urlPath}\n${timestamp}\n${nonceStr}\n`;
    if (method === 'GET') {
      str += '\n';
    }

    const signature = this.sha256WithRsa(str);
    return this.getAuthorization(nonceStr, timestamp, signature);
  }

  /**
   * 获取授权头
   */
  private getAuthorization(nonceStr: string, timestamp: string, signature: string): string {
    const authType = 'WECHATPAY2-SHA256-RSA2048';
    const authorization =
      `mchid="${this.mchid}",` +
      `nonce_str="${nonceStr}",` +
      `timestamp="${timestamp}",` +
      `serial_no="${this.serialNo}",` +
      `signature="${signature}"`;

    return `${authType} ${authorization}`;
  }

  /**
   * 获取请求头
   */
  private getHeaders(authorization: string): Record<string, string> {
    return {
      Accept: 'application/json',
      'User-Agent': 'wechatpay-node-v3/1.0.0',
      Authorization: authorization,
      'Accept-Encoding': 'gzip',
    };
  }

  /**
   * SHA256withRSA 签名
   */
  private sha256WithRsa(data: string): string {
    if (!this.privateKey) {
      throw new CertificateException('缺少私钥', 'sign');
    }

    return crypto
      .createSign('RSA-SHA256')
      .update(data)
      .sign(this.privateKey, 'base64');
  }

  /**
   * AES-256-GCM 解密
   */
  private decipherGcm(
    ciphertext: string,
    associatedData: string,
    nonce: string,
    key: string
  ): string {
    const ciphertextBuffer = Buffer.from(ciphertext, 'base64');
    const authTag = ciphertextBuffer.slice(ciphertextBuffer.length - 16);
    const data = ciphertextBuffer.slice(0, ciphertextBuffer.length - 16);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
    decipher.setAuthTag(authTag);
    decipher.setAAD(Buffer.from(associatedData));

    const decoded = decipher.update(data, undefined, 'utf8');
    decoded + decipher.final('utf8');

    return decoded;
  }
}

// 导出单例
export const autoCertificateManager = new AutoCertificateManager();
