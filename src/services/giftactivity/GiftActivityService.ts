import { HttpClient } from '../../core/http/HttpClient';
import { Config } from '../../core/Config';

export interface CreateFullSendActRequest {
  activity_name: string;
  activity_second_title?: string;
  merchant_logo_url?: string;
  background_color?: string;
  coupon_code_mode?: string;
  begin_time: string;
  end_time: string;
  available_periods?: Array<{
    begin_time: string;
    end_time: string;
  }>;
  unavailable_periods?: Array<{
    begin_time: string;
    end_time: string;
  }>;
  coupon_list: Array<{
    coupon_id: string;
    coupon_name: string;
    coupon_type: string;
    coupon_amount: number;
    transaction_minimum: number;
    coupon_stock_id?: string;
  }>;
  limit_pay_appids?: string[];
}

export interface CreateFullSendActResponse {
  activity_id: string;
  create_time: string;
}

export interface GetActDetailRequest {
  activity_id: string;
}

export interface ActDetail {
  activity_id: string;
  activity_name: string;
  activity_second_title?: string;
  merchant_logo_url?: string;
  background_color?: string;
  begin_time: string;
  end_time: string;
  status: string;
  create_time: string;
  update_time?: string;
}

export interface ListActivitiesRequest {
  offset?: number;
  limit?: number;
  activity_status?: string;
  begin_time?: string;
  end_time?: string;
}

export interface ListActivitiesResponse {
  data?: ActDetail[];
  total_count: number;
  offset: number;
  limit: number;
}

export interface TerminateActivityRequest {
  activity_id: string;
}

export interface TerminateActivityResponse {
  activity_id: string;
}

export interface AddActivityMerchantRequest {
  activity_id: string;
  merchant_id_list: string[];
}

export interface AddActivityMerchantResponse {
  activity_id: string;
  add_time: string;
}

export interface DeleteActivityMerchantRequest {
  activity_id: string;
  merchant_id_list: string[];
}

export interface DeleteActivityMerchantResponse {
  activity_id: string;
  delete_time: string;
}

export interface ListActivityMerchantRequest {
  activity_id: string;
  offset?: number;
  limit?: number;
}

export interface ListActivityMerchantResponse {
  data?: Array<{
    merchant_id: string;
    merchant_name?: string;
    create_time: string;
  }>;
  total_count: number;
  offset: number;
  limit: number;
}

export interface ListActivitySkuRequest {
  activity_id: string;
  offset?: number;
  limit?: number;
}

export interface ListActivitySkuResponse {
  data?: Array<{
    coupon_id: string;
    coupon_name: string;
    coupon_type: string;
    coupon_amount: number;
    transaction_minimum: number;
    coupon_stock_id?: string;
  }>;
  total_count: number;
  offset: number;
  limit: number;
}

export class GiftActivityService {
  private _httpClient: HttpClient;
  private _hostName?: string;

  constructor(httpClient: HttpClient, hostName?: string) {
    this._httpClient = httpClient;
    this._hostName = hostName;
  }

  public static builder(): GiftActivityServiceBuilder {
    return new GiftActivityServiceBuilder();
  }

  private getRequestPath(path: string): string {
    let requestPath = `https://api.mch.weixin.qq.com${path}`;
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }
    return requestPath;
  }

  public async createFullSendAct(
    request: CreateFullSendActRequest
  ): Promise<CreateFullSendActResponse> {
    const requestPath = this.getRequestPath('/v3/marketing/gift-activities/full-send-activities');
    const response = await this._httpClient.post(requestPath, request);
    return response.data as CreateFullSendActResponse;
  }

  public async getActDetail(request: GetActDetailRequest): Promise<ActDetail> {
    const { activity_id } = request;
    const requestPath = this.getRequestPath(`/v3/marketing/gift-activities/${activity_id}`);
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data as ActDetail;
  }

  public async listActivities(
    request: ListActivitiesRequest
  ): Promise<ListActivitiesResponse> {
    const params: string[] = [];
    if (request.offset !== undefined) params.push(`offset=${request.offset}`);
    if (request.limit !== undefined) params.push(`limit=${request.limit}`);
    if (request.activity_status) params.push(`activity_status=${request.activity_status}`);
    if (request.begin_time) params.push(`begin_time=${request.begin_time}`);
    if (request.end_time) params.push(`end_time=${request.end_time}`);

    const requestPath = this.getRequestPath(
      `/v3/marketing/gift-activities${params.length > 0 ? '?' + params.join('&') : ''}`
    );
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data as ListActivitiesResponse;
  }

  public async terminateActivity(
    request: TerminateActivityRequest
  ): Promise<TerminateActivityResponse> {
    const { activity_id } = request;
    const requestPath = this.getRequestPath(`/v3/marketing/gift-activities/${activity_id}/terminate`);
    const response = await this._httpClient.post(requestPath, {});
    return response.data as TerminateActivityResponse;
  }

  public async addActivityMerchant(
    request: AddActivityMerchantRequest
  ): Promise<AddActivityMerchantResponse> {
    const { activity_id, merchant_id_list } = request;
    const requestPath = this.getRequestPath(
      `/v3/marketing/gift-activities/${activity_id}/merchants/add`
    );
    const response = await this._httpClient.post(requestPath, { merchant_id_list });
    return response.data as AddActivityMerchantResponse;
  }

  public async deleteActivityMerchant(
    request: DeleteActivityMerchantRequest
  ): Promise<DeleteActivityMerchantResponse> {
    const { activity_id, merchant_id_list } = request;
    const requestPath = this.getRequestPath(
      `/v3/marketing/gift-activities/${activity_id}/merchants/delete`
    );
    const response = await this._httpClient.post(requestPath, { merchant_id_list });
    return response.data as DeleteActivityMerchantResponse;
  }

  public async listActivityMerchant(
    request: ListActivityMerchantRequest
  ): Promise<ListActivityMerchantResponse> {
    const { activity_id, ...params } = request;
    const queryParams: string[] = [];
    if (params.offset !== undefined) queryParams.push(`offset=${params.offset}`);
    if (params.limit !== undefined) queryParams.push(`limit=${params.limit}`);

    const requestPath = this.getRequestPath(
      `/v3/marketing/gift-activities/${activity_id}/merchants${queryParams.length > 0 ? '?' + queryParams.join('&') : ''}`
    );
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data as ListActivityMerchantResponse;
  }

  public async listActivitySku(
    request: ListActivitySkuRequest
  ): Promise<ListActivitySkuResponse> {
    const { activity_id, ...params } = request;
    const queryParams: string[] = [];
    if (params.offset !== undefined) queryParams.push(`offset=${params.offset}`);
    if (params.limit !== undefined) queryParams.push(`limit=${params.limit}`);

    const requestPath = this.getRequestPath(
      `/v3/marketing/gift-activities/${activity_id}/skus${queryParams.length > 0 ? '?' + queryParams.join('&') : ''}`
    );
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data as ListActivitySkuResponse;
  }
}

export class GiftActivityServiceBuilder {
  private _httpClient?: HttpClient;
  private _hostName?: string;

  public config(config: Config): GiftActivityServiceBuilder {
    this._httpClient = config.createHttpClient();
    return this;
  }

  public httpClient(httpClient: HttpClient): GiftActivityServiceBuilder {
    this._httpClient = httpClient;
    return this;
  }

  public hostName(hostName: string): GiftActivityServiceBuilder {
    this._hostName = hostName;
    return this;
  }

  public build(): GiftActivityService {
    if (!this._httpClient) {
      throw new Error('httpClient is required');
    }
    return new GiftActivityService(this._httpClient, this._hostName);
  }
}
