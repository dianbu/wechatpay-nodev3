import { HttpClient } from '../../../core/http/HttpClient';
import { Config } from '../../../core/Config';

export interface CreateBusiFavorStockRequest {
  stock_name: string;
  stock_type: string;
  coupon_type: string;
  goods_id?: string;
  stock_manager_mchid?: string;
  fix_info?: {
    coupon_amount?: number;
    pay_transaction_minimum?: number;
  };
  discount_info?: {
    discount_amount?: number;
    pay_transaction_minimum?: number;
    max_amount?: number;
  };
  exchange_info?: {
    cost_of_points?: number;
    max_exchange_num?: number;
  };
  display_pattern_info?: {
    background_color?: string;
    description?: string;
    image_url?: string;
    front_image_url?: string;
  };
  use_info?: {
    use_method?: string;
    min_amount?: number;
    max_amount?: number;
    limit_paymodes?: Array<{
      pay_mode: string;
      appids?: string[];
    }>;
    limit_goods?: Array<{
      goods_id: string;
      goods_name?: string;
    }>;
    text?: string[];
  };
  accept_info?: {
    accept_mchids?: string[];
    reject_mchids?: string[];
    accept_appids?: string[];
    reject_appids?: string[];
  };
  date_info?: {
    type?: number;
    start_date?: string;
    end_date?: string;
    fixed_term?: number;
    delay_day?: number;
  };
  quantity_info?: {
    total_quantity?: number;
    max_quantity?: number;
    max_quantity_by_day?: number;
    max_quantity_by_user?: number;
    max_use_quantity_by_user?: number;
  };
  coupon_code_mode?: string;
  pattern_info?: {
    type?: string;
    text?: string[];
    description?: string;
    add_word?: string[];
  };
}

export interface CreateBusiFavorStockResponse {
  stock_id: string;
}

export interface QueryBusiFavorStockRequest {
  stock_id: string;
}

export interface BusiFavorStock {
  stock_id: string;
  stock_name: string;
  stock_type: string;
  coupon_type: string;
  goods_id?: string;
  stock_manager_mchid?: string;
  fix_info?: {
    coupon_amount?: number;
    pay_transaction_minimum?: number;
  };
  discount_info?: {
    discount_amount?: number;
    pay_transaction_minimum?: number;
    max_amount?: number;
  };
  exchange_info?: {
    cost_of_points?: number;
    max_exchange_num?: number;
  };
  display_pattern_info?: {
    background_color?: string;
    description?: string;
    image_url?: string;
    front_image_url?: string;
  };
  use_info?: {
    use_method?: string;
    min_amount?: number;
    max_amount?: number;
  };
  accept_info?: {
    accept_mchids?: string[];
    reject_mchids?: string[];
  };
  date_info?: {
    type?: number;
    start_date?: string;
    end_date?: string;
    fixed_term?: number;
    delay_day?: number;
  };
  quantity_info?: {
    total_quantity?: number;
    max_quantity?: number;
    max_quantity_by_day?: number;
    max_quantity_by_user?: number;
  };
  status?: string;
  create_time?: string;
  update_time?: string;
}

export interface ModifyBusiFavorStockRequest {
  stock_id: string;
  stock_name?: string;
  display_pattern_info?: {
    background_color?: string;
    description?: string;
    image_url?: string;
    front_image_url?: string;
  };
  use_info?: {
    use_method?: string;
    min_amount?: number;
    max_amount?: number;
    limit_paymodes?: Array<{
      pay_mode: string;
      appids?: string[];
    }>;
    limit_goods?: Array<{
      goods_id: string;
      goods_name?: string;
    }>;
    text?: string[];
  };
  accept_info?: {
    accept_mchids?: string[];
    reject_mchids?: string[];
    accept_appids?: string[];
    reject_appids?: string[];
  };
  date_info?: {
    type?: number;
    start_date?: string;
    end_date?: string;
    fixed_term?: number;
    delay_day?: number;
  };
  quantity_info?: {
    total_quantity?: number;
    max_quantity?: number;
    max_quantity_by_day?: number;
    max_quantity_by_user?: number;
    max_use_quantity_by_user?: number;
  };
}

export interface ModifyBusiFavorStockResponse {
  stock_id: string;
}

export interface ModifyStockBudgetRequest {
  stock_id: string;
  total_quantity?: number;
  max_quantity?: number;
  max_quantity_by_day?: number;
  max_quantity_by_user?: number;
  max_use_quantity_by_user?: number;
}

export interface ModifyStockBudgetResponse {
  stock_id: string;
}

export interface ModifyStockSendRuleRequest {
  stock_id: string;
  date_info?: {
    type?: number;
    start_date?: string;
    end_date?: string;
    fixed_term?: number;
    delay_day?: number;
  };
  quantity_info?: {
    total_quantity?: number;
    max_quantity?: number;
    max_quantity_by_day?: number;
    max_quantity_by_user?: number;
    max_use_quantity_by_user?: number;
  };
}

export interface ModifyStockSendRuleResponse {
  stock_id: string;
}

export interface SendCouponRequest {
  stock_id: string;
  coupon_count: number;
  out_request_no: string;
  send_params?: {
    openid?: string;
    coupon_code?: string;
  };
}

export interface SendCouponResponse {
  success_send_cnt?: number;
  success_coupons?: Array<{
    coupon_id: string;
    coupon_code?: string;
  }>;
  failed_coupons?: Array<{
    fail_code: string;
    fail_msg: string;
    openid?: string;
    coupon_code?: string;
  }>;
}

export interface QueryCouponRequest {
  coupon_id: string;
}

export interface Coupon {
  coupon_id: string;
  stock_id: string;
  stock_name: string;
  coupon_type: string;
  status: string;
  openid: string;
  coupon_code?: string;
  to_user_name?: string;
  discount?: number;
  reduce_cost?: number;
  least_cost?: number;
  value?: number;
  use_time?: string;
  expire_time?: string;
  use_order_id?: string;
  use_time_type?: string;
}

export interface QueryCouponsByFilterRequest {
  appid?: string;
  openid?: string;
  stock_id?: string;
  status?: string;
  offset?: number;
  limit?: number;
}

export interface QueryCouponsByFilterResponse {
  data?: Coupon[];
  total_count?: number;
  offset?: number;
  limit?: number;
}

export interface UseCouponRequest {
  coupon_id: string;
  appid: string;
  openid: string;
  order_id: string;
}

export interface UseCouponResponse {
  coupon_id: string;
  order_id: string;
}

export interface ReturnCouponRequest {
  coupon_id: string;
  appid: string;
  openid: string;
}

export interface ReturnCouponResponse {
  coupon_id: string;
}

export interface QueryCouponCodeRequest {
  stock_id: string;
  coupon_code: string;
}

export interface QueryCouponCodeResponse {
  coupon_id: string;
  coupon_code: string;
  status: string;
}

export interface QueryCouponCodeListRequest {
  stock_id: string;
  offset?: number;
  limit?: number;
  status?: string;
}

export interface CouponCodeInfo {
  coupon_id: string;
  coupon_code: string;
  status: string;
  openid?: string;
}

export interface QueryCouponCodeListResponse {
  data?: CouponCodeInfo[];
  total_count?: number;
  offset?: number;
  limit?: number;
}

export interface UploadCouponCodeRequest {
  stock_id: string;
  upload_url: string;
}

export interface UploadCouponCodeResponse {
  result_url: string;
}

export interface DeleteCouponCodeRequest {
  stock_id: string;
  coupon_code: string;
}

export interface DeleteCouponCodeResponse {
  coupon_id: string;
}

export interface AssociateTradeInfoRequest {
  coupon_id: string;
  appid: string;
  openid: string;
  trade_id: string;
}

export interface AssociateTradeInfoResponse {
  coupon_id: string;
}

export interface DisassociateTradeInfoRequest {
  coupon_id: string;
  appid: string;
  openid: string;
}

export interface DisassociateTradeInfoResponse {
  coupon_id: string;
}

export interface DeactivateCouponRequest {
  coupon_id: string;
  appid: string;
  deactivate_reason: string;
}

export interface DeactivateCouponResponse {
  coupon_id: string;
}

export interface SetCouponNotifyRequest {
  stock_id: string;
  notify_type: string;
  notify_pattern: string;
}

export interface SetCouponNotifyResponse {
  stock_id: string;
}

export interface GetCouponNotifyRequest {
  stock_id: string;
}

export interface CouponNotify {
  stock_id: string;
  notify_type: string;
  notify_pattern: string;
  notify_url?: string;
}

export interface PayReceiptInfoRequest {
  appid: string;
  mchid: string;
  out_trade_no: string;
  sub_mchid?: string;
}

export interface PayReceiptInfo {
  appid: string;
  mchid: string;
  out_trade_no: string;
  receipt_id?: string;
  receipt_type?: string;
  trade_state?: string;
  coupon_receipts?: Array<{
    coupon_id: string;
    coupon_code?: string;
    stock_name?: string;
    value?: number;
  }>;
}

export interface PayReceiptListRequest {
  appid: string;
  mchid: string;
  offset?: number;
  limit?: number;
  receipt_type?: string;
  trade_state?: string;
}

export interface PayReceiptListResponse {
  data?: PayReceiptInfo[];
  total_count?: number;
  offset?: number;
  limit?: number;
}

export interface ReturnReceiptInfoRequest {
  receipt_id: string;
}

export interface ReturnReceiptInfo {
  receipt_id: string;
  appid: string;
  mchid: string;
  out_trade_no: string;
  receipt_type: string;
  trade_state: string;
  refund_receipts?: Array<{
    refund_id: string;
    refund_amount: number;
    coupon_id?: string;
    coupon_code?: string;
  }>;
}

export interface SendGovCardRequest {
  stock_id: string;
  out_request_no: string;
  gov_appid: string;
  gov_openid: string;
}

export interface SendGovCardResponse {
  coupon_id: string;
}

export interface SendCouponToUserRequest {
  stock_id: string;
  out_request_no: string;
  send_to_openid?: string;
  send_params?: {
    openid?: string;
    coupon_code?: string;
  };
}

export interface SendCouponToUserResponse {
  success_send_cnt?: number;
  success_coupons?: Array<{
    coupon_id: string;
    coupon_code?: string;
  }>;
  failed_coupons?: Array<{
    fail_code: string;
    fail_msg: string;
    openid?: string;
    coupon_code?: string;
  }>;
}

export class MerchantExclusiveCouponService {
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

  public async createBusiFavorStock(
    request: CreateBusiFavorStockRequest
  ): Promise<CreateBusiFavorStockResponse> {
    const requestPath = this.getRequestPath('/v3/marketing/busifavor/coupon-stocks');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response = await this.httpClient.post<CreateBusiFavorStockResponse>(requestPath, request, headers);
    return response.data;
  }

  public async queryBusiFavorStock(
    request: QueryBusiFavorStockRequest
  ): Promise<BusiFavorStock> {
    const { stock_id } = request;
    const requestPath = this.getRequestPath(`/v3/marketing/busifavor/coupon-stocks/${stock_id}`);
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    const response = await this.httpClient.get<BusiFavorStock>(requestPath, headers);
    return response.data;
  }

  public async modifyBusiFavorStock(
    request: ModifyBusiFavorStockRequest
  ): Promise<ModifyBusiFavorStockResponse> {
    const { stock_id, ...body } = request;
    const requestPath = this.getRequestPath(`/v3/marketing/busifavor/coupon-stocks/${stock_id}`);
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response = await this.httpClient.patch<ModifyBusiFavorStockResponse>(requestPath, body, headers);
    return response.data;
  }

  public async modifyStockBudget(
    request: ModifyStockBudgetRequest
  ): Promise<ModifyStockBudgetResponse> {
    const { stock_id, ...body } = request;
    const requestPath = this.getRequestPath(`/v3/marketing/busifavor/coupon-stocks/${stock_id}/budget`);
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response = await this.httpClient.post<ModifyStockBudgetResponse>(requestPath, body, headers);
    return response.data;
  }

  public async modifyStockSendRule(
    request: ModifyStockSendRuleRequest
  ): Promise<ModifyStockSendRuleResponse> {
    const { stock_id, ...body } = request;
    const requestPath = this.getRequestPath(`/v3/marketing/busifavor/coupon-stocks/${stock_id}/send-rule`);
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response = await this.httpClient.post<ModifyStockSendRuleResponse>(requestPath, body, headers);
    return response.data;
  }

  public async sendCoupon(request: SendCouponRequest): Promise<SendCouponResponse> {
    const requestPath = this.getRequestPath('/v3/marketing/busifavor/coupons');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response = await this.httpClient.post<SendCouponResponse>(requestPath, request, headers);
    return response.data;
  }

  public async sendCouponToUser(
    request: SendCouponToUserRequest
  ): Promise<SendCouponToUserResponse> {
    const requestPath = this.getRequestPath('/v3/marketing/busifavor/coupons/send');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response = await this.httpClient.post<SendCouponToUserResponse>(requestPath, request, headers);
    return response.data;
  }

  public async queryCoupon(request: QueryCouponRequest): Promise<Coupon> {
    const { coupon_id } = request;
    const requestPath = this.getRequestPath(`/v3/marketing/busifavor/coupons/${coupon_id}`);
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    const response = await this.httpClient.get<Coupon>(requestPath, headers);
    return response.data;
  }

  public async queryCouponsByFilter(
    request: QueryCouponsByFilterRequest
  ): Promise<QueryCouponsByFilterResponse> {
    const params: string[] = [];
    if (request.appid) params.push(`appid=${request.appid}`);
    if (request.openid) params.push(`openid=${request.openid}`);
    if (request.stock_id) params.push(`stock_id=${request.stock_id}`);
    if (request.status) params.push(`status=${request.status}`);
    if (request.offset !== undefined) params.push(`offset=${request.offset}`);
    if (request.limit !== undefined) params.push(`limit=${request.limit}`);

    const requestPath = this.getRequestPath(
      `/v3/marketing/busifavor/coupons${params.length > 0 ? '?' + params.join('&') : ''}`
    );
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    const response = await this.httpClient.get<QueryCouponsByFilterResponse>(requestPath, headers);
    return response.data;
  }

  public async useCoupon(request: UseCouponRequest): Promise<UseCouponResponse> {
    const { coupon_id, ...body } = request;
    const requestPath = this.getRequestPath(`/v3/marketing/busifavor/coupons/${coupon_id}/use`);
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response = await this.httpClient.post<UseCouponResponse>(requestPath, body, headers);
    return response.data;
  }

  public async returnCoupon(request: ReturnCouponRequest): Promise<ReturnCouponResponse> {
    const { coupon_id, ...body } = request;
    const requestPath = this.getRequestPath(`/v3/marketing/busifavor/coupons/${coupon_id}/return`);
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response = await this.httpClient.post<ReturnCouponResponse>(requestPath, body, headers);
    return response.data;
  }

  public async queryCouponCode(
    request: QueryCouponCodeRequest
  ): Promise<QueryCouponCodeResponse> {
    const { stock_id, coupon_code } = request;
    const requestPath = this.getRequestPath(
      `/v3/marketing/busifavor/coupon-stocks/${stock_id}/coupon-codes/${coupon_code}`
    );
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    const response = await this.httpClient.get<QueryCouponCodeResponse>(requestPath, headers);
    return response.data;
  }

  public async queryCouponCodeList(
    request: QueryCouponCodeListRequest
  ): Promise<QueryCouponCodeListResponse> {
    const { stock_id, ...params } = request;
    const queryParams: string[] = [];
    if (params.offset !== undefined) queryParams.push(`offset=${params.offset}`);
    if (params.limit !== undefined) queryParams.push(`limit=${params.limit}`);
    if (params.status) queryParams.push(`status=${params.status}`);

    const requestPath = this.getRequestPath(
      `/v3/marketing/busifavor/coupon-stocks/${stock_id}/coupon-codes${queryParams.length > 0 ? '?' + queryParams.join('&') : ''}`
    );
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    const response = await this.httpClient.get<QueryCouponCodeListResponse>(requestPath, headers);
    return response.data;
  }

  public async uploadCouponCode(
    request: UploadCouponCodeRequest
  ): Promise<UploadCouponCodeResponse> {
    const { stock_id, upload_url } = request;
    const requestPath = this.getRequestPath(
      `/v3/marketing/busifavor/coupon-stocks/${stock_id}/coupon-codes/batch-add`
    );
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response = await this.httpClient.post<UploadCouponCodeResponse>(requestPath, { upload_url }, headers);
    return response.data;
  }

  public async deleteCouponCode(
    request: DeleteCouponCodeRequest
  ): Promise<DeleteCouponCodeResponse> {
    const { stock_id, coupon_code } = request;
    const requestPath = this.getRequestPath(
      `/v3/marketing/busifavor/coupon-stocks/${stock_id}/coupon-codes/${coupon_code}`
    );
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    const response = await this.httpClient.delete<DeleteCouponCodeResponse>(requestPath, headers);
    return response.data;
  }

  public async associateTradeInfo(
    request: AssociateTradeInfoRequest
  ): Promise<AssociateTradeInfoResponse> {
    const { coupon_id, ...body } = request;
    const requestPath = this.getRequestPath(
      `/v3/marketing/busifavor/coupons/${coupon_id}/associate-trades`
    );
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response = await this.httpClient.post<AssociateTradeInfoResponse>(requestPath, body, headers);
    return response.data;
  }

  public async disassociateTradeInfo(
    request: DisassociateTradeInfoRequest
  ): Promise<DisassociateTradeInfoResponse> {
    const { coupon_id, ...body } = request;
    const requestPath = this.getRequestPath(
      `/v3/marketing/busifavor/coupons/${coupon_id}/disassociate-trades`
    );
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response = await this.httpClient.post<DisassociateTradeInfoResponse>(requestPath, body, headers);
    return response.data;
  }

  public async deactivateCoupon(
    request: DeactivateCouponRequest
  ): Promise<DeactivateCouponResponse> {
    const { coupon_id, ...body } = request;
    const requestPath = this.getRequestPath(
      `/v3/marketing/busifavor/coupons/${coupon_id}/deactivate`
    );
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response = await this.httpClient.post<DeactivateCouponResponse>(requestPath, body, headers);
    return response.data;
  }

  public async setCouponNotify(
    request: SetCouponNotifyRequest
  ): Promise<SetCouponNotifyResponse> {
    const { stock_id, ...body } = request;
    const requestPath = this.getRequestPath(
      `/v3/marketing/busifavor/coupon-stocks/${stock_id}/notify`
    );
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response = await this.httpClient.post<SetCouponNotifyResponse>(requestPath, body, headers);
    return response.data;
  }

  public async getCouponNotify(
    request: GetCouponNotifyRequest
  ): Promise<CouponNotify> {
    const { stock_id } = request;
    const requestPath = this.getRequestPath(
      `/v3/marketing/busifavor/coupon-stocks/${stock_id}/notify`
    );
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    const response = await this.httpClient.get<CouponNotify>(requestPath, headers);
    return response.data;
  }

  public async payReceiptInfo(
    request: PayReceiptInfoRequest
  ): Promise<PayReceiptInfo> {
    const { appid, mchid, out_trade_no, sub_mchid } = request;
    let requestPath = this.getRequestPath(
      `/v3/marketing/busifavor/receipts?appid=${appid}&mchid=${mchid}&out_trade_no=${out_trade_no}`
    );
    if (sub_mchid) {
      requestPath += `&sub_mchid=${sub_mchid}`;
    }
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    const response = await this.httpClient.get<PayReceiptInfo>(requestPath, headers);
    return response.data;
  }

  public async payReceiptList(
    request: PayReceiptListRequest
  ): Promise<PayReceiptListResponse> {
    const { appid, mchid, ...params } = request;
    const queryParams: string[] = [`appid=${appid}`, `mchid=${mchid}`];
    if (params.offset !== undefined) queryParams.push(`offset=${params.offset}`);
    if (params.limit !== undefined) queryParams.push(`limit=${params.limit}`);
    if (params.receipt_type) queryParams.push(`receipt_type=${params.receipt_type}`);
    if (params.trade_state) queryParams.push(`trade_state=${params.trade_state}`);

    const requestPath = this.getRequestPath(
      `/v3/marketing/busifavor/receipts?${queryParams.join('&')}`
    );
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    const response = await this.httpClient.get<PayReceiptListResponse>(requestPath, headers);
    return response.data;
  }

  public async returnReceiptInfo(
    request: ReturnReceiptInfoRequest
  ): Promise<ReturnReceiptInfo> {
    const { receipt_id } = request;
    const requestPath = this.getRequestPath(
      `/v3/marketing/busifavor/receipts/${receipt_id}/return`
    );
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    const response = await this.httpClient.get<ReturnReceiptInfo>(requestPath, headers);
    return response.data;
  }

  public async sendGovCard(request: SendGovCardRequest): Promise<SendGovCardResponse> {
    const requestPath = this.getRequestPath('/v3/marketing/busifavor/gov-cards');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response = await this.httpClient.post<SendGovCardResponse>(requestPath, request, headers);
    return response.data;
  }
}

export class Builder {
  private _httpClient?: HttpClient;
  private _hostName?: string;

  public config(config: Config): Builder {
    this._httpClient = config.createHttpClient();
    return this;
  }

  public httpClient(httpClient: HttpClient): Builder {
    this._httpClient = httpClient;
    return this;
  }

  public hostName(hostName: string): Builder {
    this._hostName = hostName;
    return this;
  }

  public build(): MerchantExclusiveCouponService {
    if (!this._httpClient) {
      throw new Error('httpClient is required');
    }
    return new MerchantExclusiveCouponService(this._httpClient, this._hostName);
  }
}
