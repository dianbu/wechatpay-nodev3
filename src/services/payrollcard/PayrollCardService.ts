import { HttpClient } from '../../core/http/HttpClient';
import { Config } from '../../core/Config';

export interface PreOrderAuthenticationRequest {
  openid: string;
  authenticate_number: string;
  authenticate_type: string;
}

export interface PreOrderAuthenticationResponse {
  authenticate_number: string;
  authenticate_type: string;
  openid: string;
  authenticate_state: string;
  authenticate_time?: string;
}

export interface PreOrderAuthenticationWithAuthRequest {
  openid: string;
  authenticate_number: string;
  authenticate_type: string;
  auth_code: string;
}

export interface GetAuthenticationRequest {
  openid: string;
  authenticate_number: string;
}

export interface Authentication {
  openid: string;
  authenticate_number: string;
  authenticate_type: string;
  authenticate_state: string;
  authenticate_time?: string;
}

export interface ListAuthenticationsRequest {
  openid: string;
  offset?: number;
  limit?: number;
  authenticate_type?: string;
  authenticate_state?: string;
}

export interface ListAuthenticationsResponse {
  data?: Authentication[];
  total_count: number;
  offset: number;
  limit: number;
}

export interface GetRelationRequest {
  openid: string;
  mchid: string;
}

export interface Relation {
  openid: string;
  mchid: string;
  relation_type: string;
  create_time?: string;
}

export interface CreateTokenRequest {
  openid: string;
  mchid: string;
}

export interface CreateTokenResponse {
  token: string;
  openid: string;
  mchid: string;
  create_time: string;
}

export interface CreateTransferBatchRequest {
  openid: string;
  mchid: string;
  out_batch_no: string;
  batch_name: string;
  batch_remark: string;
  total_amount: number;
  total_num: number;
  transfer_detail_list: Array<{
    out_detail_no: string;
    transfer_amount: number;
    transfer_remark: string;
    openid: string;
  }>;
}

export interface CreateTransferBatchResponse {
  out_batch_no: string;
  batch_id: string;
  batch_status: string;
  create_time: string;
}

export class PayrollCardService {
  private _httpClient: HttpClient;
  private _hostName?: string;

  constructor(httpClient: HttpClient, hostName?: string) {
    this._httpClient = httpClient;
    this._hostName = hostName;
  }

  public static builder(): PayrollCardServiceBuilder {
    return new PayrollCardServiceBuilder();
  }

  private getRequestPath(path: string): string {
    let requestPath = `https://api.mch.weixin.qq.com${path}`;
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }
    return requestPath;
  }

  public async preOrderAuthentication(
    request: PreOrderAuthenticationRequest
  ): Promise<PreOrderAuthenticationResponse> {
    const requestPath = this.getRequestPath('/v3/payroll-card/authentications/pre-order');
    const response = await this._httpClient.post(requestPath, request);
    return response.data as PreOrderAuthenticationResponse;
  }

  public async preOrderAuthenticationWithAuth(
    request: PreOrderAuthenticationWithAuthRequest
  ): Promise<PreOrderAuthenticationResponse> {
    const requestPath = this.getRequestPath('/v3/payroll-card/authentications/pre-order-with-auth');
    const response = await this._httpClient.post(requestPath, request);
    return response.data as PreOrderAuthenticationResponse;
  }

  public async getAuthentication(request: GetAuthenticationRequest): Promise<Authentication> {
    const { openid, authenticate_number } = request;
    const requestPath = this.getRequestPath(
      `/v3/payroll-card/authentications?openid=${openid}&authenticate_number=${authenticate_number}`
    );
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data as Authentication;
  }

  public async listAuthentications(
    request: ListAuthenticationsRequest
  ): Promise<ListAuthenticationsResponse> {
    const { openid, ...params } = request;
    const queryParams: string[] = [`openid=${openid}`];
    if (params.offset !== undefined) queryParams.push(`offset=${params.offset}`);
    if (params.limit !== undefined) queryParams.push(`limit=${params.limit}`);
    if (params.authenticate_type) queryParams.push(`authenticate_type=${params.authenticate_type}`);
    if (params.authenticate_state) queryParams.push(`authenticate_state=${params.authenticate_state}`);

    const requestPath = this.getRequestPath(
      `/v3/payroll-card/authentications?${queryParams.join('&')}`
    );
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data as ListAuthenticationsResponse;
  }

  public async getRelation(request: GetRelationRequest): Promise<Relation> {
    const { openid, mchid } = request;
    const requestPath = this.getRequestPath(
      `/v3/payroll-card/relations?openid=${openid}&mchid=${mchid}`
    );
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data as Relation;
  }

  public async createToken(request: CreateTokenRequest): Promise<CreateTokenResponse> {
    const requestPath = this.getRequestPath('/v3/payroll-card/tokens');
    const response = await this._httpClient.post(requestPath, request);
    return response.data as CreateTokenResponse;
  }

  public async createTransferBatch(
    request: CreateTransferBatchRequest
  ): Promise<CreateTransferBatchResponse> {
    const requestPath = this.getRequestPath('/v3/payroll-card/transfer-batches');
    const response = await this._httpClient.post(requestPath, request);
    return response.data as CreateTransferBatchResponse;
  }
}

export class PayrollCardServiceBuilder {
  private _httpClient?: HttpClient;
  private _hostName?: string;

  public config(config: Config): PayrollCardServiceBuilder {
    this._httpClient = config.createHttpClient();
    return this;
  }

  public httpClient(httpClient: HttpClient): PayrollCardServiceBuilder {
    this._httpClient = httpClient;
    return this;
  }

  public hostName(hostName: string): PayrollCardServiceBuilder {
    this._hostName = hostName;
    return this;
  }

  public build(): PayrollCardService {
    if (!this._httpClient) {
      throw new Error('httpClient is required');
    }
    return new PayrollCardService(this._httpClient, this._hostName);
  }
}
