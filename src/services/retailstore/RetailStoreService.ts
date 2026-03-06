import { HttpClient, HttpResponse } from '../../core/http/HttpClient';

export interface CreateMaterialsRequest {
  store_name: string;
  store_address: string;
  store_phone: string;
  business_license?: string;
  store_photos?: string[];
}

export interface CreateMaterialsResponse {
  material_id: string;
  create_time: string;
}

export interface AddStoresRequest {
  material_id: string;
  stores: Array<{
    store_id: string;
    store_name: string;
    store_address: string;
    store_phone: string;
  }>;
}

export interface AddStoresResponse {
  material_id: string;
  add_time: string;
}

export interface DeleteStoresRequest {
  material_id: string;
  store_ids: string[];
}

export interface DeleteStoresResponse {
  material_id: string;
  delete_time: string;
}

export interface GetStoreRequest {
  store_id: string;
}

export interface Store {
  store_id: string;
  store_name: string;
  store_address: string;
  store_phone: string;
  status: string;
  create_time?: string;
  update_time?: string;
}

export interface ListStoreRequest {
  offset?: number;
  limit?: number;
  store_status?: string;
}

export interface ListStoreResponse {
  data?: Store[];
  total_count: number;
  offset: number;
  limit: number;
}

export interface AddRepresentativeRequest {
  material_id: string;
  representatives: Array<{
    representative_id: string;
    representative_name: string;
    representative_phone: string;
  }>;
}

export interface AddRepresentativeResponse {
  material_id: string;
  add_time: string;
}

export interface DeleteRepresentativeRequest {
  material_id: string;
  representative_ids: string[];
}

export interface DeleteRepresentativeResponse {
  material_id: string;
  delete_time: string;
}

export interface ListRepresentativeRequest {
  material_id: string;
  offset?: number;
  limit?: number;
}

export interface ListRepresentativeResponse {
  data?: Array<{
    representative_id: string;
    representative_name: string;
    representative_phone: string;
    status: string;
    create_time?: string;
  }>;
  total_count: number;
  offset: number;
  limit: number;
}

export interface ApplyActivityRequest {
  material_id: string;
  activity_type: string;
  activity_name: string;
  begin_time: string;
  end_time: string;
}

export interface ApplyActivityResponse {
  activity_id: string;
  create_time: string;
}

export interface ListActsByAreaRequest {
  province: string;
  city: string;
  district?: string;
  offset?: number;
  limit?: number;
}

export interface ListActsByAreaResponse {
  data?: Array<{
    activity_id: string;
    activity_name: string;
    activity_type: string;
    begin_time: string;
    end_time: string;
    status: string;
  }>;
  total_count: number;
  offset: number;
  limit: number;
}

export interface LockQualificationRequest {
  openid: string;
  activity_id: string;
}

export interface LockQualificationResponse {
  openid: string;
  activity_id: string;
  lock_time: string;
}

export interface UnlockQualificationRequest {
  openid: string;
  activity_id: string;
}

export interface UnlockQualificationResponse {
  openid: string;
  activity_id: string;
  unlock_time: string;
}

export class RetailStoreService {
  private httpClient: HttpClient;
  private hostName?: string;

  constructor(httpClient: HttpClient, hostName?: string) {
    this.httpClient = httpClient;
    this.hostName = hostName;
  }

  public static builder(): Builder {
    return new Builder();
  }

  private getRequestPath(path: string): string {
    let requestPath = `https://api.mch.weixin.qq.com${path}`;
    if (this.hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this.hostName);
    }
    return requestPath;
  }

  public async createMaterials(request: CreateMaterialsRequest): Promise<CreateMaterialsResponse> {
    const requestPath = this.getRequestPath('/v3/retail-store/materials');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response: HttpResponse<CreateMaterialsResponse> = await this.httpClient.post<CreateMaterialsResponse>(
      requestPath,
      request,
      headers
    );
    return response.data;
  }

  public async addStores(request: AddStoresRequest): Promise<AddStoresResponse> {
    const { material_id, stores } = request;
    const requestPath = this.getRequestPath(`/v3/retail-store/materials/${material_id}/stores/add`);
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response: HttpResponse<AddStoresResponse> = await this.httpClient.post<AddStoresResponse>(
      requestPath,
      { stores },
      headers
    );
    return response.data;
  }

  public async deleteStores(request: DeleteStoresRequest): Promise<DeleteStoresResponse> {
    const { material_id, store_ids } = request;
    const requestPath = this.getRequestPath(`/v3/retail-store/materials/${material_id}/stores/delete`);
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response: HttpResponse<DeleteStoresResponse> = await this.httpClient.post<DeleteStoresResponse>(
      requestPath,
      { store_ids },
      headers
    );
    return response.data;
  }

  public async getStore(request: GetStoreRequest): Promise<Store> {
    const { store_id } = request;
    const requestPath = this.getRequestPath(`/v3/retail-store/stores/${store_id}`);
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response: HttpResponse<Store> = await this.httpClient.get<Store>(requestPath, headers);
    return response.data;
  }

  public async listStore(request: ListStoreRequest): Promise<ListStoreResponse> {
    const params: string[] = [];
    if (request.offset !== undefined) params.push(`offset=${request.offset}`);
    if (request.limit !== undefined) params.push(`limit=${request.limit}`);
    if (request.store_status) params.push(`store_status=${request.store_status}`);

    const requestPath = this.getRequestPath(
      `/v3/retail-store/stores${params.length > 0 ? '?' + params.join('&') : ''}`
    );
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response: HttpResponse<ListStoreResponse> = await this.httpClient.get<ListStoreResponse>(
      requestPath,
      headers
    );
    return response.data;
  }

  public async addRepresentative(request: AddRepresentativeRequest): Promise<AddRepresentativeResponse> {
    const { material_id, representatives } = request;
    const requestPath = this.getRequestPath(`/v3/retail-store/materials/${material_id}/representatives/add`);
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response: HttpResponse<AddRepresentativeResponse> = await this.httpClient.post<AddRepresentativeResponse>(
      requestPath,
      { representatives },
      headers
    );
    return response.data;
  }

  public async deleteRepresentative(request: DeleteRepresentativeRequest): Promise<DeleteRepresentativeResponse> {
    const { material_id, representative_ids } = request;
    const requestPath = this.getRequestPath(`/v3/retail-store/materials/${material_id}/representatives/delete`);
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response: HttpResponse<DeleteRepresentativeResponse> = await this.httpClient.post<DeleteRepresentativeResponse>(
      requestPath,
      { representative_ids },
      headers
    );
    return response.data;
  }

  public async listRepresentative(request: ListRepresentativeRequest): Promise<ListRepresentativeResponse> {
    const { material_id, ...params } = request;
    const queryParams: string[] = [];
    if (params.offset !== undefined) queryParams.push(`offset=${params.offset}`);
    if (params.limit !== undefined) queryParams.push(`limit=${params.limit}`);

    const requestPath = this.getRequestPath(
      `/v3/retail-store/materials/${material_id}/representatives${queryParams.length > 0 ? '?' + queryParams.join('&') : ''}`
    );
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response: HttpResponse<ListRepresentativeResponse> = await this.httpClient.get<ListRepresentativeResponse>(
      requestPath,
      headers
    );
    return response.data;
  }

  public async applyActivity(request: ApplyActivityRequest): Promise<ApplyActivityResponse> {
    const requestPath = this.getRequestPath('/v3/retail-store/activities');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response: HttpResponse<ApplyActivityResponse> = await this.httpClient.post<ApplyActivityResponse>(
      requestPath,
      request,
      headers
    );
    return response.data;
  }

  public async listActsByArea(request: ListActsByAreaRequest): Promise<ListActsByAreaResponse> {
    const params: string[] = [
      `province=${encodeURIComponent(request.province)}`,
      `city=${encodeURIComponent(request.city)}`,
    ];
    if (request.district) params.push(`district=${encodeURIComponent(request.district)}`);
    if (request.offset !== undefined) params.push(`offset=${request.offset}`);
    if (request.limit !== undefined) params.push(`limit=${request.limit}`);

    const requestPath = this.getRequestPath(`/v3/retail-store/activities?${params.join('&')}`);
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response: HttpResponse<ListActsByAreaResponse> = await this.httpClient.get<ListActsByAreaResponse>(
      requestPath,
      headers
    );
    return response.data;
  }

  public async lockQualification(request: LockQualificationRequest): Promise<LockQualificationResponse> {
    const requestPath = this.getRequestPath('/v3/retail-store/qualifications/lock');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response: HttpResponse<LockQualificationResponse> = await this.httpClient.post<LockQualificationResponse>(
      requestPath,
      request,
      headers
    );
    return response.data;
  }

  public async unlockQualification(request: UnlockQualificationRequest): Promise<UnlockQualificationResponse> {
    const requestPath = this.getRequestPath('/v3/retail-store/qualifications/unlock');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const response: HttpResponse<UnlockQualificationResponse> = await this.httpClient.post<UnlockQualificationResponse>(
      requestPath,
      request,
      headers
    );
    return response.data;
  }
}

export class Builder {
  private httpClientValue?: HttpClient;
  private hostNameValue?: string;

  public httpClient(httpClient: HttpClient): Builder {
    this.httpClientValue = httpClient;
    return this;
  }

  public hostName(hostName: string): Builder {
    this.hostNameValue = hostName;
    return this;
  }

  public build(): RetailStoreService {
    if (!this.httpClientValue) {
      throw new Error('httpClient is required');
    }
    return new RetailStoreService(this.httpClientValue, this.hostNameValue);
  }
}
