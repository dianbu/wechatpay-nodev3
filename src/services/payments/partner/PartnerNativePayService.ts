import { Config } from '../../../core/Config';
import { HttpClient } from '../../../core/http/HttpClient';

/**
 * 服务商 Native 支付服务
 * 提供服务商 Native 支付相关的 API 调用
 * 
 * @public
 */
export class PartnerNativePayService {
  private config: Config;
  private httpClient: HttpClient;

  constructor(config: Config, httpClient: HttpClient) {
    this.config = config;
    this.httpClient = httpClient;
  }

  /**
   * 服务商 Native 支付下单
   * @param request 下单请求
   * @returns 下单响应
   */
  async prepay(request: PartnerPrepayRequest): Promise<PartnerPrepayResponse> {
    const url = 'https://api.mch.weixin.qq.com/v3/pay/partner/transactions/native';
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('POST', url, request, signer);
    
    const headers = {
      'Authorization': authorization,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const response = await this.httpClient.post<PartnerPrepayResponse>(url, request, headers);
    return response.data;
  }

  /**
   * 查询订单（通过微信支付订单号）
   */
  async queryById(transactionId: string, sp_mchid?: string, sub_mchid?: string): Promise<PartnerTransaction> {
    let url = `https://api.mch.weixin.qq.com/v3/pay/partner/transactions/id/${transactionId}`;
    const params: string[] = [];
    if (sp_mchid) params.push(`sp_mchid=${sp_mchid}`);
    if (sub_mchid) params.push(`sub_mchid=${sub_mchid}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('GET', url, undefined, signer);
    
    const headers = {
      'Authorization': authorization,
      'Accept': 'application/json',
    };

    const response = await this.httpClient.get<PartnerTransaction>(url, headers);
    return response.data;
  }

  /**
   * 查询订单（通过商户订单号）
   */
  async queryByOutTradeNo(outTradeNo: string, sp_mchid?: string, sub_mchid?: string): Promise<PartnerTransaction> {
    let url = `https://api.mch.weixin.qq.com/v3/pay/partner/transactions/out-trade-no/${outTradeNo}`;
    const params: string[] = [];
    if (sp_mchid) params.push(`sp_mchid=${sp_mchid}`);
    if (sub_mchid) params.push(`sub_mchid=${sub_mchid}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('GET', url, undefined, signer);
    
    const headers = {
      'Authorization': authorization,
      'Accept': 'application/json',
    };

    const response = await this.httpClient.get<PartnerTransaction>(url, headers);
    return response.data;
  }

  /**
   * 关闭订单
   */
  async close(request: PartnerCloseOrderRequest): Promise<void> {
    const url = `https://api.mch.weixin.qq.com/v3/pay/partner/transactions/out-trade-no/${request.out_trade_no}/close`;
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('POST', url, request, signer);
    
    const headers = {
      'Authorization': authorization,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    await this.httpClient.post(url, request, headers);
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
 * 服务商支付请求
 * 
 * @public
 */
export interface PartnerPrepayRequest {
  /**
   * 服务商户号
   */
  sp_appid?: string;

  /**
   * 服务商户号
   */
  sp_mchid?: string;

  /**
   * 子商户号
   */
  sub_mchid: string;

  /**
   * 商品描述
   */
  description: string;

  /**
   * 商户订单号
   */
  out_trade_no: string;

  /**
   * 回调地址
   */
  notify_url: string;

  /**
   * 订单金额
   */
  amount: PartnerAmount;

  /**
   * 场景信息
   */
  scene_info?: PartnerSceneInfo;

  /**
   * 附加数据
   */
  attach?: string;
}

/**
 * 服务商订单金额
 * 
 * @public
 */
export interface PartnerAmount {
  /**
   * 订单金额，单位：分
   */
  total: number;

  /**
   * 货币类型
   */
  currency?: string;
}

/**
 * 服务商家场景信息
 * 
 * @public
 */
export interface PartnerSceneInfo {
  /**
   * 用户 IP
   */
  payer_client_ip: string;

  /**
   * 设备 ID
   */
  device_id?: string;

  /**
   * 门店信息
   */
  store_info?: PartnerStoreInfo;
}

/**
 * 服务商家门店信息
 * 
 * @public
 */
export interface PartnerStoreInfo {
  /**
   * 门店 ID
   */
  id: string;

  /**
   * 门店名称
   */
  name?: string;

  /**
   * 地区编码
   */
  area_code?: string;

  /**
   * 详细地址
   */
  address?: string;
}

/**
 * 服务商支付响应
 * 
 * @public
 */
export interface PartnerPrepayResponse {
  /**
   * 二维码链接
   */
  code_url: string;
}

/**
 * 服务商关闭订单请求
 * 
 * @public
 */
export interface PartnerCloseOrderRequest {
  /**
   * 服务商户号
   */
  sp_mchid?: string;

  /**
   * 子商户号
   */
  sub_mchid?: string;

  /**
   * 商户订单号
   */
  out_trade_no: string;
}

/**
 * 服务商交易详情
 * 
 * @public
 */
export interface PartnerTransaction {
  /**
   * 服务商户号
   */
  sp_mchid: string;

  /**
   * 子商户号
   */
  sub_mchid: string;

  /**
   * 商户订单号
   */
  out_trade_no: string;

  /**
   * 微信支付订单号
   */
  transaction_id: string;

  /**
   * 交易类型
   */
  trade_type: string;

  /**
   * 交易状态
   */
  trade_state: string;

  /**
   * 交易状态描述
   */
  trade_state_desc: string;

  /**
   * 付款银行
   */
  bank_type: string;

  /**
   * 附加数据
   */
  attach?: string;

  /**
   * 支付完成时间
   */
  success_time?: string;

  /**
   * 订单金额
   */
  amount: PartnerAmount;

  /**
   * 支付者信息
   */
  payer?: {
    sub_openid: string;
  };
}
