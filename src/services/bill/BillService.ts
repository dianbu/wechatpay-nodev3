import { Config } from '../../core/Config';
import { HttpClient } from '../../core/http/HttpClient';

export class BillService {
  private config: Config;
  private httpClient: HttpClient;

  constructor(config: Config, httpClient: HttpClient) {
    this.config = config;
    this.httpClient = httpClient;
  }

  /**
   * 申请交易账单
   */
  async getTradeBill(request: BillRequest): Promise<BillResponse> {
    const url = 'https://api.mch.weixin.qq.com/v3/bill/tradebill';
    const query = this.buildQuery(request);
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('GET', url + query, undefined, signer);
    
    const headers = {
      'Authorization': authorization,
      'Accept': 'application/json',
    };

    const response = await this.httpClient.get<BillResponse>(url + query, headers);
    return response.data;
  }

  /**
   * 申请资金账单
   */
  async getFundFlowBill(request: FundFlowBillRequest): Promise<BillResponse> {
    const url = 'https://api.mch.weixin.qq.com/v3/bill/fundflowbill';
    const query = this.buildFundFlowQuery(request);
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('GET', url + query, undefined, signer);
    
    const headers = {
      'Authorization': authorization,
      'Accept': 'application/json',
    };

    const response = await this.httpClient.get<BillResponse>(url + query, headers);
    return response.data;
  }

  /**
   * 申请单个子商户资金账单
   */
  async getSingleSubMchFundFlowBill(request: SingleSubMchFundFlowBillRequest): Promise<BillResponse> {
    const url = 'https://api.mch.weixin.qq.com/v3/bill/sub-merchant-fundflowbill';
    const query = this.buildSingleSubMchQuery(request);
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('GET', url + query, undefined, signer);
    
    const headers = {
      'Authorization': authorization,
      'Accept': 'application/json',
    };

    const response = await this.httpClient.get<BillResponse>(url + query, headers);
    return response.data;
  }

  /**
   * 申请二级商户资金账单
   */
  async getAllSubMchFundFlowBill(request: AllSubMchFundFlowBillRequest): Promise<BillResponse> {
    const url = 'https://api.mch.weixin.qq.com/v3/ecommerce/bill/fundflowbill';
    const query = this.buildAllSubMchQuery(request);
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('GET', url + query, undefined, signer);
    
    const headers = {
      'Authorization': authorization,
      'Accept': 'application/json',
    };

    const response = await this.httpClient.get<BillResponse>(url + query, headers);
    return response.data;
  }

  private buildQuery(request: BillRequest): string {
    const params: string[] = [];
    
    if (request.bill_date) {
      params.push(`bill_date=${encodeURIComponent(request.bill_date)}`);
    }
    
    if (request.sub_mchid) {
      params.push(`sub_mchid=${encodeURIComponent(request.sub_mchid)}`);
    }
    
    if (request.bill_type) {
      params.push(`bill_type=${encodeURIComponent(request.bill_type)}`);
    }
    
    if (request.tar_type) {
      params.push(`tar_type=${encodeURIComponent(request.tar_type)}`);
    }

    return params.length > 0 ? `?${params.join('&')}` : '';
  }

  private buildFundFlowQuery(request: FundFlowBillRequest): string {
    const params: string[] = [];
    
    if (request.bill_date) {
      params.push(`bill_date=${encodeURIComponent(request.bill_date)}`);
    }
    
    if (request.account_type) {
      params.push(`account_type=${encodeURIComponent(request.account_type)}`);
    }
    
    if (request.tar_type) {
      params.push(`tar_type=${encodeURIComponent(request.tar_type)}`);
    }

    return params.length > 0 ? `?${params.join('&')}` : '';
  }

  private buildSingleSubMchQuery(request: SingleSubMchFundFlowBillRequest): string {
    const params: string[] = [];
    
    if (request.sub_mchid) {
      params.push(`sub_mchid=${encodeURIComponent(request.sub_mchid)}`);
    }
    
    if (request.bill_date) {
      params.push(`bill_date=${encodeURIComponent(request.bill_date)}`);
    }
    
    if (request.account_type) {
      params.push(`account_type=${encodeURIComponent(request.account_type)}`);
    }
    
    if (request.algorithm) {
      params.push(`algorithm=${encodeURIComponent(request.algorithm)}`);
    }
    
    if (request.tar_type) {
      params.push(`tar_type=${encodeURIComponent(request.tar_type)}`);
    }

    return params.length > 0 ? `?${params.join('&')}` : '';
  }

  private buildAllSubMchQuery(request: AllSubMchFundFlowBillRequest): string {
    const params: string[] = [];
    
    if (request.bill_date) {
      params.push(`bill_date=${encodeURIComponent(request.bill_date)}`);
    }
    
    if (request.account_type) {
      params.push(`account_type=${encodeURIComponent(request.account_type)}`);
    }
    
    if (request.tar_type) {
      params.push(`tar_type=${encodeURIComponent(request.tar_type)}`);
    }
    
    if (request.algorithm) {
      params.push(`algorithm=${encodeURIComponent(request.algorithm)}`);
    }

    return params.length > 0 ? `?${params.join('&')}` : '';
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

export interface BillRequest {
  bill_date: string;
  sub_mchid?: string;
  bill_type?: 'ALL' | 'SUCCESS' | 'REFUND';
  tar_type?: 'GZIP';
}

export interface FundFlowBillRequest {
  bill_date: string;
  account_type?: 'BASIC' | 'OPERATION' | 'FEES';
  tar_type?: 'GZIP';
}

export interface SingleSubMchFundFlowBillRequest {
  sub_mchid: string;
  bill_date: string;
  account_type?: 'BASIC' | 'OPERATION' | 'FEES';
  algorithm?: 'AEAD_AES_256_GCM';
  tar_type?: 'GZIP';
}

export interface AllSubMchFundFlowBillRequest {
  bill_date: string;
  account_type?: 'BASIC' | 'OPERATION' | 'FEES';
  algorithm?: 'AEAD_AES_256_GCM';
  tar_type?: 'GZIP';
}

export interface BillResponse {
  hash_type: string;
  hash_value: string;
  download_url: string;
  encrypt_type?: 'NONE' | 'ENCRYPT';
  total_size?: number;
}
