import crypto from 'crypto';
import { WechatPayException } from './exception/WechatPayException';
import { HttpClient, DefaultHttpClient } from './http/HttpClient';

// 重新导出 HttpClient 相关类型
export { HttpClient, DefaultHttpClient } from './http/HttpClient';

/**
 * 微信支付配置接口
 * 所有配置类必须实现此接口
 * 
 * @public
 */
export interface Config {
  /**
   * 商户号
   */
  readonly merchantId: string;

  /**
   * 应用 ID
   */
  readonly appId?: string;

  /**
   * 商户私钥
   */
  readonly privateKey: Buffer;

  /**
   * 商户证书序列号
   */
  readonly merchantSerialNumber: string;

  /**
   * APIv3 密钥
   */
  readonly apiV3Key: string;

  /**
   * 微信支付平台证书序列号（用于敏感信息加密）
   */
  readonly wechatpaySerial?: string;

  /**
   * 获取签名器
   */
  createSigner(): Signer;

  /**
   * 获取验签器
   */
  createVerifier(): Verifier;

  /**
   * 获取敏感信息加密器
   */
  createEncryptor(): PrivacyEncryptor;

  /**
   * 获取敏感信息解密器
   */
  createDecryptor(): PrivacyDecryptor;

  /**
   * 获取 AES 加解密器
   */
  createAeadCipher(): AeadCipher;

  /**
   * 创建 HTTP 客户端
   */
  createHttpClient(): HttpClient;
}

/**
 * 签名器接口
 * 
 * @public
 */
export interface Signer {
  /**
   * 对数据进行签名
   * @param data 待签名数据
   * @returns 签名结果（Base64 编码）
   */
  sign(data: string): Promise<string>;

  /**
   * 获取证书序列号
   */
  getSerialNumber(): string;
}

/**
 * 验签器接口
 * 
 * @public
 */
export interface Verifier {
  /**
   * 验证签名
   * @param data 原始数据
   * @param signature 签名值
   * @param publicKey 公钥
   * @returns 验证结果
   */
  verify(data: string, signature: string, publicKey: string): Promise<boolean>;

  /**
   * 验证回调通知签名
   * @param timestamp 时间戳
   * @param nonce 随机串
   * @param body 请求体
   * @param signature 签名值
   * @param publicKey 公钥
   * @returns 验证结果
   */
  verifyNotification(
    timestamp: string,
    nonce: string,
    body: string,
    signature: string,
    publicKey: string
  ): Promise<boolean>;
}

/**
 * 敏感信息加密器接口
 * 
 * @public
 */
export interface PrivacyEncryptor {
  /**
   * 加密敏感信息
   * @param data 待加密数据
   * @param publicKey 微信支付公钥
   * @returns 加密结果（Base64 编码）
   */
  encrypt(data: string, publicKey: string): Promise<string>;
  
  /**
   * 获取微信支付证书序列号
   */
  getWechatpaySerial(): string;
}

/**
 * 敏感信息解密器接口
 * 
 * @public
 */
export interface PrivacyDecryptor {
  /**
   * 解密敏感信息
   * @param ciphertext 密文（Base64 编码）
   * @param privateKey 私钥
   * @returns 解密结果
   */
  decrypt(ciphertext: string, privateKey: Buffer): Promise<string>;
}

/**
 * AES 加解密器接口
 * 
 * @public
 */
export interface AeadCipher {
  /**
   * AES-256-GCM 加密
   * @param plaintext 明文
   * @param key 密钥
   * @param nonce 随机串
   * @param associatedData 附加数据
   * @returns 加密结果
   */
  encrypt(
    plaintext: string,
    key: string,
    nonce: string,
    associatedData: string
  ): Promise<EncryptResult>;

  /**
   * AES-256-GCM 解密
   * @param ciphertext 密文（Base64 编码）
   * @param key 密钥
   * @param nonce 随机串
   * @param associatedData 附加数据
   * @returns 解密结果
   */
  decrypt(
    ciphertext: string,
    key: string,
    nonce: string,
    associatedData: string
  ): Promise<string>;
}

/**
 * 加密结果
 * 
 * @public
 */
export interface EncryptResult {
  /**
   * 加密算法
   */
  algorithm: string;

  /**
   * 密文（Base64 编码）
   */
  ciphertext: string;

  /**
   * 随机串
   */
  nonce: string;

  /**
   * 附加数据
   */
  associatedData: string;
}

/**
 * 默认签名器实现
 * 
 * @public
 */
export class DefaultSigner implements Signer {
  private readonly privateKey: Buffer;
  private readonly serialNumber: string;

  constructor(privateKey: Buffer, serialNumber: string) {
    this.privateKey = privateKey;
    this.serialNumber = serialNumber;
  }

  async sign(data: string): Promise<string> {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(data);
    sign.end();
    return sign.sign(this.privateKey, 'base64');
  }

  getSerialNumber(): string {
    return this.serialNumber;
  }
}

/**
 * 默认验签器实现
 * 
 * @public
 */
export class DefaultVerifier implements Verifier {
  async verify(data: string, signature: string, publicKey: string): Promise<boolean> {
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(data);
    verify.end();
    return verify.verify(publicKey, signature, 'base64');
  }

  async verifyNotification(
    timestamp: string,
    nonce: string,
    body: string,
    signature: string,
    publicKey: string
  ): Promise<boolean> {
    const signData = `${timestamp}\n${nonce}\n${body}\n`;
    return this.verify(signData, signature, publicKey);
  }
}

/**
 * 默认敏感信息加密器实现
 * 
 * @public
 */
export class DefaultPrivacyEncryptor implements PrivacyEncryptor {
  private readonly _wechatpaySerial: string;

  constructor(wechatpaySerial: string) {
    this._wechatpaySerial = wechatpaySerial;
  }

  async encrypt(data: string, publicKey: string): Promise<string> {
    const publicKeyBuffer = Buffer.from(publicKey, 'utf8');
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKeyBuffer,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      Buffer.from(data, 'utf8')
    );
    return encrypted.toString('base64');
  }

  getWechatpaySerial(): string {
    return this._wechatpaySerial;
  }
}

/**
 * 默认敏感信息解密器实现
 * 
 * @public
 */
export class DefaultPrivacyDecryptor implements PrivacyDecryptor {
  async decrypt(ciphertext: string, privateKey: Buffer): Promise<string> {
    const ciphertextBuffer = Buffer.from(ciphertext, 'base64');
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      ciphertextBuffer
    );
    return decrypted.toString('utf8');
  }
}

/**
 * 默认 AES 加解密器实现
 * 
 * @public
 */
export class DefaultAeadCipher implements AeadCipher {
  async encrypt(
    plaintext: string,
    key: string,
    nonce: string,
    associatedData: string
  ): Promise<EncryptResult> {
    const keyBuffer = Buffer.from(key, 'utf8');
    const nonceBuffer = Buffer.from(nonce, 'utf8');
    const aadBuffer = Buffer.from(associatedData, 'utf8');

    const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, nonceBuffer);
    cipher.setAAD(aadBuffer);

    const encrypted = cipher.update(Buffer.from(plaintext, 'utf8'));
    const final = cipher.final();
    const authTag = cipher.getAuthTag();

    // 将密文和认证标签合并
    const ciphertext = Buffer.concat([encrypted, final, authTag]);

    return {
      algorithm: 'AEAD_AES_256_GCM',
      ciphertext: ciphertext.toString('base64'),
      nonce,
      associatedData
    };
  }

  async decrypt(
    ciphertext: string,
    key: string,
    nonce: string,
    associatedData: string
  ): Promise<string> {
    const keyBuffer = Buffer.from(key, 'utf8');
    const nonceBuffer = Buffer.from(nonce, 'utf8');
    const aadBuffer = Buffer.from(associatedData, 'utf8');
    const ciphertextBuffer = Buffer.from(ciphertext, 'base64');

    // 提取认证标签（最后 16 字节）
    const authTag = ciphertextBuffer.slice(ciphertextBuffer.length - 16);
    const data = ciphertextBuffer.slice(0, ciphertextBuffer.length - 16);

    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, nonceBuffer);
    decipher.setAuthTag(authTag);
    decipher.setAAD(aadBuffer);

    const decrypted = decipher.update(data);
    const final = decipher.final();

    return Buffer.concat([decrypted, final]).toString('utf8');
  }
}
