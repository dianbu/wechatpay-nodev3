/**
 * 微信支付基础异常类
 * 
 * @public
 */
export class WechatPayException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WechatPayException';
    Error.captureStackTrace(this, WechatPayException);
  }
}
