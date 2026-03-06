import { Config } from '../../core/Config';
import { HttpClient } from '../../core/http/HttpClient';
import { Amount, SceneInfo, CloseOrderRequest, Transaction } from './NativePayService';

/**
 * H5 支付服务
 * 提供 H5 支付相关的 API 调用
 * 
 * @public
 */
export class H5PayService {
  private config: Config;
  private httpClient: HttpClient;

  constructor(config: Config, httpClient: HttpClient) {
    this.config = config;
    this.httpClient = httpClient;
  }

  /**
   * H5 支付下单
   * @param request 下单请求
   * @returns 下单响应
   */
  async prepay(request: H5PayPrepayRequest): Promise<H5PayPrepayResponse> {
    const url = 'https://api.mch.weixin.qq.com/v3/pay/transactions/h5';
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('POST', url, request, signer);
    
    const headers = {
      'Authorization': authorization,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const response = await this.httpClient.post<H5PayPrepayResponse>(url, request, headers);
    return response.data;
  }

  /**
   * 查询订单（通过微信支付订单号）
   */
  async queryById(transactionId: string, mchid?: string): Promise<Transaction> {
    const url = `https://api.mch.weixin.qq.com/v3/pay/transactions/id/${transactionId}`;
    const query = mchid ? `?mchid=${mchid}` : '';
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('GET', url + query, undefined, signer);
    
    const headers = {
      'Authorization': authorization,
      'Accept': 'application/json',
    };

    const response = await this.httpClient.get<Transaction>(url + query, headers);
    return response.data;
  }

  /**
   * 查询订单（通过商户订单号）
   */
  async queryByOutTradeNo(outTradeNo: string, mchid?: string): Promise<Transaction> {
    const url = `https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/${outTradeNo}`;
    const query = mchid ? `?mchid=${mchid}` : '';
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('GET', url + query, undefined, signer);
    
    const headers = {
      'Authorization': authorization,
      'Accept': 'application/json',
    };

    const response = await this.httpClient.get<Transaction>(url + query, headers);
    return response.data;
  }

  /**
   * 关闭订单
   */
  async close(request: CloseOrderRequest): Promise<void> {
    const url = `https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/${request.out_trade_no}/close`;
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
 * H5 支付下单请求
 * 
 * @public
 */
export interface H5PayPrepayRequest {
  /**
   * 应用 ID
   */
  appid?: string;

  /**
   * 商户号
   */
  mchid?: string;

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
  amount: Amount;

  /**
   * 场景信息
   */
  scene_info: SceneInfo;

  /**
   * H5 场景信息
   */
  h5_info: H5Info;

  /**
   * 附加数据
   */
  attach?: string;
}

/**
 * H5 场景信息
 * 
 * @public
 */
export interface H5Info {
  /**
   * 场景类型
   */
  type: string;

  /**
   * APP 名称
   */
  app_name?: string;

  /**
   * APP 包名
   */
  app_bundle?: string;

  /**
   * APP 下载 URL
   */
  app_download_url?: string;

  /**
   * WAP 地址
   */
  wap_url?: string;

  /**
   * WAP 网站名称
   */
  wap_name?: string;
}

/**
 * H5 支付下单响应
 * 
 * @public
 */
export interface H5PayPrepayResponse {
  /**
   * H5 URL
   */
  h5_url: string;
}
