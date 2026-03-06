import { WechatPayException } from './WechatPayException';

/**
 * 证书异常
 * 证书相关操作失败时抛出
 * 
 * @public
 */
export class CertificateException extends WechatPayException {
  public readonly operation?: string;

  constructor(message: string, operation?: string) {
    super(message);
    this.name = 'CertificateException';
    this.operation = operation;
    Error.captureStackTrace(this, CertificateException);
  }
}
