import crypto from 'crypto';
import { CertificateException } from '../exception/CertificateException';
import { HttpClient } from '../http/HttpClient';
import { Signer, AeadCipher, DefaultAeadCipher } from '../Config';
import * as x509 from '@fidm/x509';

/**
 * 证书信息
 * 
 * @public
 */
export interface CertificateInfo {
  /**
   * 证书序列号
   */
  serialNo: string;

  /**
   * 公钥 PEM
   */
  publicKey: string;

  /**
   * 生效时间
   */
  effectiveTime: string;

  /**
   * 过期时间
   */
  expireTime: string;
}

/**
 * 证书管理器配置
 * 
 * @public
 */
export interface CertificateManagerConfig {
  /**
   * 商户号
   */
  merchantId: string;

  /**
   * 商户私钥
   */
  privateKey: Buffer;

  /**
   * 商户证书序列号
   */
  serialNo: string;

  /**
   * APIv3 密钥
   */
  apiV3Key: string;

  /**
   * HTTP 客户端
   */
  httpClient: HttpClient;

  /**
   * 自动更新间隔（毫秒），默认 60 分钟
   */
  updateIntervalMs?: number;
}

/**
 * 证书管理器
 * 自动下载并更新微信支付平台证书，每 60 分钟刷新一次
 * 
 * @public
 */
export class CertificateManager {
  private certificates: Map<string, string> = new Map();
  private updateTimer: NodeJS.Timeout | null = null;
  private readonly updateIntervalMs: number;
  private isUpdating: boolean = false;
  private readonly config: CertificateManagerConfig;
  private signer?: Signer;

  constructor(config: CertificateManagerConfig) {
    this.config = {
      ...config,
      updateIntervalMs: config.updateIntervalMs ?? 60 * 60 * 1000, // 默认 60 分钟
    };
    this.updateIntervalMs = this.config.updateIntervalMs ?? 60 * 60 * 1000;
  }

  /**
   * 初始化证书管理器
   * 立即获取证书并启动定时更新
   */
  public async initialize(): Promise<void> {
    // 首次立即获取证书
    await this.fetchCertificates();

    // 启动定时更新
    this.startAutoUpdate();
  }

  /**
   * 停止自动更新
   */
  public stop(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
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
   * 手动刷新证书
   */
  public async refreshCertificates(): Promise<void> {
    await this.fetchCertificates();
  }

  private startAutoUpdate(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }

    this.updateTimer = setInterval(async () => {
      await this.fetchCertificates();
    }, this.updateIntervalMs);

    // 确保进程退出时清理定时器
    if (typeof process !== 'undefined') {
      process.on('exit', () => {
        this.stop();
      });

      process.on('SIGTERM', () => {
        this.stop();
      });

      process.on('SIGINT', () => {
        this.stop();
      });
    }
  }

  private async fetchCertificates(): Promise<void> {
    if (this.isUpdating) {
      return;
    }

    try {
      this.isUpdating = true;

      const url = 'https://api.mch.weixin.qq.com/v3/certificates';
      const authorization = await this.buildAuthorization('GET', url);
      const headers = this.getHeaders(authorization);

      const result = await this.config.httpClient.get(url, headers);

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
              this.config.apiV3Key
            );

            const publicKey = this.extractPublicKey(Buffer.from(decryptCertificate));
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
      console.error('获取证书失败:', message);
      throw new CertificateException(message, 'fetch');
    } finally {
      this.isUpdating = false;
    }
  }

  private async buildAuthorization(method: string, url: string): Promise<string> {
    const nonceStr = Math.random().toString(36).substr(2, 15);
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const urlPath = url.replace('https://api.mch.weixin.qq.com', '');

    let str = `${method}\n${urlPath}\n${timestamp}\n${nonceStr}\n`;
    if (method === 'GET') {
      str += '\n';
    }

    // 使用商户私钥签名
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(str);
    sign.end();
    const signature = sign.sign(this.config.privateKey, 'base64');

    return this.getAuthorization(nonceStr, timestamp, signature);
  }

  private getAuthorization(nonceStr: string, timestamp: string, signature: string): string {
    const authType = 'WECHATPAY2-SHA256-RSA2048';
    const authorization =
      `mchid="${this.config.merchantId}",` +
      `nonce_str="${nonceStr}",` +
      `timestamp="${timestamp}",` +
      `serial_no="${this.config.serialNo}",` +
      `signature="${signature}"`;

    return `${authType} ${authorization}`;
  }

  private getHeaders(authorization: string): Record<string, string> {
    return {
      Accept: 'application/json',
      'User-Agent': 'wechatpay-nodev3/3.0.0',
      Authorization: authorization,
      'Accept-Encoding': 'gzip',
    };
  }

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
    const final = decipher.final('utf8');

    return decoded + final;
  }

  private extractPublicKey(certPem: Buffer): string {
    // 使用 @fidm/x509 解析证书
    const cert = x509.Certificate.fromPEM(certPem);
    return cert.publicKey.toPEM();
  }
}
