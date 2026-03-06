import {
  Config,
  Signer,
  Verifier,
  PrivacyEncryptor,
  PrivacyDecryptor,
  AeadCipher,
  HttpClient,
  DefaultSigner,
  DefaultVerifier,
  DefaultPrivacyEncryptor,
  DefaultPrivacyDecryptor,
  DefaultAeadCipher,
  DefaultHttpClient,
} from '../Config';

/**
 * RSA 配置构建器
 * 
 * @public
 */
export class RSAConfigBuilder {
  private _appId?: string;
  private _merchantId!: string;
  private _privateKey!: Buffer;
  private _merchantSerialNumber!: string;
  private _apiV3Key!: string;
  private _wechatpaySerial?: string;

  /**
   * 设置应用 ID
   */
  appId(appId: string): RSAConfigBuilder {
    this._appId = appId;
    return this;
  }

  /**
   * 设置商户号
   */
  merchantId(merchantId: string): RSAConfigBuilder {
    this._merchantId = merchantId;
    return this;
  }

  /**
   * 设置商户私钥
   */
  privateKey(privateKey: Buffer): RSAConfigBuilder {
    this._privateKey = privateKey;
    return this;
  }

  /**
   * 设置商户证书序列号
   */
  merchantSerialNumber(merchantSerialNumber: string): RSAConfigBuilder {
    this._merchantSerialNumber = merchantSerialNumber;
    return this;
  }

  /**
   * 设置 APIv3 密钥
   */
  apiV3Key(apiV3Key: string): RSAConfigBuilder {
    this._apiV3Key = apiV3Key;
    return this;
  }

  /**
   * 设置微信支付平台证书序列号
   */
  wechatpaySerial(wechatpaySerial: string): RSAConfigBuilder {
    this._wechatpaySerial = wechatpaySerial;
    return this;
  }

  /**
   * 构建配置对象
   */
  build(): RSAConfig {
    return new RSAConfig(
      this._merchantId,
      this._privateKey,
      this._merchantSerialNumber,
      this._apiV3Key,
      this._appId,
      this._wechatpaySerial
    );
  }
}

/**
 * RSA 配置实现
 * 提供基于 RSA 的签名、验签、加密、解密功能
 * 
 * @public
 */
export class RSAConfig implements Config {
  readonly appId?: string;
  readonly merchantId: string;
  readonly privateKey: Buffer;
  readonly merchantSerialNumber: string;
  readonly apiV3Key: string;
  readonly wechatpaySerial?: string;

  constructor(
    merchantId: string,
    privateKey: Buffer,
    merchantSerialNumber: string,
    apiV3Key: string,
    appId?: string,
    wechatpaySerial?: string
  ) {
    this.merchantId = merchantId;
    this.privateKey = privateKey;
    this.merchantSerialNumber = merchantSerialNumber;
    this.apiV3Key = apiV3Key;
    this.appId = appId;
    this.wechatpaySerial = wechatpaySerial;
  }

  /**
   * 创建签名器
   */
  createSigner(): Signer {
    return new DefaultSigner(this.privateKey, this.merchantSerialNumber);
  }

  /**
   * 创建验签器
   */
  createVerifier(): Verifier {
    return new DefaultVerifier();
  }

  /**
   * 创建敏感信息加密器
   */
  createEncryptor(): PrivacyEncryptor {
    return new DefaultPrivacyEncryptor(this.wechatpaySerial || '');
  }

  /**
   * 创建敏感信息解密器
   */
  createDecryptor(): PrivacyDecryptor {
    return new DefaultPrivacyDecryptor();
  }

  /**
   * 创建 AES 加解密器
   */
  createAeadCipher(): AeadCipher {
    return new DefaultAeadCipher();
  }

  /**
   * 创建 HTTP 客户端
   */
  createHttpClient(): HttpClient {
    return new DefaultHttpClient();
  }

  /**
   * 创建构建器
   */
  static builder(): RSAConfigBuilder {
    return new RSAConfigBuilder();
  }
}
