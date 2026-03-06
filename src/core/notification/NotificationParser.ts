import crypto from 'crypto';
import { ValidationException } from '../exception/ValidationException';
import { CipherException } from '../exception/CipherException';
import { CertificateException } from '../exception/CertificateException';
import { CertificateManager } from '../certificate/CertificateManager';

/**
 * 回调通知请求参数
 * 
 * @public
 */
export interface NotificationRequest {
  /**
   * HTTP 请求体 body（原始报文）
   */
  body: string;

  /**
   * HTTP 头 Wechatpay-Signature
   */
  signature: string;

  /**
   * HTTP 头 Wechatpay-Serial
   */
  serialNo: string;

  /**
   * HTTP 头 Wechatpay-Nonce
   */
  nonce: string;

  /**
   * HTTP 头 Wechatpay-Timestamp
   */
  timestamp: string;

  /**
   * HTTP 头 Wechatpay-Signature-Type
   */
  signatureType?: string;
}

/**
 * 回调通知资源
 * 
 * @public
 */
export interface NotificationResource<T = any> {
  /**
   * 加密类型
   */
  algorithm: string;

  /**
   * 加密密文（Base64 编码）
   */
  ciphertext: string;

  /**
   * 加密使用的随机串
   */
  nonce: string;

  /**
   * 附加数据
   */
  associated_data: string;

  /**
   * 解密后的内容
   */
  decryptedData?: T;
}

/**
 * 回调通知
 * 
 * @public
 */
export interface Notification<T = any> {
  /**
   * 通知 ID
   */
  id: string;

  /**
   * 通知创建时间
   */
  create_time: string;

  /**
   * 通知类型
   */
  event_type: string;

  /**
   * 通知资源
   */
  resource: NotificationResource<T>;

  /**
   * 通知摘要
   */
  summary: string;
}

/**
 * 通知配置
 * 
 * @public
 */
export interface NotificationConfig {
  /**
   * APIv3 密钥
   */
  apiSecret: string;

  /**
   * 证书管理器
   */
  certificateManager: CertificateManager;

  /**
   * 商户私钥（可选，用于解密某些特殊场景）
   */
  privateKey?: Buffer;
}

/**
 * 统一的回调通知解析器
 * 负责验签、解密并转换回调通知为业务对象
 * 
 * @public
 */
export class NotificationParser {
  private config: NotificationConfig;

  constructor(config: NotificationConfig) {
    this.config = config;
  }

  /**
   * 解析回调通知
   * @param request 回调请求参数
   * @param clazz 目标类型构造函数
   * @returns 解析后的业务对象
   */
  public async parse<T>(request: NotificationRequest, clazz: new () => T): Promise<T> {
    // 1. 验证签名
    await this.verifySignature(request);

    // 2. 解析通知体
    const notification: Notification = JSON.parse(request.body);

    // 3. 解密敏感数据
    const decryptedData = this.decryptResource(notification.resource);

    // 4. 转换为业务对象
    return this.parseToObject(decryptedData, clazz);
  }

  /**
   * 快速解析为 JSON 对象（当不需要特定类型时）
   */
  public async parseToJson(request: NotificationRequest): Promise<any> {
    await this.verifySignature(request);
    const notification: Notification = JSON.parse(request.body);
    return this.decryptResource(notification.resource);
  }

  private async verifySignature(request: NotificationRequest): Promise<void> {
    const { signature, serialNo, nonce, timestamp, body } = request;

    // 获取公钥
    const publicKey = this.config.certificateManager.getPublicKey(serialNo);
    if (!publicKey) {
      throw new CertificateException(
        `未找到证书序列号 ${serialNo} 对应的公钥，请先获取平台证书`,
        'verify'
      );
    }

    // 构建验签数据
    const signData = `${timestamp}\n${nonce}\n${body}\n`;

    // 验证签名
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(signData);
    verify.end();

    const isValid = verify.verify(publicKey, signature, 'base64');
    if (!isValid) {
      throw new ValidationException('微信支付回调签名验证失败', '签名不匹配');
    }
  }

  private decryptResource<T>(resource: NotificationResource): T {
    const { algorithm, ciphertext, nonce, associated_data } = resource;

    if (algorithm !== 'AEAD_AES_256_GCM') {
      throw new CipherException(
        `不支持的加密算法：${algorithm}，仅支持 AEAD_AES_256_GCM`,
        'decrypt'
      );
    }

    try {
      const ciphertextBuffer = Buffer.from(ciphertext, 'base64');
      const authTag = ciphertextBuffer.slice(ciphertextBuffer.length - 16);
      const data = ciphertextBuffer.slice(0, ciphertextBuffer.length - 16);

      const decipher = crypto.createDecipheriv('aes-256-gcm', this.config.apiSecret, nonce);
      decipher.setAuthTag(authTag);
      decipher.setAAD(Buffer.from(associated_data));

      const decoded = decipher.update(data);
      const final = decipher.final();
      const decryptedStr = Buffer.concat([decoded, final]).toString('utf8');

      return JSON.parse(decryptedStr) as T;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new CipherException(`解密失败：${message}`, 'decrypt');
    }
  }

  private parseToObject<T>(data: any, clazz: new () => T): T {
    if (!data) {
      throw new ValidationException('解密后的数据为空', 'parse');
    }

    const instance = new clazz();
    Object.assign(instance, data);
    return instance;
  }
}

/**
 * 支付成功通知数据
 * 
 * @public
 */
export class TransactionNotification {
  /**
   * 商户号
   */
  mchid!: string;

  /**
   * 商户订单号
   */
  out_trade_no!: string;

  /**
   * 微信支付订单号
   */
  transaction_id!: string;

  /**
   * 交易类型
   */
  trade_type!: string;

  /**
   * 交易状态
   */
  trade_state!: string;

  /**
   * 交易状态描述
   */
  trade_state_desc!: string;

  /**
   * 付款银行
   */
  bank_type!: string;

  /**
   * 附加数据
   */
  attach?: string;

  /**
   * 支付完成时间
   */
  success_time?: string;

  /**
   * 订单金额
   */
  amount!: {
    total: number;
    payer_total: number;
    currency: string;
    payer_currency: string;
  };

  /**
   * 场景信息
   */
  scene_info?: {
    device_id: string;
  };

  /**
   * 支付者信息
   */
  payer!: {
    openid: string;
  };
}

/**
 * 退款通知数据
 * 
 * @public
 */
export class RefundNotification {
  /**
   * 商户号
   */
  mchid!: string;

  /**
   * 商户退款单号
   */
  out_refund_no!: string;

  /**
   * 微信支付退款单号
   */
  refund_id!: string;

  /**
   * 微信支付订单号
   */
  transaction_id!: string;

  /**
   * 商户订单号
   */
  out_trade_no!: string;

  /**
   * 退款状态
   */
  refund_status!: string;

  /**
   * 退款成功时间
   */
  success_time?: string;

  /**
   * 退款创建时间
   */
  create_time!: string;

  /**
   * 退款金额
   */
  amount!: {
    total: number;
    refund: number;
    payer_total: number;
    payer_refund: number;
    currency: string;
    refund_fee: number;
  };
}

/**
 * 转账批次通知数据
 * 
 * @public
 */
export class TransferBatchNotification {
  /**
   * 商户号
   */
  mchid!: string;

  /**
   * 商家批次单号
   */
  out_batch_no!: string;

  /**
   * 微信批次单号
   */
  batch_id!: string;

  /**
   * 批次状态
   */
  batch_status!: string;

  /**
   * 转账总金额
   */
  total_amount!: number;

  /**
   * 转账总笔数
   */
  total_num!: number;

  /**
   * 批次创建时间
   */
  create_time!: string;
}

/**
 * 分账结果通知数据
 * 
 * @public
 */
export class ProfitSharingNotification {
  /**
   * 商户号
   */
  mchid!: string;

  /**
   * 微信订单号
   */
  transaction_id!: string;

  /**
   * 商户分账单号
   */
  out_order_no!: string;

  /**
   * 微信分账单号
   */
  order_id!: string;

  /**
   * 分账单状态
   */
  state!: string;
}
