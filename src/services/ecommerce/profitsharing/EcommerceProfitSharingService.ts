import { HttpClient, HttpResponse } from '../../../core/http/HttpClient';

export interface EcommerceProfitSharingReceiver {
  type: string;
  account: string;
  name: string;
  amount: number;
  description?: string;
}

export interface EcommerceCreateOrderRequest {
  appid: string;
  sub_mchid: string;
  transaction_id: string;
  out_order_no: string;
  order_receivers: EcommerceProfitSharingReceiver[];
  return_relationship_type?: string;
  return_account?: string;
  description?: string;
}

export interface EcommerceCreateOrderResponse {
  appid: string;
  sub_mchid: string;
  transaction_id: string;
  order_id: string;
  out_order_no: string;
  state: string;
}

export interface EcommerceFinishOrderRequest {
  transaction_id: string;
  out_order_no: string;
}

export interface EcommerceFinishOrderResponse {
  transaction_id: string;
  order_id: string;
  out_order_no: string;
  state: string;
}

export interface EcommerceQueryOrderRequest {
  transaction_id?: string;
  out_order_no?: string;
}

export interface EcommerceQueryOrderResponse {
  appid: string;
  sub_mchid: string;
  transaction_id: string;
  order_id: string;
  out_order_no: string;
  state: string;
  receivers?: Array<{
    type: string;
    account: string;
    name: string;
    amount: number;
    state: string;
    description?: string;
    fail_reason?: string;
    create_time?: string;
    update_time?: string;
  }>;
  return_relationship_type?: string;
  return_account?: string;
  description?: string;
  create_time?: string;
  update_time?: string;
}

export interface EcommerceQueryOrderAmountRequest {
  transaction_id: string;
}

export interface EcommerceQueryOrderAmountResponse {
  transaction_id: string;
  available_amount: number;
  frozen_amount: number;
}

export interface EcommerceAddReceiverRequest {
  appid: string;
  sub_mchid: string;
  type: string;
  account: string;
  name: string;
  relation_type: string;
  relation_name?: string;
  custom_relation?: string;
}

export interface EcommerceAddReceiverResponse {
  appid: string;
  sub_mchid: string;
  type: string;
  account: string;
  name: string;
  result: string;
}

export interface EcommerceDeleteReceiverRequest {
  appid: string;
  sub_mchid: string;
  type: string;
  account: string;
}

export interface EcommerceDeleteReceiverResponse {
  appid: string;
  sub_mchid: string;
  type: string;
  account: string;
  result: string;
}

export interface EcommerceCreateReturnOrderRequest {
  appid: string;
  sub_mchid: string;
  order_id: string;
  out_order_no: string;
  out_return_no: string;
  return_receiver_type: string;
  return_account: string;
  return_amount: number;
  description?: string;
}

export interface EcommerceCreateReturnOrderResponse {
  appid: string;
  sub_mchid: string;
  order_id: string;
  out_order_no: string;
  out_return_no: string;
  return_id: string;
  state: string;
}

export interface EcommerceQueryReturnOrderRequest {
  appid?: string;
  sub_mchid?: string;
  order_id?: string;
  out_order_no?: string;
  out_return_no?: string;
}

export interface EcommerceQueryReturnOrderResponse {
  appid: string;
  sub_mchid: string;
  order_id: string;
  out_order_no: string;
  out_return_no: string;
  return_id: string;
  state: string;
  return_receiver_type: string;
  return_account: string;
  return_amount: number;
  description?: string;
  fail_reason?: string;
  create_time?: string;
  update_time?: string;
}

export interface EcommerceCreateAfterSalesOrderRequest {
  appid: string;
  sub_mchid: string;
  transaction_id: string;
  out_order_no: string;
  order_receivers: EcommerceProfitSharingReceiver[];
  description?: string;
}

export interface EcommerceCreateAfterSalesOrderResponse {
  appid: string;
  sub_mchid: string;
  transaction_id: string;
  order_id: string;
  out_order_no: string;
  state: string;
}

export interface EcommerceQueryAfterSalesOrderRequest {
  transaction_id?: string;
  out_order_no?: string;
}

export interface EcommerceQueryAfterSalesOrderResponse {
  appid: string;
  sub_mchid: string;
  transaction_id: string;
  order_id: string;
  out_order_no: string;
  state: string;
  receivers?: Array<{
    type: string;
    account: string;
    name: string;
    amount: number;
    state: string;
    description?: string;
  }>;
  description?: string;
  create_time?: string;
  update_time?: string;
}

export class EcommerceProfitSharingService {
  private httpClient: HttpClient;
  private hostName?: string;
  private wechatpaySerial?: string;

  constructor(httpClient: HttpClient, hostName?: string, wechatpaySerial?: string) {
    this.httpClient = httpClient;
    this.hostName = hostName;
    this.wechatpaySerial = wechatpaySerial;
  }

  public static builder(): Builder {
    return new Builder();
  }

  public async createOrder(request: EcommerceCreateOrderRequest): Promise<EcommerceCreateOrderResponse> {
    let requestPath = 'https://api.mch.weixin.qq.com/v3/ecommerceprofitsharing/orders';
    if (this.hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this.hostName);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (this.wechatpaySerial) {
      headers['Wechatpay-Serial'] = this.wechatpaySerial;
    }

    const response: HttpResponse<EcommerceCreateOrderResponse> = await this.httpClient.post<EcommerceCreateOrderResponse>(
      requestPath,
      request,
      headers
    );
    return response.data;
  }

  public async finishOrder(request: EcommerceFinishOrderRequest): Promise<EcommerceFinishOrderResponse> {
    let requestPath = 'https://api.mch.weixin.qq.com/v3/ecommerceprofitsharing/finish-order';
    if (this.hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this.hostName);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const response: HttpResponse<EcommerceFinishOrderResponse> = await this.httpClient.post<EcommerceFinishOrderResponse>(
      requestPath,
      request,
      headers
    );
    return response.data;
  }

  public async queryOrder(request: EcommerceQueryOrderRequest): Promise<EcommerceQueryOrderResponse> {
    let requestPath = 'https://api.mch.weixin.qq.com/v3/ecommerceprofitsharing/orders';
    const params: string[] = [];
    if (request.transaction_id) params.push(`transaction_id=${request.transaction_id}`);
    if (request.out_order_no) params.push(`out_order_no=${request.out_order_no}`);
    if (params.length > 0) requestPath += `?${params.join('&')}`;
    if (this.hostName) requestPath = requestPath.replace('api.mch.weixin.qq.com', this.hostName);

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response: HttpResponse<EcommerceQueryOrderResponse> = await this.httpClient.get<EcommerceQueryOrderResponse>(requestPath, headers);
    return response.data;
  }

  public async queryOrderAmount(request: EcommerceQueryOrderAmountRequest): Promise<EcommerceQueryOrderAmountResponse> {
    let requestPath = `https://api.mch.weixin.qq.com/v3/ecommerceprofitsharing/transactions/${request.transaction_id}/amounts`;
    if (this.hostName) requestPath = requestPath.replace('api.mch.weixin.qq.com', this.hostName);

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response: HttpResponse<EcommerceQueryOrderAmountResponse> = await this.httpClient.get<EcommerceQueryOrderAmountResponse>(requestPath, headers);
    return response.data;
  }

  public async addReceiver(request: EcommerceAddReceiverRequest): Promise<EcommerceAddReceiverResponse> {
    let requestPath = 'https://api.mch.weixin.qq.com/v3/ecommerceprofitsharing/receivers/add';
    if (this.hostName) requestPath = requestPath.replace('api.mch.weixin.qq.com', this.hostName);

    const headers: Record<string, string> = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    if (this.wechatpaySerial) headers['Wechatpay-Serial'] = this.wechatpaySerial;

    const response: HttpResponse<EcommerceAddReceiverResponse> = await this.httpClient.post<EcommerceAddReceiverResponse>(requestPath, request, headers);
    return response.data;
  }

  public async deleteReceiver(request: EcommerceDeleteReceiverRequest): Promise<EcommerceDeleteReceiverResponse> {
    let requestPath = 'https://api.mch.weixin.qq.com/v3/ecommerceprofitsharing/receivers/delete';
    if (this.hostName) requestPath = requestPath.replace('api.mch.weixin.qq.com', this.hostName);

    const headers: Record<string, string> = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    const response: HttpResponse<EcommerceDeleteReceiverResponse> = await this.httpClient.post<EcommerceDeleteReceiverResponse>(requestPath, request, headers);
    return response.data;
  }

  public async createReturnOrder(request: EcommerceCreateReturnOrderRequest): Promise<EcommerceCreateReturnOrderResponse> {
    let requestPath = 'https://api.mch.weixin.qq.com/v3/ecommerceprofitsharing/returnorders';
    if (this.hostName) requestPath = requestPath.replace('api.mch.weixin.qq.com', this.hostName);

    const headers: Record<string, string> = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    const response: HttpResponse<EcommerceCreateReturnOrderResponse> = await this.httpClient.post<EcommerceCreateReturnOrderResponse>(requestPath, request, headers);
    return response.data;
  }

  public async queryReturnOrder(request: EcommerceQueryReturnOrderRequest): Promise<EcommerceQueryReturnOrderResponse> {
    let requestPath = 'https://api.mch.weixin.qq.com/v3/ecommerceprofitsharing/returnorders';
    const params: string[] = [];
    if (request.appid) params.push(`appid=${request.appid}`);
    if (request.sub_mchid) params.push(`sub_mchid=${request.sub_mchid}`);
    if (request.out_return_no) params.push(`out_return_no=${request.out_return_no}`);
    if (request.order_id) params.push(`order_id=${request.order_id}`);
    if (request.out_order_no) params.push(`out_order_no=${request.out_order_no}`);
    if (params.length > 0) requestPath += `?${params.join('&')}`;
    if (this.hostName) requestPath = requestPath.replace('api.mch.weixin.qq.com', this.hostName);

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response: HttpResponse<EcommerceQueryReturnOrderResponse> = await this.httpClient.get<EcommerceQueryReturnOrderResponse>(requestPath, headers);
    return response.data;
  }

  public async createAfterSalesOrder(request: EcommerceCreateAfterSalesOrderRequest): Promise<EcommerceCreateAfterSalesOrderResponse> {
    let requestPath = 'https://api.mch.weixin.qq.com/v3/ecommerceprofitsharing/after-sales-orders';
    if (this.hostName) requestPath = requestPath.replace('api.mch.weixin.qq.com', this.hostName);

    const headers: Record<string, string> = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    if (this.wechatpaySerial) headers['Wechatpay-Serial'] = this.wechatpaySerial;

    const response: HttpResponse<EcommerceCreateAfterSalesOrderResponse> = await this.httpClient.post<EcommerceCreateAfterSalesOrderResponse>(requestPath, request, headers);
    return response.data;
  }

  public async queryAfterSalesOrder(request: EcommerceQueryAfterSalesOrderRequest): Promise<EcommerceQueryAfterSalesOrderResponse> {
    let requestPath = 'https://api.mch.weixin.qq.com/v3/ecommerceprofitsharing/after-sales-orders';
    const params: string[] = [];
    if (request.transaction_id) params.push(`transaction_id=${request.transaction_id}`);
    if (request.out_order_no) params.push(`out_order_no=${request.out_order_no}`);
    if (params.length > 0) requestPath += `?${params.join('&')}`;
    if (this.hostName) requestPath = requestPath.replace('api.mch.weixin.qq.com', this.hostName);

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response: HttpResponse<EcommerceQueryAfterSalesOrderResponse> = await this.httpClient.get<EcommerceQueryAfterSalesOrderResponse>(requestPath, headers);
    return response.data;
  }
}

export class Builder {
  private httpClientValue?: HttpClient;
  private hostNameValue?: string;
  private wechatpaySerialValue?: string;

  public httpClient(httpClient: HttpClient): Builder {
    this.httpClientValue = httpClient;
    return this;
  }

  public hostName(hostName: string): Builder {
    this.hostNameValue = hostName;
    return this;
  }

  public wechatpaySerial(serial: string): Builder {
    this.wechatpaySerialValue = serial;
    return this;
  }

  public build(): EcommerceProfitSharingService {
    if (!this.httpClientValue) {
      throw new Error('httpClient is required');
    }
    return new EcommerceProfitSharingService(this.httpClientValue, this.hostNameValue, this.wechatpaySerialValue);
  }
}
