import { Config } from '../../core/Config';
import { HttpClient } from '../../core/http/HttpClient';

/**
 * 分账服务
 * 提供分账相关的 API 调用
 * 
 * @public
 */
export class ProfitSharingService {
  private config: Config;
  private httpClient: HttpClient;

  constructor(config: Config, httpClient: HttpClient) {
    this.config = config;
    this.httpClient = httpClient;
  }

  /**
   * 请求分账
   * @param request 分账请求
   * @returns 分账响应
   */
  async createProfitSharing(request: ProfitSharingRequest): Promise<ProfitSharingResponse> {
    const url = 'https://api.mch.weixin.qq.com/v3/profitsharing/orders';
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('POST', url, request, signer);
    
    const headers = {
      'Authorization': authorization,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const response = await this.httpClient.post<ProfitSharingResponse>(url, request, headers);
    return response.data;
  }

  /**
   * 查询分账结果
   * @param outOrderNo 商户分账单号
   * @returns 分账结果
   */
  async queryProfitSharing(outOrderNo: string): Promise<ProfitSharingResult> {
    const url = `https://api.mch.weixin.qq.com/v3/profitsharing/orders/${outOrderNo}`;
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('GET', url, undefined, signer);
    
    const headers = {
      'Authorization': authorization,
      'Accept': 'application/json',
    };

    const response = await this.httpClient.get<ProfitSharingResult>(url, headers);
    return response.data;
  }

  /**
   * 添加分账接收方
   * @param request 添加接收方请求
   */
  async addReceiver(request: AddReceiverRequest): Promise<void> {
    const url = 'https://api.mch.weixin.qq.com/v3/profitsharing/receivers/add';
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('POST', url, request, signer);
    
    const headers = {
      'Authorization': authorization,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    await this.httpClient.post(url, request, headers);
  }

  /**
   * 删除分账接收方
   * @param request 删除接收方请求
   */
  async deleteReceiver(request: DeleteReceiverRequest): Promise<void> {
    const url = 'https://api.mch.weixin.qq.com/v3/profitsharing/receivers/delete';
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('POST', url, request, signer);
    
    const headers = {
      'Authorization': authorization,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    await this.httpClient.post(url, request, headers);
  }

  /**
   * 解冻剩余资金
   * @param request 解冻请求
   * @returns 解冻响应
   */
  async unfreeze(request: UnfreezeRequest): Promise<UnfreezeResponse> {
    const url = 'https://api.mch.weixin.qq.com/v3/profitsharing/orders/unfreeze';
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('POST', url, request, signer);
    
    const headers = {
      'Authorization': authorization,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const response = await this.httpClient.post<UnfreezeResponse>(url, request, headers);
    return response.data;
  }

  /**
   * 查询剩余待分金额
   * @param transactionId 微信订单号
   * @returns 剩余待分金额
   */
  async queryAmounts(transactionId: string): Promise<ProfitSharingAmounts> {
    const url = `https://api.mch.weixin.qq.com/v3/profitsharing/transactions/${transactionId}/amounts`;
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('GET', url, undefined, signer);
    
    const headers = {
      'Authorization': authorization,
      'Accept': 'application/json',
    };

    const response = await this.httpClient.get<ProfitSharingAmounts>(url, headers);
    return response.data;
  }

  /**
   * 获取分账账单文件下载地址
   * @param request 账单请求
   * @returns 账单下载响应
   */
  async splitBill(request: SplitBillRequest): Promise<SplitBillResponse> {
    const params: string[] = [];
    if (request.sub_mchid) params.push(`sub_mchid=${encodeURIComponent(request.sub_mchid)}`);
    if (request.bill_date) params.push(`bill_date=${encodeURIComponent(request.bill_date)}`);
    if (request.tar_type) params.push(`tar_type=${encodeURIComponent(request.tar_type)}`);
    
    const url = `https://api.mch.weixin.qq.com/v3/profitsharing/bills${params.length > 0 ? '?' + params.join('&') : ''}`;
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('GET', url, undefined, signer);
    
    const headers = {
      'Authorization': authorization,
      'Accept': 'application/json',
    };

    const response = await this.httpClient.get<SplitBillResponse>(url, headers);
    return response.data;
  }

  /**
   * 查询最大分账比例
   * @param subMchid 子商户号
   * @returns 分账比例响应
   */
  async queryMerchantRatio(subMchid: string): Promise<QueryMerchantRatioResponse> {
    const url = `https://api.mch.weixin.qq.com/v3/profitsharing/merchant-configs/${encodeURIComponent(subMchid)}`;
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('GET', url, undefined, signer);
    
    const headers = {
      'Authorization': authorization,
      'Accept': 'application/json',
    };

    const response = await this.httpClient.get<QueryMerchantRatioResponse>(url, headers);
    return response.data;
  }

  /**
   * 请求分账回退
   * @param request 回退请求
   * @returns 回退响应
   */
  async createReturnOrder(request: CreateReturnOrderRequest): Promise<ReturnOrderResponse> {
    const url = 'https://api.mch.weixin.qq.com/v3/profitsharing/return-orders';
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('POST', url, request, signer);
    
    const headers = {
      'Authorization': authorization,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const response = await this.httpClient.post<ReturnOrderResponse>(url, request, headers);
    return response.data;
  }

  /**
   * 查询分账回退结果
   * @param request 查询请求
   * @returns 回退结果
   */
  async queryReturnOrder(request: QueryReturnOrderRequest): Promise<ReturnOrderResponse> {
    const params: string[] = [];
    if (request.sub_mchid) params.push(`sub_mchid=${encodeURIComponent(request.sub_mchid)}`);
    if (request.out_order_no) params.push(`out_order_no=${encodeURIComponent(request.out_order_no)}`);
    
    const url = `https://api.mch.weixin.qq.com/v3/profitsharing/return-orders/${encodeURIComponent(request.out_return_no)}${params.length > 0 ? '?' + params.join('&') : ''}`;
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('GET', url, undefined, signer);
    
    const headers = {
      'Authorization': authorization,
      'Accept': 'application/json',
    };

    const response = await this.httpClient.get<ReturnOrderResponse>(url, headers);
    return response.data;
  }

  private async buildAuthorization(
    method: string,
    url: string,
    body?: any,
    signer?: any
  ): Promise<string> {
    const nonceStr = Math.random().toString(36).substr(2, 15);
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const urlPath = url.replace('https://api.mch.weixin.qq.com', '');

    let str = `${method}\n${urlPath}\n${timestamp}\n${nonceStr}\n`;
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      str += JSON.stringify(body) + '\n';
    } else {
      str += '\n';
    }

    if (!signer) {
      signer = this.config.createSigner();
    }
    const signature = await signer.sign(str);

    const authType = 'WECHATPAY2-SHA256-RSA2048';
    const authorization =
      `mchid="${this.config.merchantId}",` +
      `nonce_str="${nonceStr}",` +
      `timestamp="${timestamp}",` +
      `serial_no="${signer.getSerialNumber()}",` +
      `signature="${signature}"`;

    return `${authType} ${authorization}`;
  }
}

/**
 * 分账请求
 * 
 * @public
 */
export interface ProfitSharingRequest {
  /**
   * 商户号
   */
  mchid?: string;

  /**
   * 微信订单号
   */
  transaction_id: string;

  /**
   * 商户分账单号
   */
  out_order_no: string;

  /**
   * 分账描述
   */
  reason: string;

  /**
   * 分账接收方列表
   */
  receivers: Receiver[];

  /**
   * 是否解冻剩余未分资金
   */
  unfreeze_unsplit?: boolean;
}

/**
 * 分账接收方
 * 
 * @public
 */
export interface Receiver {
  /**
   * 分账接收方类型
   */
  type: 'MERCHANT_ID' | 'PERSONAL_OPENID';

  /**
   * 分账接收方账号
   */
  account: string;

  /**
   * 分账个人接收方姓名（加密）
   */
  name?: string;

  /**
   * 分账金额，单位：分
   */
  amount: number;

  /**
   * 分账描述
   */
  description: string;
}

/**
 * 分账响应
 * 
 * @public
 */
export interface ProfitSharingResponse {
  /**
   * 商户号
   */
  mchid: string;

  /**
   * 微信订单号
   */
  transaction_id: string;

  /**
   * 商户分账单号
   */
  out_order_no: string;

  /**
   * 微信分账单号
   */
  order_id: string;

  /**
   * 分账单状态
   */
  state: string;
}

/**
 * 分账结果
 * 
 * @public
 */
export interface ProfitSharingResult extends ProfitSharingResponse {
  /**
   * 分账描述
   */
  reason: string;

  /**
   * 分账完成时间
   */
  finish_time?: string;
}

/**
 * 添加分账接收方请求
 * 
 * @public
 */
export interface AddReceiverRequest {
  /**
   * 商户号
   */
  mchid?: string;

  /**
   * 分账接收方类型
   */
  type: 'MERCHANT_ID' | 'PERSONAL_OPENID';

  /**
   * 分账接收方账号
   */
  account: string;

  /**
   * 分账个人接收方姓名（加密）
   */
  name?: string;

  /**
   * 与分账方的关系类型
   */
  relation_type: string;

  /**
   * 自定义的分账关系
   */
  custom_relation?: string;
}

/**
 * 删除分账接收方请求
 * 
 * @public
 */
export interface DeleteReceiverRequest {
  /**
   * 商户号
   */
  mchid?: string;

  /**
   * 分账接收方类型
   */
  type: string;

  /**
   * 分账接收方账号
   */
  account: string;
}

/**
 * 解冻请求
 * 
 * @public
 */
export interface UnfreezeRequest {
  /**
   * 商户号
   */
  mchid?: string;

  /**
   * 微信订单号
   */
  transaction_id: string;

  /**
   * 商户分账单号
   */
  out_order_no: string;

  /**
   * 分账描述
   */
  description: string;
}

/**
 * 解冻响应
 * 
 * @public
 */
export interface UnfreezeResponse {
  /**
   * 商户号
   */
  mchid: string;

  /**
   * 微信订单号
   */
  transaction_id: string;

  /**
   * 商户分账单号
   */
  out_order_no: string;

  /**
   * 微信分账单号
   */
  order_id: string;

  /**
   * 分账单状态
   */
  state: string;
}

/**
 * 分账金额
 * 
 * @public
 */
export interface ProfitSharingAmounts {
  /**
   * 商户号
   */
  mchid: string;

  /**
   * 微信订单号
   */
  transaction_id: string;

  /**
   * 订单金额，单位：分
   */
  total_amount: number;

  /**
   * 已分账金额，单位：分
   */
  total_pledged: number;

  /**
   * 剩余待分金额，单位：分
   */
  total_unsplit: number;
}

/**
 * 分账账单请求
 * 
 * @public
 */
export interface SplitBillRequest {
  /**
   * 子商户号
   */
  sub_mchid?: string;

  /**
   * 账单日期
   */
  bill_date: string;

  /**
   * 压缩类型
   */
  tar_type?: 'GZIP';
}

/**
 * 分账账单响应
 * 
 * @public
 */
export interface SplitBillResponse {
  /**
   * 账单下载地址
   */
  download_url: string;
}

/**
 * 查询分账比例响应
 * 
 * @public
 */
export interface QueryMerchantRatioResponse {
  /**
   * 子商户号
   */
  sub_mchid: string;

  /**
   * 最大分账比例
   */
  max_ratio: number;

  /**
   * 剩余可分金额
   */
  left_ratio?: number;
}

/**
 * 创建分账回退请求
 * 
 * @public
 */
export interface CreateReturnOrderRequest {
  /**
   * 子商户号
   */
  sub_mchid?: string;

  /**
   * 微信订单号
   */
  order_id: string;

  /**
   * 商户回退单号
   */
  out_order_no: string;

  /**
   * 商户回退单号
   */
  out_return_no: string;

  /**
   * 回退金额
   */
  return_mchid: string;

  /**
   * 回退金额，单位：分
   */
  amount: number;

  /**
   * 回退描述
   */
  description: string;
}

/**
 * 查询分账回退请求
 * 
 * @public
 */
export interface QueryReturnOrderRequest {
  /**
   * 子商户号
   */
  sub_mchid?: string;

  /**
   * 商户回退单号
   */
  out_return_no: string;

  /**
   * 商户分账单号
   */
  out_order_no?: string;
}

/**
 * 分账回退响应
 * 
 * @public
 */
export interface ReturnOrderResponse {
  /**
   * 子商户号
   */
  sub_mchid?: string;

  /**
   * 微信回退单号
   */
  return_id: string;

  /**
   * 商户回退单号
   */
  out_return_no: string;

  /**
   * 微信分账单号
   */
  order_id: string;

  /**
   * 商户分账单号
   */
  out_order_no: string;

  /**
   * 回退状态
   */
  status: string;

  /**
   * 回退金额
   */
  amount: number;

  /**
   * 回退描述
   */
  description: string;

  /**
   * 失败原因
   */
  fail_reason?: string;

  /**
   * 创建时间
   */
  create_time?: string;

  /**
   * 完成时间
   */
  finish_time?: string;
}
