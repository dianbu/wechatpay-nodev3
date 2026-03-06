import superagent from 'superagent';
import { WechatPayException } from '../exception/WechatPayException';
import { HttpException } from '../exception/HttpException';
import { ServiceException } from '../exception/ServiceException';

/**
 * HTTP 请求配置
 * 
 * @public
 */
export interface HttpRequestConfig {
  /**
   * 连接超时时间（毫秒），默认 10000ms
   */
  connectTimeoutMs?: number;

  /**
   * 读取超时时间（毫秒），默认 10000ms
   */
  readTimeoutMs?: number;

  /**
   * 写入超时时间（毫秒），默认 10000ms
   */
  writeTimeoutMs?: number;

  /**
   * HTTP 代理配置
   */
  proxy?: {
    host: string;
    port: number;
    username?: string;
    password?: string;
  };

  /**
   * 禁用重试，默认 false
   */
  disableRetryOnConnectionFailure?: boolean;

  /**
   * 启用双域名容灾，默认 false
   */
  enableMultiDomainRetry?: boolean;

  /**
   * 最大重试次数，默认 2
   */
  maxRetries?: number;

  /**
   * User-Agent，默认 'wechatpay-nodev3/3.0.0'
   */
  userAgent?: string;
}

/**
 * HTTP 响应
 * 
 * @public
 */
export interface HttpResponse<T = any> {
  /**
   * HTTP 状态码
   */
  status: number;

  /**
   * 响应头
   */
  headers: Record<string, string>;

  /**
   * 响应数据
   */
  data: T;

  /**
   * 响应体原始内容
   */
  body: string;
}

/**
 * HTTP 客户端接口
 * 
 * @public
 */
export interface HttpClient {
  /**
   * GET 请求
   */
  get<T = any>(url: string, headers?: Record<string, string>): Promise<HttpResponse<T>>;

  /**
   * POST 请求
   */
  post<T = any>(url: string, data?: any, headers?: Record<string, string>): Promise<HttpResponse<T>>;

  /**
   * PUT 请求
   */
  put<T = any>(url: string, data?: any, headers?: Record<string, string>): Promise<HttpResponse<T>>;

  /**
   * PATCH 请求
   */
  patch<T = any>(url: string, data?: any, headers?: Record<string, string>): Promise<HttpResponse<T>>;

  /**
   * DELETE 请求
   */
  delete<T = any>(url: string, headers?: Record<string, string>): Promise<HttpResponse<T>>;
}

/**
 * 默认 HTTP 客户端实现
 * 支持超时、重试、双域名容灾、代理等功能
 * 
 * @public
 */
export class DefaultHttpClient implements HttpClient {
  private readonly config: Required<HttpRequestConfig>;
  private currentDomainIndex: number = 0;
  private readonly domains: string[] = ['api.mch.weixin.qq.com'];

  constructor(config?: HttpRequestConfig) {
    this.config = {
      connectTimeoutMs: config?.connectTimeoutMs ?? 10000,
      readTimeoutMs: config?.readTimeoutMs ?? 10000,
      writeTimeoutMs: config?.writeTimeoutMs ?? 10000,
      userAgent: config?.userAgent ?? 'wechatpay-nodev3/3.0.0',
      maxRetries: config?.maxRetries ?? 2,
      enableMultiDomainRetry: config?.enableMultiDomainRetry ?? false,
      disableRetryOnConnectionFailure: config?.disableRetryOnConnectionFailure ?? false,
      proxy: config?.proxy ?? { host: '', port: 0 },
    };

    // 如果启用双域名容灾，添加备用域名
    if (this.config.enableMultiDomainRetry) {
      this.domains.push('api2.wechatpay.cn');
    }
  }

  async get<T = any>(url: string, headers?: Record<string, string>): Promise<HttpResponse<T>> {
    return this.request<T>('GET', url, undefined, headers);
  }

  async post<T = any>(url: string, data?: any, headers?: Record<string, string>): Promise<HttpResponse<T>> {
    return this.request<T>('POST', url, data, headers);
  }

  async put<T = any>(url: string, data?: any, headers?: Record<string, string>): Promise<HttpResponse<T>> {
    return this.request<T>('PUT', url, data, headers);
  }

  async patch<T = any>(url: string, data?: any, headers?: Record<string, string>): Promise<HttpResponse<T>> {
    return this.request<T>('PATCH', url, data, headers);
  }

  async delete<T = any>(url: string, headers?: Record<string, string>): Promise<HttpResponse<T>> {
    return this.request<T>('DELETE', url, undefined, headers);
  }

  private async request<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<HttpResponse<T>> {
    let lastError: any = null;
    let retryCount = 0;

    while (retryCount <= this.config.maxRetries) {
      try {
        // 尝试当前域名
        for (let i = this.currentDomainIndex; i < this.domains.length; i++) {
          try {
            const result = await this.executeRequest<T>(method, url, data, {
              ...headers,
              'User-Agent': this.config.userAgent,
              'Accept-Encoding': 'gzip',
            });

            // 成功则重置域名索引
            this.currentDomainIndex = 0;
            return result;
          } catch (domainError) {
            lastError = domainError;

            // 如果是连接失败且启用了双域名重试，尝试下一个域名
            if (
              this.config.enableMultiDomainRetry &&
              this.isConnectionError(domainError) &&
              i < this.domains.length - 1
            ) {
              this.currentDomainIndex = i + 1;
              console.warn(`域名 ${this.domains[i]} 访问失败，尝试切换到备用域名 ${this.domains[i + 1]}`);
              continue;
            }

            throw domainError;
          }
        }

        throw lastError;
      } catch (error) {
        // 判断是否需要重试
        if (this.shouldRetry(error) && retryCount < this.config.maxRetries) {
          retryCount++;
          console.warn(`请求失败，第 ${retryCount} 次重试...`, error);
          await this.sleep(100 * Math.pow(2, retryCount)); // 指数退避
          continue;
        }

        // 不需要重试或达到最大重试次数，抛出异常
        throw this.createException(error, method, url, data);
      }
    }

    throw lastError;
  }

  private async executeRequest<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    data?: any,
    headers: Record<string, string> = {}
  ): Promise<HttpResponse<T>> {
    const timeout = Math.min(
      this.config.connectTimeoutMs,
      this.config.readTimeoutMs,
      this.config.writeTimeoutMs
    );

    const request = superagent(method, url)
      .set(headers)
      .timeout({
        response: timeout,
        deadline: timeout,
      });

    // 配置代理
    if (this.config.proxy && this.config.proxy.host) {
      const proxyAgent = this.createProxyAgent();
      if (proxyAgent) {
        (request as any).agent(proxyAgent);
      }
    }

    // 添加请求体（仅 POST/PUT/PATCH）
    if (['POST', 'PUT', 'PATCH'].includes(method) && data) {
      if (this.isFileUpload(data)) {
        // 文件上传
        request.attach('file', data.file, data.filename || 'upload.jpg');
        if (data.meta) {
          request.field('meta', JSON.stringify(data.meta));
        }
      } else {
        // JSON 请求
        request.send(data);
      }
    }

    const response = await request;

    // 处理响应
    let parsedData: T;
    try {
      if (response.type === 'application/json' || response.type === 'text/json') {
        parsedData = response.body;
      } else if (response.type === 'text/plain') {
        parsedData = response.text as any;
      } else {
        parsedData = response.body;
      }
    } catch {
      parsedData = response.body;
    }

    return {
      status: response.status,
      headers: response.headers,
      data: parsedData,
      body: response.text,
    };
  }

  private createProxyAgent(): any {
    try {
      const HttpsProxyAgent = require('https-proxy-agent');
      const proxyUrl = `http://${this.config.proxy.host}:${this.config.proxy.port}`;
      return new HttpsProxyAgent(proxyUrl);
    } catch (error) {
      console.warn('创建代理失败，请确保安装了 https-proxy-agent 包');
      return null;
    }
  }

  private isFileUpload(data: any): boolean {
    return data && (data.file || data.pic_buffer);
  }

  private isConnectionError(error: any): boolean {
    const connectionErrors = ['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'ENETUNREACH'];
    return error.code && connectionErrors.includes(error.code);
  }

  private shouldRetry(error: any): boolean {
    // 连接失败且未禁用重试
    if (!this.config.disableRetryOnConnectionFailure && this.isConnectionError(error)) {
      return true;
    }

    // 5xx 服务器错误
    if (error.status && error.status >= 500 && error.status < 600) {
      return true;
    }

    return false;
  }

  private createException(error: any, method: string, url: string, data?: any): Error {
    // HTTP 异常
    if (error.status) {
      if (error.status >= 500) {
        return new ServiceException(
          `微信支付服务异常，状态码：${error.status}`,
          error.status,
          error.response?.body?.code,
          error.response?.body?.message,
          error.response?.body
        );
      } else if (error.status >= 400) {
        return new ServiceException(
          `请求失败，状态码：${error.status}`,
          error.status,
          error.response?.body?.code,
          error.response?.body?.message,
          error.response?.body
        );
      }
    }

    // 默认 HTTP 异常
    return new HttpException(
      `HTTP 请求失败：${error.message || '未知错误'}`,
      error.status,
      {
        method,
        url,
        body: data,
      }
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 切换域名（手动触发）
   */
  public switchDomain(): void {
    if (this.domains.length > 1) {
      this.currentDomainIndex = (this.currentDomainIndex + 1) % this.domains.length;
      console.log(`切换到域名：${this.domains[this.currentDomainIndex]}`);
    }
  }

  /**
   * 获取当前域名
   */
  public getCurrentDomain(): string {
    return this.domains[this.currentDomainIndex];
  }
}
