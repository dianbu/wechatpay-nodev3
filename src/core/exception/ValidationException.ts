import { WechatPayException } from './WechatPayException';

/**
 * 验签异常
 * 验证微信支付签名失败时抛出
 * 
 * @public
 */
export class ValidationException extends WechatPayException {
  public readonly reason?: string;

  constructor(message: string, reason?: string) {
    super(message);
    this.name = 'ValidationException';
    this.reason = reason;
    Error.captureStackTrace(this, ValidationException);
  }
}
