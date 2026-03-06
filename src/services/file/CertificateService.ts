import { HttpClient, HttpResponse } from '../../core/http/HttpClient';
import { Config } from '../../core/Config';

export interface Certificate {
  serial_no: string;
  effective_time: string;
  expire_time: string;
  encrypt_certificate: {
    algorithm: string;
    nonce: string;
    associated_data: string;
    ciphertext: string;
  };
}

export interface DownloadCertificateResponse {
  data: Certificate[];
}

export class CertificateService {
  private _httpClient: HttpClient;
  private _hostName?: string;

  constructor(httpClient: HttpClient, hostName?: string) {
    this._httpClient = httpClient;
    this._hostName = hostName;
  }

  public static builder(): CertificateServiceBuilder {
    return new CertificateServiceBuilder();
  }

  private getRequestPath(path: string): string {
    let requestPath = `https://api.mch.weixin.qq.com${path}`;
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }
    return requestPath;
  }

  /**
   * 下载微信支付平台证书列表
   */
  public async downloadCertificate(): Promise<DownloadCertificateResponse> {
    const requestPath = this.getRequestPath('/v3/certificates');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data as DownloadCertificateResponse;
  }

  /**
   * 下载微信支付平台证书列表（指定请求路径）
   */
  public async downloadCertificateWithPath(requestPath: string): Promise<DownloadCertificateResponse> {
    const fullPath = this.getRequestPath(requestPath);
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response = await this._httpClient.get(fullPath, headers);
    return response.data as DownloadCertificateResponse;
  }

  /**
   * 下载微信支付平台证书列表（使用解密器）
   */
  public async downloadCertificateWithDecryptor(): Promise<DownloadCertificateResponse> {
    return this.downloadCertificate();
  }
}

export class CertificateServiceBuilder {
  private _httpClient?: HttpClient;
  private _hostName?: string;

  public config(config: Config): CertificateServiceBuilder {
    this._httpClient = config.createHttpClient();
    return this;
  }

  public httpClient(httpClient: HttpClient): CertificateServiceBuilder {
    this._httpClient = httpClient;
    return this;
  }

  public hostName(hostName: string): CertificateServiceBuilder {
    this._hostName = hostName;
    return this;
  }

  public build(): CertificateService {
    if (!this._httpClient) {
      throw new Error('httpClient is required');
    }
    return new CertificateService(this._httpClient, this._hostName);
  }
}
