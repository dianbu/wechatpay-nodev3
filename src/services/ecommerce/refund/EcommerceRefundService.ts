import { HttpClient, HttpResponse } from '../../../core/http/HttpClient';

export interface EcommerceRefundAmount {
  refund: number;
  total: number;
  from?: Array<{ account: string; amount: number }>;
}

export interface EcommerceRefundGoodsDetail {
  merchant_goods_id: string;
  wechatpay_goods_id?: string;
  goods_name?: string;
  unit_price: number;
  refund_amount: number;
  refund_quantity: number;
}

export interface EcommerceCreateRefundRequest {
  sub_mchid: string;
  out_trade_no?: string;
  transaction_id?: string;
  out_refund_no: string;
  reason: string;
  notify_url?: string;
  funds_account?: string;
  amount: EcommerceRefundAmount;
  goods_detail?: EcommerceRefundGoodsDetail[];
  operator_id?: string;
}

export interface EcommerceRefund {
  refund_id: string;
  out_refund_no: string;
  transaction_id: string;
  out_trade_no: string;
  channel: string;
  user_received_account: string;
  success_time?: string;
  create_time: string;
  status: string;
  funds_account: string;
  amount: {
    total: number;
    refund: number;
    from?: Array<{ account: string; amount: number }>;
    payer_total: number;
    payer_refund: number;
    settlement_refund: number;
    settlement_total: number;
    discount_refund: number;
  };
  promotion_detail?: Array<{
    promotion_id: string;
    scope: string;
    type: string;
    amount: number;
    refund_amount: number;
    goods_detail?: Array<{
      merchant_goods_id: string;
      wechatpay_goods_id?: string;
      goods_name?: string;
      unit_price: number;
      refund_amount: number;
      refund_quantity: number;
    }>;
  }>;
  sub_mchid: string;
  operator_id?: string;
  return_advance?: {
    return_advance_no: string;
    refund_id: string;
    sub_mchid: string;
    amount: number;
    create_time: string;
    update_time: string;
    status: string;
  };
}

export interface EcommerceQueryRefundByRefundIdRequest {
  refund_id: string;
  sub_mchid?: string;
}

export interface EcommerceQueryRefundByOutRefundNoRequest {
  out_refund_no: string;
  sub_mchid?: string;
}

export interface EcommerceCreateReturnAdvanceRequest {
  refund_id: string;
  sub_mchid: string;
  amount: number;
  return_account: string;
  description?: string;
}

export interface EcommerceReturnAdvance {
  return_advance_no: string;
  refund_id: string;
  sub_mchid: string;
  amount: number;
  create_time: string;
  update_time: string;
  status: string;
  description?: string;
  return_account: string;
}

export interface EcommerceQueryReturnAdvanceRequest {
  refund_id: string;
  sub_mchid?: string;
}

export class EcommerceRefundService {
  private httpClient: HttpClient;
  private hostName?: string;

  constructor(httpClient: HttpClient, hostName?: string) {
    this.httpClient = httpClient;
    this.hostName = hostName;
  }

  public static builder(): Builder {
    return new Builder();
  }

  public async createRefund(request: EcommerceCreateRefundRequest): Promise<EcommerceRefund> {
    let requestPath = 'https://api.mch.weixin.qq.com/v3/ecommerce/refunds/apply';
    if (this.hostName) requestPath = requestPath.replace('api.mch.weixin.qq.com', this.hostName);

    const headers: Record<string, string> = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    const response: HttpResponse<EcommerceRefund> = await this.httpClient.post<EcommerceRefund>(requestPath, request, headers);
    return response.data;
  }

  public async queryRefund(request: EcommerceQueryRefundByRefundIdRequest): Promise<EcommerceRefund> {
    let requestPath = `https://api.mch.weixin.qq.com/v3/ecommerce/refunds/id/${request.refund_id}`;
    if (request.sub_mchid) requestPath += `?sub_mchid=${request.sub_mchid}`;
    if (this.hostName) requestPath = requestPath.replace('api.mch.weixin.qq.com', this.hostName);

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response: HttpResponse<EcommerceRefund> = await this.httpClient.get<EcommerceRefund>(requestPath, headers);
    return response.data;
  }

  public async queryRefundByOutRefundNo(request: EcommerceQueryRefundByOutRefundNoRequest): Promise<EcommerceRefund> {
    let requestPath = `https://api.mch.weixin.qq.com/v3/ecommerce/refunds/out-refund-no/${request.out_refund_no}`;
    if (request.sub_mchid) requestPath += `?sub_mchid=${request.sub_mchid}`;
    if (this.hostName) requestPath = requestPath.replace('api.mch.weixin.qq.com', this.hostName);

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response: HttpResponse<EcommerceRefund> = await this.httpClient.get<EcommerceRefund>(requestPath, headers);
    return response.data;
  }

  public async createReturnAdvance(request: EcommerceCreateReturnAdvanceRequest): Promise<EcommerceReturnAdvance> {
    let requestPath = `https://api.mch.weixin.qq.com/v3/ecommerce/refunds/${request.refund_id}/return-advance`;
    if (this.hostName) requestPath = requestPath.replace('api.mch.weixin.qq.com', this.hostName);

    const headers: Record<string, string> = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    const response: HttpResponse<EcommerceReturnAdvance> = await this.httpClient.post<EcommerceReturnAdvance>(requestPath, request, headers);
    return response.data;
  }

  public async queryReturnAdvance(request: EcommerceQueryReturnAdvanceRequest): Promise<EcommerceReturnAdvance> {
    let requestPath = `https://api.mch.weixin.qq.com/v3/ecommerce/refunds/${request.refund_id}/return-advance`;
    if (request.sub_mchid) requestPath += `?sub_mchid=${request.sub_mchid}`;
    if (this.hostName) requestPath = requestPath.replace('api.mch.weixin.qq.com', this.hostName);

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response: HttpResponse<EcommerceReturnAdvance> = await this.httpClient.get<EcommerceReturnAdvance>(requestPath, headers);
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

  public build(): EcommerceRefundService {
    if (!this.httpClientValue) throw new Error('httpClient is required');
    return new EcommerceRefundService(this.httpClientValue, this.hostNameValue);
  }
}
