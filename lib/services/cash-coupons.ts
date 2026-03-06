import { Output } from '../interface-v2';
import { IPayRequest } from '../pay-request.interface';

/**
 * 现金优惠券服务
 * 提供代金券的创建、查询、发放等功能
 */
export class CashCouponsService {
  private httpService: IPayRequest;
  private appid: string;
  private mchid: string;

  constructor(httpService: IPayRequest, appid: string, mchid: string) {
    this.httpService = httpService;
    this.appid = appid;
    this.mchid = mchid;
  }

  /**
   * 创建代金券批次
   */
  async createCouponStock(params: CreateCouponStockRequest): Promise<Output> {
    const url = 'https://api.mch.weixin.qq.com/v3/marketing/favor/tasks';
    const _params = {
      stock_creator_mchid: this.mchid,
      ...params,
    };

    return this.httpService.post(url, _params, this.getHeaders());
  }

  /**
   * 查询批次详情
   */
  async queryStock(stockId: string): Promise<Output> {
    const url = `https://api.mch.weixin.qq.com/v3/marketing/favor/tasks/${stockId}`;
    return this.httpService.get(url, this.getHeaders());
  }

  /**
   * 发放代金券
   */
  async sendCoupon(params: SendCouponRequest): Promise<Output> {
    const url = 'https://api.mch.weixin.qq.com/v3/marketing/favor/users/{openid}/coupons';
    const realUrl = url.replace('{openid}', params.openid);
    const _params = {
      stock_id: params.stock_id,
      appid: this.appid,
    };

    return this.httpService.post(realUrl, _params, this.getHeaders());
  }

  /**
   * 查询用户券详情
   */
  async queryCoupon(couponId: string, openid: string): Promise<Output> {
    const url = `https://api.mch.weixin.qq.com/v3/marketing/favor/users/${openid}/coupons/${couponId}`;
    return this.httpService.get(url, this.getHeaders());
  }

  /**
   * 设置批次预算
   */
  async modifyStockBudget(params: ModifyStockBudgetRequest): Promise<Output> {
    const url = `https://api.mch.weixin.qq.com/v3/marketing/favor/tasks/${params.stock_id}/budget`;
    const _params = {
      stock_creator_mchid: this.mchid,
      max_amount: params.max_amount,
    };

    return this.httpService.post(url, _params, this.getHeaders());
  }

  /**
   * 暂停批次
   */
  async pauseStock(params: PauseStockRequest): Promise<Output> {
    const url = `https://api.mch.weixin.qq.com/v3/marketing/favor/tasks/${params.stock_id}/pause`;
    const _params = {
      stock_creator_mchid: this.mchid,
    };

    return this.httpService.post(url, _params, this.getHeaders());
  }

  /**
   * 重启批次
   */
  async restartStock(params: RestartStockRequest): Promise<Output> {
    const url = `https://api.mch.weixin.qq.com/v3/marketing/favor/tasks/${params.stock_id}/restart`;
    const _params = {
      stock_creator_mchid: this.mchid,
    };

    return this.httpService.post(url, _params, this.getHeaders());
  }

  /**
   * 停止批次
   */
  async stopStock(params: StopStockRequest): Promise<Output> {
    const url = `https://api.mch.weixin.qq.com/v3/marketing/favor/tasks/${params.stock_id}/stop`;
    const _params = {
      stock_creator_mchid: this.mchid,
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
}

/**
 * 创建代金券批次请求
 */
export interface CreateCouponStockRequest {
  /** 批次名称 */
  stock_name: string;
  /** 批次归属商户号 */
  belong_merchant: string;
  /** 批次发放规则 */
  available_begin_time: string;
  /** 批次结束时间 */
  available_end_time: string;
  /** 批次使用规则 */
  stock_use_rule: StockUseRule;
  /** 批次预算信息 */
  normal_info: NormalInfo;
  /** 批次备注 */
  comment?: string;
  /** 图案信息 */
  pattern_info?: PatternInfo;
}

/**
 * 批次使用规则
 */
export interface StockUseRule {
  /** 可用商户 */
  available_merchants?: string[];
  /** 可用单品 */
  available_items?: string[];
  /** 不可用单品 */
  unavailable_items?: string[];
  /** 适用门店 */
  available_stores?: string[];
  /** 固定面额 */
  fixed_face_amount?: number;
  /** 最低可用金额 */
  least_amount?: number;
}

/**
 * 批次预算信息
 */
export interface NormalInfo {
  /** 批次最大预算金额 */
  max_amount: number;
  /** 批次最大发放个数 */
  max_quantity: number;
}

/**
 * 图案信息
 */
export interface PatternInfo {
  /** 商户上传的媒体图片 ID */
  media_id: string;
}

/**
 * 发放代金券请求
 */
export interface SendCouponRequest {
  /** 用户 openid */
  openid: string;
  /** 批次 ID */
  stock_id: string;
}

/**
 * 修改批次预算请求
 */
export interface ModifyStockBudgetRequest {
  /** 批次 ID */
  stock_id: string;
  /** 最大预算金额 */
  max_amount: number;
}

/**
 * 暂停批次请求
 */
export interface PauseStockRequest {
  /** 批次 ID */
  stock_id: string;
}

/**
 * 重启批次请求
 */
export interface RestartStockRequest {
  /** 批次 ID */
  stock_id: string;
}

/**
 * 停止批次请求
 */
export interface StopStockRequest {
  /** 批次 ID */
  stock_id: string;
}
