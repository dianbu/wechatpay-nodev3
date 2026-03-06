/**
 * 服务模块索引
 * 导出所有新增的业务服务
 */

// 异常处理
export {
  HttpException,
  ValidationException,
  ServiceException,
  MalformedMessageException,
  CipherException,
  CertificateException,
} from './exceptions';

// 证书管理
export {
  AutoCertificateManager,
  CertificateInfo,
  autoCertificateManager,
} from './certificate-manager';

// 通知解析
export {
  NotificationParser,
  NotificationRequest,
  Notification,
  NotificationResource,
  NotificationConfig,
  TransactionNotification,
  RefundNotification,
  TransferBatchNotification,
  ProfitSharingNotification,
} from './notification-parser';

// HTTP 客户端
export {
  EnhancedHttpClient,
  HttpClientConfig,
  PayRequest,
} from './http-client';

// 账单下载扩展
export {
  BillDownloadServiceExtension,
  BillType,
  HashType,
  EncryptType,
} from './services/billdownload-extension';

// 品牌分账
export {
  BrandProfitSharingService,
  AddReceiverRequest as BrandAddReceiverRequest,
  DeleteReceiverRequest as BrandDeleteReceiverRequest,
  CreateOrderRequest as BrandCreateOrderRequest,
  QueryOrderRequest as BrandQueryOrderRequest,
  UnfreezeRequest as BrandUnfreezeRequest,
  Receiver as BrandReceiver,
} from './services/brand-profitsharing';

// 电商分账
export {
  EcommerceProfitSharingService,
  AddReceiverRequest as EcommerceAddReceiverRequest,
  DeleteReceiverRequest as EcommerceDeleteReceiverRequest,
  CreateOrderRequest as EcommerceCreateOrderRequest,
  QueryOrderRequest as EcommerceQueryOrderRequest,
  CreateAfterSalesOrderRequest,
  QueryAfterSalesOrderRequest,
  FinishOrderRequest,
  Receiver as EcommerceReceiver,
} from './services/ecommerce-profitsharing';

// 电商退款
export {
  EcommerceRefundService,
  CreateRefundRequest,
  RefundAmount,
  GoodsDetail,
  CreateAbnormalRefundRequest,
} from './services/ecommerce-refund';

// 现金优惠券
export {
  CashCouponsService,
  CreateCouponStockRequest,
  StockUseRule,
  NormalInfo,
  PatternInfo,
  SendCouponRequest,
  ModifyStockBudgetRequest,
  PauseStockRequest,
  RestartStockRequest,
  StopStockRequest,
} from './services/cash-coupons';
