import { WechatPayException } from './WechatPayException';

/**
 * HTTP 异常
 * 发送 HTTP 请求失败时抛出
 * 
 * @public
 */
export class HttpException extends WechatPayException {
  public readonly statusCode?: number;
  public readonly requestInfo?: {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: any;
  };

  constructor(message: string, statusCode?: number, requestInfo?: any) {
    super(message);
    this.name = 'HttpException';
    this.statusCode = statusCode;
    this.requestInfo = requestInfo;
    Error.captureStackTrace(this, HttpException);
  }
}
