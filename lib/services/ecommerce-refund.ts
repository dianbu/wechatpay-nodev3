import { Output } from '../interface-v2';
import { IPayRequest } from '../pay-request.interface';

/**
 * 电商退款服务
 * 适用于电商平台的退款场景
 */
export class EcommerceRefundService {
  private httpService: IPayRequest;
  private appid: string;
  private mchid: string;

  constructor(httpService: IPayRequest, appid: string, mchid: string) {
    this.httpService = httpService;
    this.appid = appid;
    this.mchid = mchid;
  }

  /**
   * 申请退款
   */
  async createRefund(params: CreateRefundRequest): Promise<Output> {
    const url = 'https://api.mch.weixin.qq.com/v3/ecommerce/refunds';
    const _params = {
      sp_appid: this.appid,
      sp_mchid: this.mchid,
      ...params,
    };

    return this.httpService.post(url, _params, this.getHeaders());
  }

  /**
   * 查询退款（通过退款单号）
   */
  async queryRefund(refundId: string): Promise<Output> {
    const url = `https://api.mch.weixin.qq.com/v3/ecommerce/refunds/id/${refundId}`;
    return this.httpService.get(url, this.getHeaders());
  }

  /**
   * 查询退款（通过商户退款单号）
   */
  async queryRefundByOutRefundNo(outRefundNo: string, subMchid?: string): Promise<Output> {
    let url = `https://api.mch.weixin.qq.com/v3/ecommerce/refunds/out-refund-no/${outRefundNo}`;
    if (subMchid) {
      url += `?sub_mchid=${subMchid}`;
    }
    return this.httpService.get(url, this.getHeaders());
  }

  /**
   * 申请异常退款
   */
  async createAbnormalRefund(params: CreateAbnormalRefundRequest): Promise<Output> {
    const url = 'https://api.mch.weixin.qq.com/v3/ecommerce/abnormal-refunds';
    const _params = {
      sp_mchid: this.mchid,
      ...params,
    };

    return this.httpService.post(url, _params, this.getHeaders());
  }

  /**
   * 查询异常退款
   */
  async queryAbnormalRefund(refundId: string): Promise<Output> {
    const url = `https://api.mch.weixin.qq.com/v3/ecommerce/abnormal-refunds/${refundId}`;
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
 * 申请退款请求
 */
export interface CreateRefundRequest {
  /** 二级商户号 */
  sub_mchid: string;
  /** 商户退款单号 */
  out_refund_no: string;
  /** 微信订单号 */
  transaction_id?: string;
  /** 商户订单号 */
  out_trade_no?: string;
  /** 退款原因 */
  reason?: string;
  /** 退款金额 */
  amount: RefundAmount;
  /** 商品订单详情 */
  goods_detail?: GoodsDetail[];
  /** 退款回调地址 */
  notify_url?: string;
}

/**
 * 退款金额
 */
export interface RefundAmount {
  /** 订单金额 */
  total: number;
  /** 退款金额 */
  refund: number;
  /** 货币类型 */
  currency?: string;
  /** 应结订单金额 */
  settlement_total?: number;
}

/**
 * 商品订单详情
 */
export interface GoodsDetail {
  /** 商户商品 ID */
  merchant_goods_id: string;
  /** 微信支付商品 ID */
  wechatpay_goods_id?: string;
  /** 商品名称 */
  goods_name?: string;
  /** 商品单价 */
  unit_price: number;
  /** 商品数量 */
  refund_quantity: number;
  /** 商品退款金额 */
  refund_amount: number;
}

/**
 * 申请异常退款请求
 */
export interface CreateAbnormalRefundRequest {
  /** 二级商户号 */
  sub_mchid: string;
  /** 商户退款单号 */
  out_refund_no: string;
  /** 微信订单号 */
  transaction_id: string;
  /** 退款金额 */
  amount: RefundAmount;
  /** 退款原因 */
  reason: string;
}
