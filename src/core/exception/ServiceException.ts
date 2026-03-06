import { WechatPayException } from './WechatPayException';

/**
 * 服务异常
 * 发送 HTTP 请求成功，但服务返回异常
 * 
 * @public
 */
export class ServiceException extends WechatPayException {
  public readonly statusCode: number;
  public readonly errorCode?: string;
  public readonly errorMessage?: string;
  public readonly responseBody?: any;

  constructor(
    message: string,
    statusCode: number,
    errorCode?: string,
    errorMessage?: string,
    responseBody?: any
  ) {
    super(message);
    this.name = 'ServiceException';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.responseBody = responseBody;
    Error.captureStackTrace(this, ServiceException);
  }
}
