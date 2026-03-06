import request from 'superagent';
import { HttpException, ServiceException, MalformedMessageException } from './exceptions';
import { Output } from './interface-v2';

/**
 * HTTP 客户端配置
 */
export interface HttpClientConfig {
  /** 连接超时（毫秒），默认 10000ms */
  connectTimeoutMs?: number;
  /** 读取超时（毫秒），默认 10000ms */
  readTimeoutMs?: number;
  /** 写入超时（毫秒），默认 10000ms */
  writeTimeoutMs?: number;
  /** HTTP 代理配置 */
  proxy?: {
    host: string;
    port: number;
    username?: string;
    password?: string;
  };
  /** 遇到网络问题时不重试下一个 IP，默认 false（即默认会重试） */
  disableRetryOnConnectionFailure?: boolean;
  /** 启用双域名容灾，默认 false */
  enableMultiDomainRetry?: boolean;
  /** 最大重试次数，默认 2 */
  maxRetries?: number;
  /** User-Agent，默认 'wechatpay-node-v3/1.0.0' */
  userAgent?: string;
}

/**
 * 域名配置
 */
const DOMAINS = {
  PRIMARY: 'api.mch.weixin.qq.com',
  BACKUP: 'api2.wechatpay.cn',
};

/**
 * 增强的 HTTP 客户端
 * 支持超时配置、双域名容灾、自动重试等功能
 */
export class EnhancedHttpClient {
  private config: HttpClientConfig;
  private currentDomainIndex = 0;
  private readonly domains: string[] = [DOMAINS.PRIMARY];

  constructor(config?: HttpClientConfig) {
    this.config = {
      connectTimeoutMs: config?.connectTimeoutMs || 10000,
      readTimeoutMs: config?.readTimeoutMs || 10000,
      writeTimeoutMs: config?.writeTimeoutMs || 10000,
      userAgent: config?.userAgent || 'wechatpay-node-v3/1.0.0',
      maxRetries: config?.maxRetries || 2,
      enableMultiDomainRetry: config?.enableMultiDomainRetry || false,
      disableRetryOnConnectionFailure: config?.disableRetryOnConnectionFailure || false,
    };

    // 如果启用双域名容灾，添加备用域名
    if (this.config.enableMultiDomainRetry) {
      this.domains.push(DOMAINS.BACKUP);
    }
  }

  /**
   * GET 请求
   */
  async get(url: string, headers: Record<string, string> = {}): Promise<Output> {
    return this.request('GET', url, undefined, headers);
  }

  /**
   * POST 请求
   */
  async post(url: string, params: any, headers: Record<string, string> = {}): Promise<Output> {
    return this.request('POST', url, params, headers);
  }

  /**
   * 通用请求方法
   */
  private async request(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    params?: any,
    headers: Record<string, string> = {}
  ): Promise<Output> {
    let lastError: any = null;
    let retryCount = 0;

    while (retryCount <= (this.config.maxRetries || 0)) {
      try {
        // 尝试当前域名
        for (let i = this.currentDomainIndex; i < this.domains.length; i++) {
          try {
            const result = await this.executeRequest(method, url, params, {
              ...headers,
              'User-Agent': this.config.userAgent || 'wechatpay-node-v3/1.0.0',
              'Accept-Encoding': 'gzip',
            });

            // 成功则重置域名索引
            this.currentDomainIndex = 0;
            return result;
          } catch (domainError) {
            lastError = domainError;
            
            // 如果是连接失败且启用了双域名重试，尝试下一个域名
            if (this.config.enableMultiDomainRetry && this.isConnectionError(domainError)) {
              this.currentDomainIndex = i + 1;
              console.warn(`域名 ${this.domains[i]} 访问失败，尝试切换到备用域名`);
              continue;
            }
            
            throw domainError;
          }
        }

        // 所有域名都失败
        throw lastError;
      } catch (error) {
        // 判断是否需要重试
        if (this.shouldRetry(error) && retryCount < (this.config.maxRetries || 0)) {
          retryCount++;
          console.warn(`请求失败，第 ${retryCount} 次重试...`, error);
          continue;
        }

        // 不需要重试或达到最大重试次数，抛出异常
        throw this.createException(error, method, url, params);
      }
    }

    // 理论上不会到这里
    throw lastError;
  }

  /**
   * 执行实际请求
   */
  private async executeRequest(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    params?: any,
    headers: Record<string, string> = {}
  ): Promise<Output> {
    const req = request(method, url)
      .set(headers)
      .timeout({
        deadline: this.config.readTimeoutMs,
        response: this.config.readTimeoutMs,
      });

    // 配置代理
    if (this.config.proxy) {
      const proxyAgent = this.createProxyAgent();
      if (proxyAgent) {
        req.agent(proxyAgent);
      }
    }

    // 添加请求体（仅 POST/PUT/PATCH）
    if (['POST', 'PUT', 'PATCH'].includes(method) && params) {
      if (params.fileinfo && params.pic_buffer) {
        // 文件上传
        req.attach('file', params.pic_buffer, {
          filename: params.fileinfo.filename || 'upload.jpg',
          contentType: 'image/jpg',
        });
        req.field('meta', JSON.stringify(params.fileinfo));
      } else {
        // JSON 请求
        req.send(params);
      }
    }

    const result = await req;

    // 处理响应
    let data: any = {};
    if (result.type === 'text/plain') {
      data = {
        status: result.status,
        data: result.text,
      };
    } else if (result.type === 'application/x-gzip') {
      data = {
        status: result.status,
        data: result.body,
      };
    } else {
      data = {
        status: result.status,
        data: result.body,
      };
    }

    // 检查状态码
    if (result.status < 200 || result.status >= 300) {
      throw {
        status: result.status,
        response: result,
        data: data,
      };
    }

    return data;
  }

  /**
   * 创建代理 Agent
   */
  private createProxyAgent(): any {
    if (!this.config.proxy) return null;

    try {
      // 动态导入，避免依赖问题
      const HttpsProxyAgent = require('https-proxy-agent');
      const proxyUrl = `http://${this.config.proxy.host}:${this.config.proxy.port}`;
      return new HttpsProxyAgent(proxyUrl);
    } catch (error) {
      console.warn('创建代理失败，请确保安装了 https-proxy-agent 包');
      return null;
    }
  }

  /**
   * 判断是否为连接错误
   */
  private isConnectionError(error: any): boolean {
    const connectionErrors = [
      'ECONNREFUSED',
      'ECONNRESET',
      'ETIMEDOUT',
      'ENOTFOUND',
      'ENETUNREACH',
    ];
    
    if (error.code && connectionErrors.includes(error.code)) {
      return true;
    }
    
    if (error.errno && connectionErrors.includes(error.errno)) {
      return true;
    }

    return false;
  }

  /**
   * 判断是否应该重试
   */
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

  /**
   * 创建异常
   */
  private createException(
    error: any,
    method: string,
    url: string,
    params?: any
  ): Error {
    // HTTP 异常
    if (error.status) {
      if (error.status >= 500) {
        return new ServiceException(
          `微信支付服务异常，状态码：${error.status}`,
          error.status,
          error.data?.error?.code,
          error.data?.error?.message,
          error.data
        );
      } else if (error.status >= 400) {
        return new ServiceException(
          `请求失败，状态码：${error.status}`,
          error.status,
          error.data?.error?.code,
          error.data?.error?.message,
          error.data
        );
      }
    }

    // 消息格式异常
    if (error.response && error.response.type !== 'application/json') {
      return new MalformedMessageException(
        `响应内容类型错误：${error.response.type}`,
        error.response.type,
        error.response.text
      );
    }

    // 默认 HTTP 异常
    return new HttpException(
      `HTTP 请求失败：${error.message || '未知错误'}`,
      error.status,
      {
        method,
        url,
        body: params,
      }
    );
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

/**
 * 导出默认 HTTP 请求实现（兼容旧版本）
 */
export class PayRequest {
  private client: EnhancedHttpClient;

  constructor(config?: HttpClientConfig) {
    this.client = new EnhancedHttpClient(config);
  }

  async upload(url: string, params: Record<string, any>, headers: Record<string, any>): Promise<Output> {
    return this.client.post(url, params, headers);
  }

  async post(url: string, params: Record<string, any>, headers: Record<string, any>): Promise<Output> {
    return this.client.post(url, params, headers);
  }

  async get(url: string, headers: Record<string, any>): Promise<Output> {
    return this.client.get(url, headers);
  }
}
