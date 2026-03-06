import { HttpClient } from '../../../core/http/HttpClient';
import { Config } from '../../../core/Config';

export interface EcommerceSubsidyCreateRequest {
  sub_mchid: string;
  transaction_id: string;
  out_subsidy_no: string;
  amount: number;
  description?: string;
}

export interface EcommerceSubsidyCreateResponse {
  sub_mchid: string;
  transaction_id: string;
  out_subsidy_no: string;
  subsidy_id: string;
  status: string;
  create_time: string;
}

export interface EcommerceSubsidyCancelRequest {
  subsidy_id: string;
  sub_mchid?: string;
  out_subsidy_no?: string;
  reason?: string;
}

export interface EcommerceSubsidyCancelResponse {
  subsidy_id: string;
  sub_mchid: string;
  out_subsidy_no: string;
  status: string;
  cancel_time: string;
  reason?: string;
}

export interface EcommerceSubsidyReturnRequest {
  subsidy_id: string;
  sub_mchid?: string;
  return_account?: string;
  description?: string;
}

export interface EcommerceSubsidyReturnResponse {
  subsidy_id: string;
  sub_mchid: string;
  return_no: string;
  return_amount: number;
  return_account: string;
  status: string;
  create_time: string;
  description?: string;
}

export class EcommerceSubsidyService {
  private _httpClient: HttpClient;
  private _hostName?: string;

  constructor(httpClient: HttpClient, hostName?: string) {
    this._httpClient = httpClient;
    this._hostName = hostName;
  }

  public static builder(): EcommerceSubsidyBuilder {
    return new EcommerceSubsidyBuilder();
  }

  /**
   * 请求补贴
   */
  public async create(request: EcommerceSubsidyCreateRequest): Promise<EcommerceSubsidyCreateResponse> {
    let requestPath = 'https://api.mch.weixin.qq.com/v3/ecommerce/subsidies/apply';
    
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await this._httpClient.post(requestPath, request, headers);
    return response.data as EcommerceSubsidyCreateResponse;
  }

  /**
   * 取消补贴
   */
  public async cancel(request: EcommerceSubsidyCancelRequest): Promise<EcommerceSubsidyCancelResponse> {
    const { subsidy_id } = request;
    
    let requestPath = `https://api.mch.weixin.qq.com/v3/ecommerce/subsidies/${subsidy_id}/cancel`;
    
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await this._httpClient.post(requestPath, request, headers);
    return response.data as EcommerceSubsidyCancelResponse;
  }

  /**
   * 请求回退补贴
   */
  public async returnSubsidy(request: EcommerceSubsidyReturnRequest): Promise<EcommerceSubsidyReturnResponse> {
    const { subsidy_id } = request;
    
    let requestPath = `https://api.mch.weixin.qq.com/v3/ecommerce/subsidies/${subsidy_id}/return`;
    
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await this._httpClient.post(requestPath, request, headers);
    return response.data as EcommerceSubsidyReturnResponse;
  }
}

export class EcommerceSubsidyBuilder {
  private _httpClient?: HttpClient;
  private _hostName?: string;

  public config(config: Config): EcommerceSubsidyBuilder {
    this._httpClient = new (require('../../../core/http/HttpClient').DefaultHttpClient)();
    return this;
  }

  public httpClient(httpClient: HttpClient): EcommerceSubsidyBuilder {
    this._httpClient = httpClient;
    return this;
  }

  public hostName(hostName: string): EcommerceSubsidyBuilder {
    this._hostName = hostName;
    return this;
  }

  public build(): EcommerceSubsidyService {
    if (!this._httpClient) {
      throw new Error('httpClient is required');
    }
    return new EcommerceSubsidyService(this._httpClient, this._hostName);
  }
}
