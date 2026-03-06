/**
 * 核心模块出口
 * 包含配置、HTTP 客户端、加密解密、证书管理、通知处理等核心功能
 */

// 配置管理
export {
  Config,
  Signer,
  Verifier,
  PrivacyEncryptor,
  PrivacyDecryptor,
  AeadCipher,
  EncryptResult,
  DefaultSigner,
  DefaultVerifier,
  DefaultPrivacyEncryptor,
  DefaultPrivacyDecryptor,
  DefaultAeadCipher,
} from './Config';

export { RSAConfig, RSAConfigBuilder } from './config/RSAConfig';

// HTTP 客户端
export {
  HttpClient,
  HttpRequestConfig,
  HttpResponse,
  DefaultHttpClient,
} from './http/HttpClient';

// 证书管理
export {
  CertificateManager,
  CertificateManagerConfig,
  CertificateInfo,
} from './certificate/CertificateManager';

// 通知处理
export {
  NotificationParser,
  NotificationConfig,
  NotificationRequest,
  Notification,
  NotificationResource,
  TransactionNotification,
  RefundNotification,
  TransferBatchNotification,
  ProfitSharingNotification,
} from './notification/NotificationParser';

// 异常体系
export { WechatPayException } from './exception/WechatPayException';
export { HttpException } from './exception/HttpException';
export { ValidationException } from './exception/ValidationException';
export { ServiceException } from './exception/ServiceException';
export { CipherException } from './exception/CipherException';
export { CertificateException } from './exception/CertificateException';
