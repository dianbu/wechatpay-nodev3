import { Output } from '../interface-v2';
import { IPayRequest } from '../pay-request.interface';

/**
 * 电商分账服务
 * 适用于电商平台与入驻商家之间的分账场景
 */
export class EcommerceProfitSharingService {
  private httpService: IPayRequest;
  private appid: string;
  private mchid: string;

  constructor(httpService: IPayRequest, appid: string, mchid: string) {
    this.httpService = httpService;
    this.appid = appid;
    this.mchid = mchid;
  }

  /**
   * 添加分账接收方
   */
  async addReceiver(params: AddReceiverRequest): Promise<Output> {
    const url = 'https://api.mch.weixin.qq.com/v3/ecommerceprofitsharing/receivers/add';
    const _params = {
      sp_appid: this.appid,
      sp_mchid: this.mchid,
      ...params,
    };

    return this.httpService.post(url, _params, this.getHeaders());
  }

  /**
   * 删除分账接收方
   */
  async deleteReceiver(params: DeleteReceiverRequest): Promise<Output> {
    const url = 'https://api.mch.weixin.qq.com/v3/ecommerceprofitsharing/receivers/delete';
    const _params = {
      sp_mchid: this.mchid,
      ...params,
    };

    return this.httpService.post(url, _params, this.getHeaders());
  }

  /**
   * 创建分账订单
   */
  async createOrder(params: CreateOrderRequest): Promise<Output> {
    const url = 'https://api.mch.weixin.qq.com/v3/ecommerceprofitsharing/orders';
    const _params = {
      sp_appid: this.appid,
      sp_mchid: this.mchid,
      ...params,
    };

    return this.httpService.post(url, _params, this.getHeaders());
  }

  /**
   * 查询分账订单
   */
  async queryOrder(params: QueryOrderRequest): Promise<Output> {
    const url = `https://api.mch.weixin.qq.com/v3/ecommerceprofitsharing/orders/${params.out_order_no}`;
    const queryStr = this.buildQuery({ transaction_id: params.transaction_id });
    return this.httpService.get(url + queryStr, this.getHeaders());
  }

  /**
   * 创建售后分账订单
   */
  async createAfterSalesOrder(params: CreateAfterSalesOrderRequest): Promise<Output> {
    const url = 'https://api.mch.weixin.qq.com/v3/ecommerceprofitsharing/after-sales-orders';
    const _params = {
      sp_appid: this.appid,
      sp_mchid: this.mchid,
      ...params,
    };

    return this.httpService.post(url, _params, this.getHeaders());
  }

  /**
   * 查询售后分账订单
   */
  async queryAfterSalesOrder(params: QueryAfterSalesOrderRequest): Promise<Output> {
    const url = `https://api.mch.weixin.qq.com/v3/ecommerceprofitsharing/after-sales-orders/${params.out_order_no}`;
    return this.httpService.get(url, this.getHeaders());
  }

  /**
   * 完结分账订单
   */
  async finishOrder(params: FinishOrderRequest): Promise<Output> {
    const url = 'https://api.mch.weixin.qq.com/v3/ecommerceprofitsharing/orders/finish';
    const _params = {
      sp_mchid: this.mchid,
      ...params,
    };

    return this.httpService.post(url, _params, this.getHeaders());
  }

  private getHeaders(): Record<string, string> {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'wechatpay-node-v3/1.0.0',
    };
  }

  private buildQuery(params: Record<string, any>): string {
    const query = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    return query ? `?${query}` : '';
  }
}

/**
 * 添加分账接收方请求
 */
export interface AddReceiverRequest {
  /** 二级商户号 */
  sub_mchid: string;
  /** 分账接收方类型 */
  type: 'MERCHANT_ID' | 'PERSONAL_OPENID';
  /** 分账接收方账号 */
  account: string;
  /** 分账个人接收方姓名（加密） */
  name?: string;
  /** 与分账方的关系类型 */
  relation_type: string;
  /** 自定义的分账关系 */
  custom_relation?: string;
}

/**
 * 删除分账接收方请求
 */
export interface DeleteReceiverRequest {
  /** 二级商户号 */
  sub_mchid: string;
  /** 分账接收方类型 */
  type: string;
  /** 分账接收方账号 */
  account: string;
}

/**
 * 创建分账订单请求
 */
export interface CreateOrderRequest {
  /** 二级商户号 */
  sub_mchid: string;
  /** 商户分账单号 */
  out_order_no: string;
  /** 微信订单号 */
  transaction_id: string;
  /** 分账接收方列表 */
  receivers: Receiver[];
  /** 是否解冻剩余未分资金 */
  unfreeze_unsplit: boolean;
}

/**
 * 分账接收方
 */
export interface Receiver {
  /** 分账接收方类型 */
  type: 'MERCHANT_ID' | 'PERSONAL_OPENID';
  /** 分账接收方账号 */
  account: string;
  /** 分账个人接收方姓名（加密） */
  name?: string;
  /** 分账金额 */
  amount: number;
  /** 分账描述 */
  description: string;
}

/**
 * 查询分账订单请求
 */
export interface QueryOrderRequest {
  /** 二级商户号 */
  sub_mchid: string;
  /** 商户分账单号 */
  out_order_no: string;
  /** 微信订单号 */
  transaction_id: string;
}

/**
 * 创建售后分账订单请求
 */
export interface CreateAfterSalesOrderRequest {
  /** 二级商户号 */
  sub_mchid: string;
  /** 商户售后分账单号 */
  out_order_no: string;
  /** 微信订单号 */
  transaction_id: string;
  /** 分账接收方列表 */
  receivers: Receiver[];
}

/**
 * 查询售后分账订单请求
 */
export interface QueryAfterSalesOrderRequest {
  /** 二级商户号 */
  sub_mchid: string;
  /** 商户售后分账单号 */
  out_order_no: string;
}

/**
 * 完结分账订单请求
 */
export interface FinishOrderRequest {
  /** 二级商户号 */
  sub_mchid: string;
  /** 商户分账单号 */
  out_order_no: string;
}
