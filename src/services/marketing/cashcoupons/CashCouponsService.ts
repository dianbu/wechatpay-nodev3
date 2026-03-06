import { HttpClient } from '../../../core/http/HttpClient';
import { Config } from '../../../core/Config';

export class CashCouponsService {
  private _httpClient: HttpClient;
  private _hostName?: string;

  constructor(httpClient: HttpClient, hostName?: string) {
    this._httpClient = httpClient;
    this._hostName = hostName;
  }

  public static builder(): CashCouponsServiceBuilder {
    return new CashCouponsServiceBuilder();
  }

  private getRequestPath(path: string): string {
    let requestPath = `https://api.mch.weixin.qq.com${path}`;
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }
    return requestPath;
  }

  public async createCouponStock(request: any): Promise<{ stock_id: string }> {
    const requestPath = this.getRequestPath('/v3/marketing/favor/coupon-stocks');
    const response = await this._httpClient.post(requestPath, request);
    return response.data as { stock_id: string };
  }

  public async queryStock(request: { stock_id: string }): Promise<any> {
    const { stock_id } = request;
    const requestPath = this.getRequestPath(`/v3/marketing/favor/coupon-stocks/${stock_id}`);
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data;
  }

  public async listStocks(request: { offset?: number; limit?: number; stock_type?: string }): Promise<any> {
    const params: string[] = [];
    if (request.offset !== undefined) params.push(`offset=${request.offset}`);
    if (request.limit !== undefined) params.push(`limit=${request.limit}`);
    if (request.stock_type) params.push(`stock_type=${request.stock_type}`);

    const requestPath = this.getRequestPath(
      `/v3/marketing/favor/coupon-stocks${params.length > 0 ? '?' + params.join('&') : ''}`
    );
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data;
  }

  public async startStock(request: { stock_id: string }): Promise<{ stock_id: string }> {
    const { stock_id } = request;
    const requestPath = this.getRequestPath(`/v3/marketing/favor/coupon-stocks/${stock_id}/start`);
    const response = await this._httpClient.post(requestPath, {});
    return response.data as { stock_id: string };
  }

  public async pauseStock(request: { stock_id: string }): Promise<{ stock_id: string }> {
    const { stock_id } = request;
    const requestPath = this.getRequestPath(`/v3/marketing/favor/coupon-stocks/${stock_id}/pause`);
    const response = await this._httpClient.post(requestPath, {});
    return response.data as { stock_id: string };
  }

  public async restartStock(request: { stock_id: string }): Promise<{ stock_id: string }> {
    const { stock_id } = request;
    const requestPath = this.getRequestPath(`/v3/marketing/favor/coupon-stocks/${stock_id}/restart`);
    const response = await this._httpClient.post(requestPath, {});
    return response.data as { stock_id: string };
  }

  public async stopStock(request: { stock_id: string }): Promise<{ stock_id: string }> {
    const { stock_id } = request;
    const requestPath = this.getRequestPath(`/v3/marketing/favor/coupon-stocks/${stock_id}/stop`);
    const response = await this._httpClient.post(requestPath, {});
    return response.data as { stock_id: string };
  }

  public async sendCoupon(request: { openid: string; stock_id: string; out_request_no: string }): Promise<any> {
    const requestPath = this.getRequestPath('/v3/marketing/favor/coupons');
    const response = await this._httpClient.post(requestPath, request);
    return response.data;
  }

  public async queryCoupon(request: { coupon_id: string; appid?: string; openid?: string }): Promise<any> {
    const params: string[] = [];
    if (request.coupon_id) params.push(`coupon_id=${request.coupon_id}`);
    if (request.appid) params.push(`appid=${request.appid}`);
    if (request.openid) params.push(`openid=${request.openid}`);

    const requestPath = this.getRequestPath(
      `/v3/marketing/favor/coupons?${params.join('&')}`
    );
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data;
  }

  public async listCouponsByFilter(request: { appid?: string; openid?: string; status?: string; offset?: number; limit?: number }): Promise<any> {
    const params: string[] = [];
    if (request.appid) params.push(`appid=${request.appid}`);
    if (request.openid) params.push(`openid=${request.openid}`);
    if (request.status) params.push(`status=${request.status}`);
    if (request.offset !== undefined) params.push(`offset=${request.offset}`);
    if (request.limit !== undefined) params.push(`limit=${request.limit}`);

    const requestPath = this.getRequestPath(
      `/v3/marketing/favor/coupons?${params.join('&')}`
    );
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data;
  }

  public async useFlow(request: { stock_id: string }): Promise<any> {
    const { stock_id } = request;
    const requestPath = this.getRequestPath(`/v3/marketing/favor/stocks/${stock_id}/use-flow`);
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data;
  }

  public async refundFlow(request: { stock_id: string }): Promise<any> {
    const { stock_id } = request;
    const requestPath = this.getRequestPath(`/v3/marketing/favor/stocks/${stock_id}/refund-flow`);
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data;
  }

  public async setCallback(request: { mchid: string; notify_url: string }): Promise<any> {
    const requestPath = this.getRequestPath('/v3/marketing/favor/callbacks');
    const response = await this._httpClient.post(requestPath, request);
    return response.data;
  }

  public async queryCallback(request: { mchid: string }): Promise<any> {
    const { mchid } = request;
    const requestPath = this.getRequestPath(`/v3/marketing/favor/callbacks/${mchid}`);
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data;
  }

  public async listAvailableMerchants(request: { stock_id: string; offset?: number; limit?: number }): Promise<any> {
    const { stock_id, ...params } = request;
    const queryParams: string[] = [];
    if (params.offset !== undefined) queryParams.push(`offset=${params.offset}`);
    if (params.limit !== undefined) queryParams.push(`limit=${params.limit}`);

    const requestPath = this.getRequestPath(
      `/v3/marketing/favor/stocks/${stock_id}/merchants${queryParams.length > 0 ? '?' + queryParams.join('&') : ''}`
    );
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data;
  }

  public async listAvailableSingleitems(request: { stock_id: string; offset?: number; limit?: number }): Promise<any> {
    const { stock_id, ...params } = request;
    const queryParams: string[] = [];
    if (params.offset !== undefined) queryParams.push(`offset=${params.offset}`);
    if (params.limit !== undefined) queryParams.push(`limit=${params.limit}`);

    const requestPath = this.getRequestPath(
      `/v3/marketing/favor/stocks/${stock_id}/items${queryParams.length > 0 ? '?' + queryParams.join('&') : ''}`
    );
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const response = await this._httpClient.get(requestPath, headers);
    return response.data;
  }
}

export class CashCouponsServiceBuilder {
  private _httpClient?: HttpClient;
  private _hostName?: string;

  public config(config: Config): CashCouponsServiceBuilder {
    this._httpClient = config.createHttpClient();
    return this;
  }

  public httpClient(httpClient: HttpClient): CashCouponsServiceBuilder {
    this._httpClient = httpClient;
    return this;
  }

  public hostName(hostName: string): CashCouponsServiceBuilder {
    this._hostName = hostName;
    return this;
  }

  public build(): CashCouponsService {
    if (!this._httpClient) {
      throw new Error('httpClient is required');
    }
    return new CashCouponsService(this._httpClient, this._hostName);
  }
}
