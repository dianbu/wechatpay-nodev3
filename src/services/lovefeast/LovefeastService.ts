import { HttpClient } from '../../core/http/HttpClient';
import { Config } from '../../core/Config';

export interface GetBrandRequest {
  brand_id: string;
}

export interface Brand {
  brand_id: string;
  brand_name: string;
  brand_logo_url?: string;
  status: string;
  create_time?: string;
  update_time?: string;
}

export interface GetByUserRequest {
  openid: string;
}

export interface UserLovefeast {
  openid: string;
  brand_id: string;
  brand_name: string;
  status: string;
  create_time?: string;
}

export interface ListByUserRequest {
  openid: string;
  offset?: number;
  limit?: number;
}

export interface ListByUserResponse {
  data?: UserLovefeast[];
  total_count: number;
  offset: number;
  limit: number;
}

export class LovefeastService {
  private _httpClient: HttpClient;
  private _hostName?: string;

  constructor(httpClient: HttpClient, hostName?: string) {
    this._httpClient = httpClient;
    this._hostName = hostName;
  }

  public static builder(): LovefeastServiceBuilder {
    return new LovefeastServiceBuilder();
  }

  private getRequestPath(path: string): string {
    let requestPath = `https://api.mch.weixin.qq.com${path}`;
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }
    return requestPath;
  }

  public async getBrand(request: GetBrandRequest): Promise<Brand> {
    const { brand_id } = request;
    const requestPath = this.getRequestPath(`/v3/lovefeast/brands/${brand_id}`);
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data as Brand;
  }

  public async getByUser(request: GetByUserRequest): Promise<UserLovefeast> {
    const { openid } = request;
    const requestPath = this.getRequestPath(`/v3/lovefeast/users/${openid}`);
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data as UserLovefeast;
  }

  public async listByUser(request: ListByUserRequest): Promise<ListByUserResponse> {
    const { openid, ...params } = request;
    const queryParams: string[] = [];
    if (params.offset !== undefined) queryParams.push(`offset=${params.offset}`);
    if (params.limit !== undefined) queryParams.push(`limit=${params.limit}`);

    const requestPath = this.getRequestPath(
      `/v3/lovefeast/users/${openid}/brands${queryParams.length > 0 ? '?' + queryParams.join('&') : ''}`
    );
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data as ListByUserResponse;
  }
}

export class LovefeastServiceBuilder {
  private _httpClient?: HttpClient;
  private _hostName?: string;

  public config(config: Config): LovefeastServiceBuilder {
    this._httpClient = config.createHttpClient();
    return this;
  }

  public httpClient(httpClient: HttpClient): LovefeastServiceBuilder {
    this._httpClient = httpClient;
    return this;
  }

  public hostName(hostName: string): LovefeastServiceBuilder {
    this._hostName = hostName;
    return this;
  }

  public build(): LovefeastService {
    if (!this._httpClient) {
      throw new Error('httpClient is required');
    }
    return new LovefeastService(this._httpClient, this._hostName);
  }
}
