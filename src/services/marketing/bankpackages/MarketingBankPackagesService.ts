import { HttpClient } from '../../../core/http/HttpClient';
import { Config } from '../../../core/Config';

export interface ListTaskRequest {
  offset?: number;
  limit?: number;
}

export interface TaskInfo {
  task_id: string;
  task_name?: string;
  status: string;
  create_time?: string;
  update_time?: string;
}

export interface ListTaskResponse {
  data?: TaskInfo[];
  total_count: number;
  offset: number;
  limit: number;
}

export class MarketingBankPackagesService {
  private _httpClient: HttpClient;
  private _hostName?: string;

  constructor(httpClient: HttpClient, hostName?: string) {
    this._httpClient = httpClient;
    this._hostName = hostName;
  }

  public static builder(): MarketingBankPackagesBuilder {
    return new MarketingBankPackagesBuilder();
  }

  private getRequestPath(path: string): string {
    let requestPath = `https://api.mch.weixin.qq.com${path}`;
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }
    return requestPath;
  }

  /**
   * 查询上传任务列表
   */
  public async listTask(request: ListTaskRequest): Promise<ListTaskResponse> {
    const params: string[] = [];
    if (request.offset !== undefined) params.push(`offset=${request.offset}`);
    if (request.limit !== undefined) params.push(`limit=${request.limit}`);

    const requestPath = this.getRequestPath(
      `/v3/marketing-bank-packages/tasks${params.length > 0 ? '?' + params.join('&') : ''}`
    );
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data as ListTaskResponse;
  }
}

export class MarketingBankPackagesBuilder {
  private _httpClient?: HttpClient;
  private _hostName?: string;

  public config(config: Config): MarketingBankPackagesBuilder {
    this._httpClient = config.createHttpClient();
    return this;
  }

  public httpClient(httpClient: HttpClient): MarketingBankPackagesBuilder {
    this._httpClient = httpClient;
    return this;
  }

  public hostName(hostName: string): MarketingBankPackagesBuilder {
    this._hostName = hostName;
    return this;
  }

  public build(): MarketingBankPackagesService {
    if (!this._httpClient) {
      throw new Error('httpClient is required');
    }
    return new MarketingBankPackagesService(this._httpClient, this._hostName);
  }
}
