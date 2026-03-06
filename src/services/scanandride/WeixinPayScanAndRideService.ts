import { HttpClient, HttpResponse } from '../../core/http/HttpClient';

export interface CreateTransactionRequest {
  appid: string;
  mchid: string;
  out_trade_no: string;
  total_amount: number;
  body: string;
  notify_url?: string;
  attach?: string;
}

export interface CreateTransactionResponse {
  prepay_id: string;
}

export interface QueryTransactionRequest {
  out_trade_no?: string;
  transaction_id?: string;
}

export interface Transaction {
  out_trade_no: string;
  transaction_id?: string;
  trade_state: string;
  trade_state_desc?: string;
  total_amount?: number;
  create_time?: string;
  success_time?: string;
}

export interface QueryUserServiceRequest {
  appid: string;
  service_id: string;
  openid: string;
}

export interface UserService {
  openid: string;
  service_id: string;
  user_service_state: string;
  create_time?: string;
}

export class WeixinPayScanAndRideService {
  private httpClient: HttpClient;
  private hostName?: string;

  constructor(httpClient: HttpClient, hostName?: string) {
    this.httpClient = httpClient;
    this.hostName = hostName;
  }

  public static builder(): Builder {
    return new Builder();
  }

  private getRequestPath(path: string): string {
    let requestPath = `https://api.mch.weixin.qq.com${path}`;
    if (this.hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this.hostName);
    }
    return requestPath;
  }

  public async createTransaction(
    request: CreateTransactionRequest
  ): Promise<CreateTransactionResponse> {
    const requestPath = this.getRequestPath('/v3/scanandride/transactions');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response: HttpResponse<CreateTransactionResponse> = await this.httpClient.post<CreateTransactionResponse>(
      requestPath,
      request,
      headers
    );
    return response.data;
  }

  public async queryTransaction(request: QueryTransactionRequest): Promise<Transaction> {
    const params: string[] = [];
    if (request.out_trade_no) params.push(`out_trade_no=${request.out_trade_no}`);
    if (request.transaction_id) params.push(`transaction_id=${request.transaction_id}`);

    const requestPath = this.getRequestPath(
      `/v3/scanandride/transactions${params.length > 0 ? '?' + params.join('&') : ''}`
    );
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response: HttpResponse<Transaction> = await this.httpClient.get<Transaction>(
      requestPath,
      headers
    );
    return response.data;
  }

  public async queryUserService(request: QueryUserServiceRequest): Promise<UserService> {
    const { appid, service_id, openid } = request;
    const requestPath = this.getRequestPath(
      `/v3/scanandride/user-service?appid=${appid}&service_id=${service_id}&openid=${openid}`
    );
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response: HttpResponse<UserService> = await this.httpClient.get<UserService>(
      requestPath,
      headers
    );
    return response.data;
  }
}

export class Builder {
  private httpClientValue?: HttpClient;
  private hostNameValue?: string;

  public httpClient(httpClient: HttpClient): Builder {
    this.httpClientValue = httpClient;
    return this;
  }

  public hostName(hostName: string): Builder {
    this.hostNameValue = hostName;
    return this;
  }

  public build(): WeixinPayScanAndRideService {
    if (!this.httpClientValue) {
      throw new Error('httpClient is required');
    }
    return new WeixinPayScanAndRideService(this.httpClientValue, this.hostNameValue);
  }
}
