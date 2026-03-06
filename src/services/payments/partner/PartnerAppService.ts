import { Config } from '../../../core/Config';
import { HttpClient } from '../../../core/http/HttpClient';
import { 
  PartnerPrepayRequest, 
  PartnerPrepayResponse, 
  PartnerTransaction, 
  PartnerCloseOrderRequest,
  PartnerAmount,
  PartnerSceneInfo,
} from './PartnerNativePayService';

/**
 * 服务商 App 支付服务
 * 
 * @public
 */
export class PartnerAppService {
  private config: Config;
  private httpClient: HttpClient;

  constructor(config: Config, httpClient: HttpClient) {
    this.config = config;
    this.httpClient = httpClient;
  }

  async prepay(request: PartnerPrepayRequest): Promise<PartnerPrepayResponse> {
    const url = 'https://api.mch.weixin.qq.com/v3/pay/partner/transactions/app';
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

export { 
  PartnerPrepayRequest, 
  PartnerPrepayResponse, 
  PartnerTransaction, 
  PartnerCloseOrderRequest,
  PartnerAmount,
  PartnerSceneInfo,
};
