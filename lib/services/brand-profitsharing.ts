import { Output } from '../interface-v2';
import { IPayRequest } from '../pay-request.interface';

/**
 * 品牌分账服务
 * 适用于品牌方与加盟店之间的分账场景
 */
export class BrandProfitSharingService {
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
    const url = 'https://api.mch.weixin.qq.com/v3/brandprofitsharing/receivers/add';
    const _params = {
      brand_id: this.mchid,
      ...params,
    };

    return this.httpService.post(url, _params, this.getHeaders());
  }

  /**
   * 删除分账接收方
   */
  async deleteReceiver(params: DeleteReceiverRequest): Promise<Output> {
    const url = 'https://api.mch.weixin.qq.com/v3/brandprofitsharing/receivers/delete';
    const _params = {
      brand_id: this.mchid,
      ...params,
    };

    return this.httpService.post(url, _params, this.getHeaders());
  }

  /**
   * 创建分账订单
   */
  async createOrder(params: CreateOrderRequest): Promise<Output> {
    const url = 'https://api.mch.weixin.qq.com/v3/brandprofitsharing/orders';
    const _params = {
      brand_id: this.mchid,
      ...params,
    };

    return this.httpService.post(url, _params, this.getHeaders());
  }

  /**
   * 查询分账订单
   */
  async queryOrder(params: QueryOrderRequest): Promise<Output> {
    const url = `https://api.mch.weixin.qq.com/v3/brandprofitsharing/orders/${params.out_order_no}`;
    return this.httpService.get(url, this.getHeaders());
  }

  /**
   * 解冻剩余资金
   */
  async unfreeze(params: UnfreezeRequest): Promise<Output> {
    const url = 'https://api.mch.weixin.qq.com/v3/brandprofitsharing/orders/unfreeze';
    const _params = {
      brand_id: this.mchid,
      ...params,
    };

    return this.httpService.post(url, _params, this.getHeaders());
  }

  /**
   * 查询剩余待分金额
   */
  async queryAmounts(transactionId: string): Promise<Output> {
    const url = `https://api.mch.weixin.qq.com/v3/brandprofitsharing/transactions/${transactionId}/amounts`;
    return this.httpService.get(url, this.getHeaders());
  }

  private getHeaders(): Record<string, string> {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'wechatpay-node-v3/1.0.0',
    };
  }
}

/**
 * 添加分账接收方请求
 */
export interface AddReceiverRequest {
  /** 子商户号 */
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
  /** 子商户号 */
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
  /** 子商户号 */
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
  /** 子商户号 */
  sub_mchid: string;
  /** 商户分账单号 */
  out_order_no: string;
}

/**
 * 解冻剩余资金请求
 */
export interface UnfreezeRequest {
  /** 子商户号 */
  sub_mchid: string;
  /** 商户分账单号 */
  out_order_no: string;
  /** 分账描述 */
  description: string;
}
