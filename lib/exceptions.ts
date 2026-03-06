/**
 * HTTP 异常
 * 发送 HTTP 请求失败时抛出，例如构建请求参数失败、发送请求失败、I/O 错误等
 */
export class HttpException extends Error {
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

/**
 * 验签异常
 * 验证微信支付签名失败时抛出
 */
export class ValidationException extends Error {
  public readonly reason?: string;

  constructor(message: string, reason?: string) {
    super(message);
    this.name = 'ValidationException';
    this.reason = reason;
    Error.captureStackTrace(this, ValidationException);
  }
}

/**
 * 服务异常
 * 发送 HTTP 请求成功，但服务返回异常（状态码小于 200 或大于等于 300）
 */
export class ServiceException extends Error {
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

/**
 * 消息格式异常
 * 服务返回成功，但返回内容异常（content-type 不为 application/json、解析返回体失败等）
 */
export class MalformedMessageException extends Error {
  public readonly contentType?: string;
  public readonly responseBody?: string;

  constructor(message: string, contentType?: string, responseBody?: string) {
    super(message);
    this.name = 'MalformedMessageException';
    this.contentType = contentType;
    this.responseBody = responseBody;
    Error.captureStackTrace(this, MalformedMessageException);
  }
}

/**
 * 加密异常
 * 加密或解密失败时抛出
 */
export class CipherException extends Error {
  public readonly operation: 'encrypt' | 'decrypt';

  constructor(message: string, operation: 'encrypt' | 'decrypt') {
    super(message);
    this.name = 'CipherException';
    this.operation = operation;
    Error.captureStackTrace(this, CipherException);
  }
}

/**
 * 证书异常
 * 证书相关操作失败时抛出
 */
export class CertificateException extends Error {
  public readonly operation?: string;

  constructor(message: string, operation?: string) {
    super(message);
    this.name = 'CertificateException';
    this.operation = operation;
    Error.captureStackTrace(this, CertificateException);
  }
}
