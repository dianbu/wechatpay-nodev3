import { Config } from '../../core/Config';
import { HttpClient } from '../../core/http/HttpClient';

/**
 * 转账服务
 * 提供商家转账到零钱相关的 API 调用
 * 
 * @public
 */
export class TransferService {
  private config: Config;
  private httpClient: HttpClient;

  constructor(config: Config, httpClient: HttpClient) {
    this.config = config;
    this.httpClient = httpClient;
  }

  /**
   * 发起商家转账
   * @param request 转账请求
   * @returns 转账响应
   */
  async createTransfer(request: CreateTransferRequest): Promise<TransferResponse> {
    const url = 'https://api.mch.weixin.qq.com/v3/transfer/batches';
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('POST', url, request, signer);
    
    const headers = {
      'Authorization': authorization,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const response = await this.httpClient.post<TransferResponse>(url, request, headers);
    return response.data;
  }

  /**
   * 查询转账批次
   * @param batchId 微信批次单号
   * @returns 批次详情
   */
  async queryTransferBatch(batchId: string): Promise<TransferBatchDetail> {
    const url = `https://api.mch.weixin.qq.com/v3/transfer/batches/batch-id/${batchId}`;
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('GET', url, undefined, signer);
    
    const headers = {
      'Authorization': authorization,
      'Accept': 'application/json',
    };

    const response = await this.httpClient.get<TransferBatchDetail>(url, headers);
    return response.data;
  }

  /**
   * 查询转账明细
   * @param batchId 微信批次单号
   * @param detailId 微信明细单号
   * @returns 明细详情
   */
  async queryTransferDetail(batchId: string, detailId: string): Promise<TransferDetail> {
    const url = `https://api.mch.weixin.qq.com/v3/transfer/batches/batch-id/${batchId}/details/detail-id/${detailId}`;
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('GET', url, undefined, signer);
    
    const headers = {
      'Authorization': authorization,
      'Accept': 'application/json',
    };

    const response = await this.httpClient.get<TransferDetail>(url, headers);
    return response.data;
  }

  /**
   * 通过商户批次单号查询转账批次
   * @param outBatchNo 商户批次单号
   * @returns 批次详情
   */
  async getTransferBatchByOutNo(outBatchNo: string): Promise<TransferBatchDetail> {
    const url = `https://api.mch.weixin.qq.com/v3/transfer/batches/out-batch-no/${outBatchNo}`;
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('GET', url, undefined, signer);
    
    const headers = {
      'Authorization': authorization,
      'Accept': 'application/json',
    };

    const response = await this.httpClient.get<TransferBatchDetail>(url, headers);
    return response.data;
  }

  /**
   * 通过商户明细单号查询转账明细
   * @param outBatchNo 商户批次单号
   * @param outDetailNo 商户明细单号
   * @returns 明细详情
   */
  async getTransferDetailByOutNo(outBatchNo: string, outDetailNo: string): Promise<TransferDetail> {
    const url = `https://api.mch.weixin.qq.com/v3/transfer/batches/out-batch-no/${outBatchNo}/details/out-detail-no/${outDetailNo}`;
    const signer = this.config.createSigner();
    const authorization = await this.buildAuthorization('GET', url, undefined, signer);
    
    const headers = {
      'Authorization': authorization,
      'Accept': 'application/json',
    };

    const response = await this.httpClient.get<TransferDetail>(url, headers);
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

/**
 * 发起商家转账请求
 * 
 * @public
 */
export interface CreateTransferRequest {
  /**
   * 商户号
   */
  mchid?: string;

  /**
   * 商家批次单号
   */
  out_batch_no: string;

  /**
   * 批次名称
   */
  batch_name: string;

  /**
   * 批次备注
   */
  batch_remark: string;

  /**
   * 转账总金额，单位：分
   */
  total_amount: number;

  /**
   * 转账总笔数
   */
  total_num: number;

  /**
   * 转账明细列表
   */
  transfer_detail_list: TransferDetailItem[];

  /**
   * 转账场景 ID
   */
  transfer_scene_id?: string;
}

/**
 * 转账明细
 * 
 * @public
 */
export interface TransferDetailItem {
  /**
   * 商家明细单号
   */
  out_detail_no: string;

  /**
   * 转账金额，单位：分
   */
  transfer_amount: number;

  /**
   * 转账备注
   */
  transfer_remark: string;

  /**
   * 收款用户 openid
   */
  openid: string;

  /**
   * 收款用户姓名（加密）
   */
  user_name?: string;
}

/**
 * 转账响应
 * 
 * @public
 */
export interface TransferResponse {
  /**
   * 商户号
   */
  mchid: string;

  /**
   * 商家批次单号
   */
  out_batch_no: string;

  /**
   * 微信批次单号
   */
  batch_id: string;

  /**
   * 批次状态
   */
  batch_status: string;

  /**
   * 批次创建时间
   */
  create_time: string;
}

/**
 * 转账批次详情
 * 
 * @public
 */
export interface TransferBatchDetail extends TransferResponse {
  /**
   * 批次名称
   */
  batch_name: string;

  /**
   * 批次备注
   */
  batch_remark: string;

  /**
   * 转账总金额，单位：分
   */
  total_amount: number;

  /**
   * 转账总笔数
   */
  total_num: number;

  /**
   * 批次状态
   */
  batch_status: string;

  /**
   * 转账成功金额，单位：分
   */
  success_amount?: number;

  /**
   * 转账成功笔数
   */
  success_num?: number;

  /**
   * 转账失败金额，单位：分
   */
  fail_amount?: number;

  /**
   * 转账失败笔数
   */
  fail_num?: number;

  /**
   * 批次关闭时间
   */
  close_time?: string;
}

/**
 * 转账明细详情
 * 
 * @public
 */
export interface TransferDetail {
  /**
   * 商户号
   */
  mchid: string;

  /**
   * 商家明细单号
   */
  out_detail_no: string;

  /**
   * 微信明细单号
   */
  detail_id: string;

  /**
   * 微信批次单号
   */
  batch_id: string;

  /**
   * 收款用户 openid
   */
  openid: string;

  /**
   * 转账金额，单位：分
   */
  transfer_amount: number;

  /**
   * 转账备注
   */
  transfer_remark: string;

  /**
   * 明细状态
   */
  detail_status: string;

  /**
   * 明细创建时间
   */
  create_time: string;

  /**
   * 明细成功时间
   */
  success_time?: string;

  /**
   * 明细失败时间
   */
  fail_time?: string;

  /**
   * 失败原因
   */
  fail_reason?: string;
}
