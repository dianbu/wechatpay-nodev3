import { HttpClient, HttpResponse } from '../../core/http/HttpClient';
import { Config } from '../../core/Config';
import * as fs from 'fs';

export interface FileUploadResponse {
  media_id: string;
}

export class FileUploadService {
  private _httpClient: HttpClient;
  private _hostName?: string;

  constructor(httpClient: HttpClient, hostName?: string) {
    this._httpClient = httpClient;
    this._hostName = hostName;
  }

  public static builder(): FileUploadServiceBuilder {
    return new FileUploadServiceBuilder();
  }

  private getRequestPath(path: string): string {
    let requestPath = `https://api.mch.weixin.qq.com${path}`;
    if (this._hostName) {
      requestPath = requestPath.replace('api.mch.weixin.qq.com', this._hostName);
    }
    return requestPath;
  }

  /**
   * 上传视频（通过文件路径）
   */
  public async uploadVideoByPath(
    uploadPath: string,
    meta: string,
    videoPath: string
  ): Promise<FileUploadResponse> {
    const video = fs.readFileSync(videoPath);
    const fileName = videoPath.split(/[/\\]/).pop() || 'video.mp4';
    return this.uploadVideo(uploadPath, meta, fileName, video);
  }

  /**
   * 上传视频（通过字节数组）
   */
  public async uploadVideo(
    uploadPath: string,
    meta: string,
    fileName: string,
    video: Buffer
  ): Promise<FileUploadResponse> {
    const requestPath = this.getRequestPath(uploadPath);
    
    const formData = new FormData();
    formData.append('meta', meta);
    formData.append('file', new Blob([video]), fileName);
    
    const response = await this._httpClient.post(requestPath, formData);
    return response.data as FileUploadResponse;
  }

  /**
   * 上传图片（通过文件路径）
   */
  public async uploadImageByPath(
    uploadPath: string,
    meta: string,
    imagePath: string
  ): Promise<FileUploadResponse> {
    const image = fs.readFileSync(imagePath);
    const fileName = imagePath.split(/[/\\]/).pop() || 'image.jpg';
    return this.uploadImage(uploadPath, meta, fileName, image);
  }

  /**
   * 上传图片（通过字节数组）
   */
  public async uploadImage(
    uploadPath: string,
    meta: string,
    fileName: string,
    image: Buffer
  ): Promise<FileUploadResponse> {
    const requestPath = this.getRequestPath(uploadPath);
    
    const formData = new FormData();
    formData.append('meta', meta);
    formData.append('file', new Blob([image]), fileName);
    
    const response = await this._httpClient.post(requestPath, formData);
    return response.data as FileUploadResponse;
  }
}

export class FileUploadServiceBuilder {
  private _httpClient?: HttpClient;
  private _hostName?: string;

  public config(config: Config): FileUploadServiceBuilder {
    this._httpClient = config.createHttpClient();
    return this;
  }

  public httpClient(httpClient: HttpClient): FileUploadServiceBuilder {
    this._httpClient = httpClient;
    return this;
  }

  public hostName(hostName: string): FileUploadServiceBuilder {
    this._hostName = hostName;
    return this;
  }

  public build(): FileUploadService {
    if (!this._httpClient) {
      throw new Error('httpClient is required');
    }
    return new FileUploadService(this._httpClient, this._hostName);
  }
}
