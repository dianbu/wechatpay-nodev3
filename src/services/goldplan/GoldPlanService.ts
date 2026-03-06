import { HttpClient } from '../../core/http/HttpClient';
import { Config } from '../../core/Config';

export interface SetAdvertisingIndustryFilterRequest {
  sub_mchid: string;
  industry_ids: string[];
}

export interface ChangeGoldPlanStatusRequest {
  sub_mchid: string;
  advertising_status: string;
}

export interface ChangeGoldPlanStatusResponse {
  sub_mchid: string;
  advertising_status: string;
}

export interface ChangeCustomPageStatusRequest {
  sub_mchid: string;
  custompage_status: string;
}

export interface ChangeCustomPageStatusResponse {
  sub_mchid: string;
  custompage_status: string;
}

export interface OpenAdvertisingShowRequest {
  sub_mchid: string;
  page_id: string;
}

export interface CloseAdvertisingShowRequest {
  sub_mchid: string;
}

export class GoldPlanService {
  private _httpClient: HttpClient;
  private _hostName?: string;

  constructor(httpClient: HttpClient, hostName?: string) {
    this._httpClient = httpClient;
    this._hostName = hostName;
  }

  public static builder(): GoldPlanServiceBuilder {
    return new GoldPlanServiceBuilder();
  }

  private getRequestPath(path: string): string {
    let requestPath = `https://api.mch.weixin.qq.com${path}`;
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }
    return requestPath;
  }

  public async closeAdvertisingShow(request: CloseAdvertisingShowRequest): Promise<void> {
    const requestPath = this.getRequestPath('/v3/goldplan/merchants/close-advertising-show');
    await this._httpClient.post(requestPath, request);
  }

  public async openAdvertisingShow(request: OpenAdvertisingShowRequest): Promise<void> {
    const requestPath = this.getRequestPath('/v3/goldplan/merchants/open-advertising-show');
    await this._httpClient.patch(requestPath, request);
  }

  public async setAdvertisingIndustryFilter(request: SetAdvertisingIndustryFilterRequest): Promise<void> {
    const requestPath = this.getRequestPath('/v3/goldplan/merchants/set-advertising-industry-filter');
    await this._httpClient.post(requestPath, request);
  }

  public async changeCustomPageStatus(
    request: ChangeCustomPageStatusRequest
  ): Promise<ChangeCustomPageStatusResponse> {
    const requestPath = this.getRequestPath('/v3/goldplan/merchants/changecustompagestatus');
    const response = await this._httpClient.post(requestPath, request);
    return response.data as ChangeCustomPageStatusResponse;
  }

  public async changeGoldPlanStatus(
    request: ChangeGoldPlanStatusRequest
  ): Promise<ChangeGoldPlanStatusResponse> {
    const requestPath = this.getRequestPath('/v3/goldplan/merchants/changegoldplanstatus');
    const response = await this._httpClient.post(requestPath, request);
    return response.data as ChangeGoldPlanStatusResponse;
  }
}

export class GoldPlanServiceBuilder {
  private _httpClient?: HttpClient;
  private _hostName?: string;

  public config(config: Config): GoldPlanServiceBuilder {
    this._httpClient = config.createHttpClient();
    return this;
  }

  public httpClient(httpClient: HttpClient): GoldPlanServiceBuilder {
    this._httpClient = httpClient;
    return this;
  }

  public hostName(hostName: string): GoldPlanServiceBuilder {
    this._hostName = hostName;
    return this;
  }

  public build(): GoldPlanService {
    if (!this._httpClient) {
      throw new Error('httpClient is required');
    }
    return new GoldPlanService(this._httpClient, this._hostName);
  }
}
