import crypto from 'crypto';
import { Output } from './interface-v2';
import { IPayRequest } from './pay-request.interface';

/**
 * 账单下载扩展服务
 * 提供账单摘要校验、文件下载等功能
 */
export class BillDownloadServiceExtension {
  private httpService: IPayRequest;

  constructor(httpService: IPayRequest) {
    this.httpService = httpService;
  }

  /**
   * 下载账单文件并校验完整性
   * @param downloadUrl 账单下载地址
   * @param expectedHash 期望的哈希值（从账单申请接口获取）
   * @param hashType 哈希类型，支持 SHA1、MD5
   */
  public async downloadAndVerifyBill(
    downloadUrl: string,
    expectedHash: string,
    hashType: 'SHA1' | 'MD5' = 'SHA1'
  ): Promise<{
    content: string;
    isValid: boolean;
    actualHash: string;
  }> {
    const result = await this.httpService.get(downloadUrl, {
      Accept: 'application/json',
      'User-Agent': 'wechatpay-node-v3/1.0.0',
      'Accept-Encoding': 'gzip',
    });

    if (result.status !== 200) {
      throw new Error(`下载账单失败，状态码：${result.status}`);
    }

    const content = result.data as string;

    // 计算哈希
    const actualHash = this.calculateHash(content, hashType);

    // 校验哈希
    const isValid = actualHash.toLowerCase() === expectedHash.toLowerCase();

    return {
      content,
      isValid,
      actualHash,
    };
  }

  /**
   * 计算账单文件的哈希值
   * @param content 文件内容
   * @param hashType 哈希类型
   */
  public calculateHash(content: string, hashType: 'SHA1' | 'MD5' = 'SHA1'): string {
    const hash = crypto.createHash(hashType.toLowerCase() as any);
    hash.update(content);
    return hash.digest('hex').toUpperCase();
  }

  /**
   * 解析 CSV 格式的账单
   * @param csvContent CSV 内容
   * @param hasHeader 是否包含表头，默认 true
   */
  public parseCsvBill<T = any>(csvContent: string, hasHeader = true): T[] {
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return [];
    }

    const results: T[] = [];
    
    // 获取表头
    const headers = hasHeader 
      ? lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      : [];

    // 解析数据行
    const startIndex = hasHeader ? 1 : 0;
    for (let i = startIndex; i < lines.length; i++) {
      const values = this.parseCsvLine(lines[i]);
      
      if (hasHeader) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        results.push(row as T);
      } else {
        results.push(values as any);
      }
    }

    return results;
  }

  /**
   * 解析 CSV 行（处理引号和逗号）
   */
  private parseCsvLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    values.push(current.trim());
    return values;
  }

  /**
   * 解压 GZIP 账单（如果需要）
   * @param compressedData 压缩数据
   */
  public async decompressGzip(compressedData: Buffer): Promise<string> {
    const zlib = await import('zlib');
    return new Promise((resolve, reject) => {
      zlib.gunzip(compressedData, (err, decompressed) => {
        if (err) {
          reject(err);
        } else {
          resolve(decompressed.toString('utf8'));
        }
      });
    });
  }
}

/**
 * 账单类型枚举
 */
export enum BillType {
  /** 全部账单 */
  ALL = 'ALL',
  /** 支付账单 */
  TRADE = 'TRADE',
  /** 退款账单 */
  REFUND = 'REFUND',
}

/**
 * 账单哈希类型
 */
export enum HashType {
  /** SHA1 */
  SHA1 = 'SHA1',
  /** MD5 */
  MD5 = 'MD5',
}

/**
 * 账单加密类型
 */
export enum EncryptType {
  /** 不加密 */
  NONE = 'NONE',
  /** 加密 */
  ENCRYPT = 'ENCRYPT',
}
