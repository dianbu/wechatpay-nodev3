import { HttpClient } from '../../../core/http/HttpClient';
import { Config, PrivacyEncryptor } from '../../../core/Config';

export interface BrandReceiver {
  type: string;
  account: string;
  name: string;
  relation_type: string;
  relation_name?: string;
  custom_relation?: string;
}

export interface BrandProfitSharingOrder {
  brand_mchid: string;
  sub_mchid: string;
  transaction_id: string;
  out_order_no: string;
  order_receivers: BrandReceiver[];
  amount?: number;
  description?: string;
}

export interface BrandCreateOrderRequest {
  brand_mchid: string;
  sub_mchid: string;
  transaction_id: string;
  out_order_no: string;
  order_receivers: BrandReceiver[];
  amount?: number;
  description?: string;
}

export interface BrandCreateOrderResponse {
  brand_mchid: string;
  sub_mchid: string;
  transaction_id: string;
  order_id: string;
  out_order_no: string;
  state: string;
}

export interface BrandFinishOrderRequest {
  brand_mchid: string;
  sub_mchid: string;
  transaction_id: string;
  out_order_no: string;
  description?: string;
}

export interface BrandFinishOrderResponse {
  brand_mchid: string;
  sub_mchid: string;
  transaction_id: string;
  order_id: string;
  out_order_no: string;
  state: string;
}

export interface BrandQueryOrderRequest {
  brand_mchid: string;
  sub_mchid?: string;
  transaction_id?: string;
  out_order_no?: string;
}

export interface BrandQueryOrderResponse {
  brand_mchid: string;
  sub_mchid: string;
  transaction_id: string;
  order_id: string;
  out_order_no: string;
  state: string;
  receivers?: Array<{
    account: string;
    name: string;
    amount: number;
    state: string;
    description?: string;
  }>;
  amount?: number;
  description?: string;
  create_time?: string;
  update_time?: string;
}

export interface BrandQueryOrderAmountRequest {
  brand_mchid: string;
  sub_mchid: string;
  transaction_id: string;
}

export interface BrandQueryOrderAmountResponse {
  brand_mchid: string;
  sub_mchid: string;
  transaction_id: string;
  available_amount: number;
  unavailable_amount: number;
  frozen_amount: number;
}

export interface BrandAddReceiverRequest {
  brand_mchid: string;
  sub_mchid: string;
  type: string;
  account: string;
  name: string;
  relation_type: string;
  relation_name?: string;
  custom_relation?: string;
}

export interface BrandAddReceiverResponse {
  brand_mchid: string;
  sub_mchid: string;
  type: string;
  account: string;
  name: string;
  result: string;
}

export interface BrandDeleteReceiverRequest {
  brand_mchid: string;
  sub_mchid: string;
  type: string;
  account: string;
}

export interface BrandDeleteReceiverResponse {
  brand_mchid: string;
  sub_mchid: string;
  type: string;
  account: string;
  result: string;
}

export interface BrandCreateReturnOrderRequest {
  brand_mchid: string;
  sub_mchid: string;
  order_id: string;
  out_order_no: string;
  out_return_no: string;
  return_receiver_type: string;
  return_account: string;
  return_amount: number;
  description?: string;
}

export interface BrandCreateReturnOrderResponse {
  brand_mchid: string;
  sub_mchid: string;
  order_id: string;
  out_order_no: string;
  out_return_no: string;
  return_id: string;
  state: string;
}

export interface BrandQueryReturnOrderRequest {
  brand_mchid: string;
  sub_mchid?: string;
  order_id?: string;
  out_order_no?: string;
  out_return_no?: string;
}

export interface BrandQueryReturnOrderResponse {
  brand_mchid: string;
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

export interface BrandQueryBrandMerchantRatioRequest {
  brand_mchid: string;
}

export interface BrandQueryBrandMerchantRatioResponse {
  brand_mchid: string;
  ratio: number;
}

export class BrandProfitSharingService {
  private _httpClient: HttpClient;
  private _hostName?: string;
  private _encryptor: PrivacyEncryptor;

  constructor(
    httpClient: HttpClient,
    hostName: string | undefined,
    encryptor: PrivacyEncryptor
  ) {
    this._httpClient = httpClient;
    this._hostName = hostName;
    this._encryptor = encryptor;
  }

  public static builder(): BrandProfitSharingBuilder {
    return new BrandProfitSharingBuilder();
  }

  /**
   * 查询最大分账比例
   */
  public async queryBrandMerchantRatio(
    request: BrandQueryBrandMerchantRatioRequest
  ): Promise<BrandQueryBrandMerchantRatioResponse> {
    const { brand_mchid } = request;
    
    let requestPath = `https://api.mch.weixin.qq.com/v3/brand/profitsharing/brand-configs/${brand_mchid}`;
    
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await this._httpClient.get(requestPath, headers);
    return response.data as BrandQueryBrandMerchantRatioResponse;
  }

  /**
   * 请求分账
   */
  public async createOrder(
    request: BrandCreateOrderRequest
  ): Promise<BrandCreateOrderResponse> {
    let requestPath = 'https://api.mch.weixin.qq.com/v3/brand/profitsharing/orders';
    
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Wechatpay-Serial': this._encryptor.getWechatpaySerial(),
    };

    const response = await this._httpClient.post(requestPath, request, headers);
    return response.data as BrandCreateOrderResponse;
  }

  /**
   * 完结分账
   */
  public async finishOrder(
    request: BrandFinishOrderRequest
  ): Promise<BrandFinishOrderResponse> {
    let requestPath = 'https://api.mch.weixin.qq.com/v3/brand/profitsharing/finish-order';
    
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await this._httpClient.post(requestPath, request, headers);
    return response.data as BrandFinishOrderResponse;
  }

  /**
   * 查询分账结果
   */
  public async queryOrder(request: BrandQueryOrderRequest): Promise<BrandQueryOrderResponse> {
    let requestPath = 'https://api.mch.weixin.qq.com/v3/brand/profitsharing/orders';
    
    const params: string[] = [];
    if (request.sub_mchid) {
      params.push(`sub_mchid=${request.sub_mchid}`);
    }
    if (request.transaction_id) {
      params.push(`transaction_id=${request.transaction_id}`);
    }
    if (request.out_order_no) {
      params.push(`out_order_no=${request.out_order_no}`);
    }
    
    if (params.length > 0) {
      requestPath += `?${params.join('&')}`;
    }
    
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await this._httpClient.get(requestPath, headers);
    return response.data as BrandQueryOrderResponse;
  }

  /**
   * 查询订单剩余待分金额
   */
  public async queryOrderAmount(
    request: BrandQueryOrderAmountRequest
  ): Promise<BrandQueryOrderAmountResponse> {
    const { brand_mchid, sub_mchid, transaction_id } = request;
    
    let requestPath = `https://api.mch.weixin.qq.com/v3/brand/profitsharing/orders/${transaction_id}/amounts?brand_mchid=${brand_mchid}&sub_mchid=${sub_mchid}`;
    
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await this._httpClient.get(requestPath, headers);
    return response.data as BrandQueryOrderAmountResponse;
  }

  /**
   * 添加分账接收方
   */
  public async addReceiver(
    request: BrandAddReceiverRequest
  ): Promise<BrandAddReceiverResponse> {
    let requestPath = 'https://api.mch.weixin.qq.com/v3/brand/profitsharing/receivers/add';
    
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await this._httpClient.post(requestPath, request, headers);
    return response.data as BrandAddReceiverResponse;
  }

  /**
   * 删除分账接收方
   */
  public async deleteReceiver(
    request: BrandDeleteReceiverRequest
  ): Promise<BrandDeleteReceiverResponse> {
    let requestPath = 'https://api.mch.weixin.qq.com/v3/brand/profitsharing/receivers/delete';
    
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await this._httpClient.post(requestPath, request, headers);
    return response.data as BrandDeleteReceiverResponse;
  }

  /**
   * 请求分账回退
   */
  public async createReturnOrder(
    request: BrandCreateReturnOrderRequest
  ): Promise<BrandCreateReturnOrderResponse> {
    let requestPath = 'https://api.mch.weixin.qq.com/v3/brand/profitsharing/returnorders';
    
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await this._httpClient.post(requestPath, request, headers);
    return response.data as BrandCreateReturnOrderResponse;
  }

  /**
   * 查询分账回退结果
   */
  public async queryReturnOrder(
    request: BrandQueryReturnOrderRequest
  ): Promise<BrandQueryReturnOrderResponse> {
    let requestPath = 'https://api.mch.weixin.qq.com/v3/brand/profitsharing/returnorders';
    
    const params: string[] = [];
    if (request.sub_mchid) {
      params.push(`sub_mchid=${request.sub_mchid}`);
    }
    if (request.out_return_no) {
      params.push(`out_return_no=${request.out_return_no}`);
    }
    if (request.order_id) {
      params.push(`order_id=${request.order_id}`);
    }
    if (request.out_order_no) {
      params.push(`out_order_no=${request.out_order_no}`);
    }
    
    if (params.length > 0) {
      requestPath += `?${params.join('&')}`;
    }
    
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await this._httpClient.get(requestPath, headers);
    return response.data as BrandQueryReturnOrderResponse;
  }
}

export class BrandProfitSharingBuilder {
  private _httpClient?: HttpClient;
  private _hostName?: string;
  private _encryptor?: PrivacyEncryptor;

  public config(config: Config): BrandProfitSharingBuilder {
    this._httpClient = new (require('../../../core/http/HttpClient').DefaultHttpClient)();
    this._encryptor = config.createEncryptor ? config.createEncryptor() : undefined;
    return this;
  }

  public httpClient(httpClient: HttpClient): BrandProfitSharingBuilder {
    this._httpClient = httpClient;
    return this;
  }

  public hostName(hostName: string): BrandProfitSharingBuilder {
    this._hostName = hostName;
    return this;
  }

  public encryptor(encryptor: PrivacyEncryptor): BrandProfitSharingBuilder {
    this._encryptor = encryptor;
    return this;
  }

  public build(): BrandProfitSharingService {
    if (!this._httpClient) {
      throw new Error('httpClient is required');
    }
    if (!this._encryptor) {
      throw new Error('encryptor is required');
    }
    return new BrandProfitSharingService(this._httpClient, this._hostName, this._encryptor);
  }
}
