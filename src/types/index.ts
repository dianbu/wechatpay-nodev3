/**
 * 通用类型定义
 */

/**
 * 金额信息
 */
export interface Amount {
  /**
   * 订单金额，单位：分
   */
  total: number;

  /**
   * 货币类型
   */
  currency?: string;
}

/**
 * 分页查询参数
 */
export interface PaginationParams {
  /**
   * 分页页数
   */
  offset?: number;

  /**
   * 每页条数
   */
  limit?: number;
}

/**
 * 分页响应
 */
export interface PaginationResponse<T> {
  /**
   * 总条数
   */
  total_count: number;

  /**
   * 总页数
   */
  total_pages: number;

  /**
   * 数据列表
   */
  items: T[];
}

/**
 * 时间范围
 */
export interface TimeRange {
  /**
   * 开始时间
   */
  startTime?: string;

  /**
   * 结束时间
   */
  endTime?: string;
}
