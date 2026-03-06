import { Config } from '../../core/Config';
import { HttpClient } from '../../core/http/HttpClient';

/**
 * JSAPI 支付服务
 * 提供 JSAPI 支付相关的 API 调用
 * 
 * @public
 */
export class JsapiPayService {
  private config: Config;
  private httpClient: HttpClient;

  constructor(config: Config, httpClient: HttpClient) {
    this.config = config;
    this.httpClient = httpClient;
  }

  /**
   * JSAPI 支付下单
   * @param request 下单请求
   * @returns 下单响应
   */
  async prepay(request: JsapiPayPrepayRequest): Promise<JsapiPayPrepayResponse> {
    const url = 'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi';
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('POST', url, request, signer);
    
    const headers = {
      'Authorization': authorization,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const response = await this.httpClient.post<JsapiPayPrepayResponse>(url, request, headers);
    return response.data;
  }

  /**
   * 获取 JSAPI 调起支付参数
   * @param prepayId 预支付 ID
   * @returns 调起支付的参数
   */
  async getJsapiParams(prepayId: string): Promise<JsapiCallParams> {
    const appId = this.config.appId || '';
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonceStr = Math.random().toString(36).substr(2, 15);
    const packageValue = `prepay_id=${prepayId}`;

    const signData = `${appId}\n${timestamp}\n${nonceStr}\n${packageValue}\n`;
    const signer = this.config.createSigner();
    const signature = await signer.sign(signData);

    return {
      appId,
      timeStamp: timestamp,
      nonceStr,
      package: packageValue,
      signType: 'RSA',
      paySign: signature,
    };
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
 * JSAPI 支付下单请求
 * 
 * @public
 */
export interface JsapiPayPrepayRequest {
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
   * 支付者信息
   */
  payer: Payer;

  /**
   * 场景信息
   */
  scene_info?: SceneInfo;

  /**
   * 附加数据
   */
  attach?: string;
}

/**
 * 支付者信息
 * 
 * @public
 */
export interface Payer {
  /**
   * 用户 openid
   */
  openid: string;
}

/**
 * JSAPI 支付下单响应
 * 
 * @public
 */
export interface JsapiPayPrepayResponse {
  /**
   * 预支付 ID
   */
  prepay_id: string;
}

/**
 * JSAPI 调起支付参数
 * 
 * @public
 */
export interface JsapiCallParams {
  /**
   * 应用 ID
   */
  appId: string;

  /**
   * 时间戳
   */
  timeStamp: string;

  /**
   * 随机字符串
   */
  nonceStr: string;

  /**
   * 订单详情扩展字符串
   */
  package: string;

  /**
   * 签名类型
   */
  signType: string;

  /**
   * 签名
   */
  paySign: string;
}

/**
 * 订单金额
 * 
 * @public
 */
export interface Amount {
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
 * 场景信息
 * 
 * @public
 */
export interface SceneInfo {
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
  store_info?: StoreInfo;
}

/**
 * 门店信息
 * 
 * @public
 */
export interface StoreInfo {
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
 * 关闭订单请求
 * 
 * @public
 */
export interface CloseOrderRequest {
  /**
   * 商户订单号
   */
  out_trade_no: string;

  /**
   * 商户号
   */
  mchid?: string;
}

/**
 * 交易详情
 * 
 * @public
 */
export interface Transaction {
  /**
   * 商户号
   */
  mchid: string;

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
  amount: Amount;

  /**
   * 支付者信息
   */
  payer?: {
    openid: string;
  };
}
