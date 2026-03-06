import { HttpClient } from '../../core/http/HttpClient';
import { Config } from '../../core/Config';

export interface CreateParkingRequest {
  appid: string;
  mchid: string;
  out_parking_no: string;
  plate_number: string;
  parking_name?: string;
  notify_url?: string;
}

export interface CreateParkingResponse {
  parking_id: string;
  out_parking_no: string;
}

export interface QueryPlateServiceRequest {
  appid: string;
  plate_number: string;
}

export interface PlateService {
  plate_number: string;
  openid: string;
  service_open: boolean;
  bind_time?: string;
}

export interface CreateParkingTransactionRequest {
  appid: string;
  mchid: string;
  parking_id: string;
  out_trade_no: string;
  total_amount: number;
  body: string;
  notify_url?: string;
}

export interface CreateParkingTransactionResponse {
  prepay_id: string;
}

export interface QueryParkingTransactionRequest {
  parking_id: string;
  out_trade_no?: string;
  transaction_id?: string;
}

export interface ParkingTransaction {
  parking_id: string;
  out_trade_no: string;
  transaction_id?: string;
  trade_state: string;
  trade_state_desc?: string;
  total_amount?: number;
  create_time?: string;
  success_time?: string;
}

export class WexinPayScoreParkingService {
  private _httpClient: HttpClient;
  private _hostName?: string;

  constructor(httpClient: HttpClient, hostName?: string) {
    this._httpClient = httpClient;
    this._hostName = hostName;
  }

  public static builder(): WexinPayScoreParkingServiceBuilder {
    return new WexinPayScoreParkingServiceBuilder();
  }

  private getRequestPath(path: string): string {
    let requestPath = `https://api.mch.weixin.qq.com${path}`;
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }
    return requestPath;
  }

  public async createParking(request: CreateParkingRequest): Promise<CreateParkingResponse> {
    const requestPath = this.getRequestPath('/v3/parking/parkings');
    const response = await this._httpClient.post(requestPath, request);
    return response.data as CreateParkingResponse;
  }

  public async queryPlateService(request: QueryPlateServiceRequest): Promise<PlateService> {
    const { appid, plate_number } = request;
    const requestPath = this.getRequestPath(
      `/v3/parking/services/find?appid=${appid}&plate_number=${encodeURIComponent(plate_number)}`
    );
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data as PlateService;
  }

  public async createTransaction(
    request: CreateParkingTransactionRequest
  ): Promise<CreateParkingTransactionResponse> {
    const requestPath = this.getRequestPath('/v3/parking/transactions');
    const response = await this._httpClient.post(requestPath, request);
    return response.data as CreateParkingTransactionResponse;
  }

  public async queryTransaction(request: QueryParkingTransactionRequest): Promise<ParkingTransaction> {
    const { parking_id, ...params } = request;
    const queryParams: string[] = [`parking_id=${parking_id}`];
    if (params.out_trade_no) queryParams.push(`out_trade_no=${params.out_trade_no}`);
    if (params.transaction_id) queryParams.push(`transaction_id=${params.transaction_id}`);

    const requestPath = this.getRequestPath(`/v3/parking/transactions?${queryParams.join('&')}`);
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data as ParkingTransaction;
  }
}

export class WexinPayScoreParkingServiceBuilder {
  private _httpClient?: HttpClient;
  private _hostName?: string;

  public config(config: Config): WexinPayScoreParkingServiceBuilder {
    this._httpClient = config.createHttpClient();
    return this;
  }

  public httpClient(httpClient: HttpClient): WexinPayScoreParkingServiceBuilder {
    this._httpClient = httpClient;
    return this;
  }

  public hostName(hostName: string): WexinPayScoreParkingServiceBuilder {
    this._hostName = hostName;
    return this;
  }

  public build(): WexinPayScoreParkingService {
    if (!this._httpClient) {
      throw new Error('httpClient is required');
    }
    return new WexinPayScoreParkingService(this._httpClient, this._hostName);
  }
}
