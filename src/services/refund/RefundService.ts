import { Config } from '../../core/Config';
import { HttpClient } from '../../core/http/HttpClient';

export class RefundService {
  private config: Config;
  private httpClient: HttpClient;

  constructor(config: Config, httpClient: HttpClient) {
    this.config = config;
    this.httpClient = httpClient;
  }

  /**
   * 退款申请
   * @param request 退款申请请求
   * @returns 退款响应
   */
  async create(request: CreateRefundRequest): Promise<Refund> {
    const url = 'https://api.mch.weixin.qq.com/v3/refund/domestic/refunds';
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('POST', url, request, signer);
    
    const headers = {
      'Authorization': authorization,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const response = await this.httpClient.post<Refund>(url, request, headers);
    return response.data;
  }

  /**
   * 查询单笔退款（通过商户退款单号）
   * @param request 查询请求
   * @returns 退款详情
   */
  async queryByOutRefundNo(request: QueryByOutRefundNoRequest): Promise<Refund> {
    const { out_refund_no, sub_mchid } = request;
    let url = `https://api.mch.weixin.qq.com/v3/refund/domestic/refunds/${out_refund_no}`;
    
    if (sub_mchid) {
      url += `?sub_mchid=${sub_mchid}`;
    }
    
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('GET', url, undefined, signer);
    
    const headers = {
      'Authorization': authorization,
      'Accept': 'application/json',
    };

    const response = await this.httpClient.get<Refund>(url, headers);
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

export interface CreateRefundRequest {
  out_refund_no: string;
  transaction_id?: string;
  out_trade_no?: string;
  reason?: string;
  notify_url?: string;
  amount: RefundAmount;
  goods_detail?: GoodsDetail[];
}

export interface QueryByOutRefundNoRequest {
  out_refund_no: string;
  sub_mchid?: string;
}

export interface RefundAmount {
  total: number;
  refund: number;
  currency?: string;
}

export interface GoodsDetail {
  merchant_goods_id: string;
  wechatpay_goods_id?: string;
  goods_name?: string;
  unit_price: number;
  refund_quantity: number;
  refund_amount: number;
}

export interface Refund {
  refund_id: string;
  out_refund_no: string;
  transaction_id: string;
  out_trade_no: string;
  channel: string;
  status: string;
  create_time: string;
  amount: RefundAmount;
  success_time?: string;
  reason?: string;
  funds_account?: string;
  promotion_detail?: PromotionDetail[];
}

export interface PromotionDetail {
  promotion_id: string;
  scope: string;
  type: string;
  amount: number;
}

export type RefundResponse = Refund;
export type RefundDetail = Refund;
