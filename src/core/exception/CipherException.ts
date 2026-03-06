import { WechatPayException } from './WechatPayException';

/**
 * 加密异常
 * 加密或解密失败时抛出
 * 
 * @public
 */
export class CipherException extends WechatPayException {
  public readonly operation: 'encrypt' | 'decrypt';

  constructor(message: string, operation: 'encrypt' | 'decrypt') {
    super(message);
    this.name = 'CipherException';
    this.operation = operation;
    Error.captureStackTrace(this, CipherException);
  }
}
