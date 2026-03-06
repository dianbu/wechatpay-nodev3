//  * 微信支付 Node.js SDK v3


// ==================== 核心模块 ====================
export {
  Config,
  Signer,
  Verifier,
  PrivacyEncryptor,
  PrivacyDecryptor,
  AeadCipher,
  EncryptResult,
  DefaultSigner,
  DefaultVerifier,
  DefaultPrivacyEncryptor,
  DefaultPrivacyDecryptor,
  DefaultAeadCipher,
} from './core/Config';

export { RSAConfig, RSAConfigBuilder } from './core/config/RSAConfig';

export {
  HttpClient,
  HttpRequestConfig,
  HttpResponse,
  DefaultHttpClient,
} from './core/http/HttpClient';

export {
  CertificateManager,
  CertificateManagerConfig,
  CertificateInfo,
} from './core/certificate/CertificateManager';

export {
  NotificationParser,
  NotificationConfig,
  NotificationRequest,
  Notification,
  NotificationResource,
  TransactionNotification,
  RefundNotification,
  TransferBatchNotification,
  ProfitSharingNotification,
} from './core/notification/NotificationParser';

export { WechatPayException } from './core/exception/WechatPayException';
export { HttpException } from './core/exception/HttpException';
export { ValidationException } from './core/exception/ValidationException';
export { ServiceException } from './core/exception/ServiceException';
export { CipherException } from './core/exception/CipherException';
export { CertificateException } from './core/exception/CertificateException';

// ==================== 支付服务 ====================
export {
  NativePayService,
  NativePayPrepayRequest,
  NativePayPrepayResponse,
  Amount,
  SceneInfo,
  StoreInfo,
  CloseOrderRequest,
  Transaction,
} from './services/payments/NativePayService';

export {
  JsapiPayService,
  JsapiPayPrepayRequest,
  JsapiPayPrepayResponse,
  Payer,
  JsapiCallParams,
} from './services/payments/JsapiPayService';

export {
  AppPayService,
  AppPayPrepayRequest,
  AppPayPrepayResponse,
  AppCallParams,
} from './services/payments/AppPayService';

export {
  H5PayService,
  H5PayPrepayRequest,
  H5PayPrepayResponse,
  H5Info,
} from './services/payments/H5PayService';

// ==================== 退款服务 ====================
export {
  RefundService,
  CreateRefundRequest,
  RefundResponse,
  RefundDetail,
  RefundAmount,
  GoodsDetail,
  PromotionDetail,
} from './services/refund/RefundService';

// ==================== 分账服务 ====================
export {
  ProfitSharingService,
  ProfitSharingRequest,
  ProfitSharingResponse,
  ProfitSharingResult,
  Receiver,
  AddReceiverRequest,
  DeleteReceiverRequest,
  UnfreezeRequest,
  UnfreezeResponse,
  ProfitSharingAmounts,
} from './services/profitsharing/ProfitSharingService';

// ==================== 账单服务 ====================
export {
  BillService,
  BillRequest,
  BillResponse,
} from './services/bill/BillService';

// ==================== 转账服务 ====================
export {
  TransferService,
  CreateTransferRequest,
  TransferResponse,
  TransferBatchDetail,
  TransferDetail,
  TransferDetailItem,
} from './services/transfer/TransferService';

// ==================== 服务商支付服务 ====================
export {
  PartnerNativePayService,
  PartnerPrepayRequest,
  PartnerPrepayResponse,
  PartnerAmount,
  PartnerSceneInfo,
  PartnerStoreInfo,
  PartnerCloseOrderRequest,
  PartnerTransaction,
} from './services/payments/partner/PartnerNativePayService';

export {
  PartnerJsapiService,
} from './services/payments/partner/PartnerJsapiService';

export {
  PartnerAppService,
} from './services/payments/partner/PartnerAppService';

export {
  PartnerH5Service,
} from './services/payments/partner/PartnerH5Service';

// ==================== 品牌分账服务 ====================
export {
  BrandProfitSharingService,
  BrandReceiver,
  BrandProfitSharingOrder,
  BrandCreateOrderRequest,
  BrandCreateOrderResponse,
  BrandFinishOrderRequest,
  BrandFinishOrderResponse,
  BrandQueryOrderRequest,
  BrandQueryOrderResponse,
  BrandQueryOrderAmountRequest,
  BrandQueryOrderAmountResponse,
  BrandAddReceiverRequest,
  BrandAddReceiverResponse,
  BrandDeleteReceiverRequest,
  BrandDeleteReceiverResponse,
  BrandCreateReturnOrderRequest,
  BrandCreateReturnOrderResponse,
  BrandQueryReturnOrderRequest,
  BrandQueryReturnOrderResponse,
  BrandQueryBrandMerchantRatioRequest,
  BrandQueryBrandMerchantRatioResponse,
} from './services/profitsharing/brand/BrandProfitSharingService';

// ==================== 电商分账服务 ====================
export {
  EcommerceProfitSharingService,
  EcommerceProfitSharingReceiver,
  EcommerceCreateOrderRequest,
  EcommerceCreateOrderResponse,
  EcommerceFinishOrderRequest,
  EcommerceFinishOrderResponse,
  EcommerceQueryOrderRequest,
  EcommerceQueryOrderResponse,
  EcommerceQueryOrderAmountRequest,
  EcommerceQueryOrderAmountResponse,
  EcommerceAddReceiverRequest,
  EcommerceAddReceiverResponse,
  EcommerceDeleteReceiverRequest,
  EcommerceDeleteReceiverResponse,
  EcommerceCreateReturnOrderRequest,
  EcommerceCreateReturnOrderResponse,
  EcommerceQueryReturnOrderRequest,
  EcommerceQueryReturnOrderResponse,
  EcommerceCreateAfterSalesOrderRequest,
  EcommerceCreateAfterSalesOrderResponse,
  EcommerceQueryAfterSalesOrderRequest,
  EcommerceQueryAfterSalesOrderResponse,
} from './services/ecommerce/profitsharing/EcommerceProfitSharingService';

// ==================== 电商退款服务 ====================
export {
  EcommerceRefundService,
  EcommerceRefundAmount,
  EcommerceRefundGoodsDetail,
  EcommerceCreateRefundRequest,
  EcommerceRefund,
  EcommerceQueryRefundByRefundIdRequest,
  EcommerceQueryRefundByOutRefundNoRequest,
  EcommerceCreateReturnAdvanceRequest,
  EcommerceReturnAdvance,
  EcommerceQueryReturnAdvanceRequest,
} from './services/ecommerce/refund/EcommerceRefundService';

// ==================== 电商补贴服务 ====================
export {
  EcommerceSubsidyService,
  EcommerceSubsidyCreateRequest,
  EcommerceSubsidyCreateResponse,
  EcommerceSubsidyCancelRequest,
  EcommerceSubsidyCancelResponse,
  EcommerceSubsidyReturnRequest,
  EcommerceSubsidyReturnResponse,
} from './services/ecommerce/subsidy/EcommerceSubsidyService';

// ==================== 代金券服务 ====================
export {
  CashCouponsService,
} from './services/marketing/cashcoupons/CashCouponsService';

// ==================== 商家券服务 ====================
export {
  MerchantExclusiveCouponService,
} from './services/marketing/merchantcoupon/MerchantExclusiveCouponService';

// ==================== 银行营销服务 ====================
export {
  MarketingBankPackagesService,
  ListTaskRequest,
  TaskInfo,
  ListTaskResponse,
} from './services/marketing/bankpackages/MarketingBankPackagesService';

// ==================== 证书服务 ====================
export {
  CertificateService,
  Certificate,
  DownloadCertificateResponse,
} from './services/file/CertificateService';

// ==================== 文件上传服务 ====================
export {
  FileUploadService,
  FileUploadResponse,
} from './services/file/FileUploadService';

// ==================== 点金计划服务 ====================
export {
  GoldPlanService,
  SetAdvertisingIndustryFilterRequest,
  ChangeGoldPlanStatusRequest,
  ChangeGoldPlanStatusResponse,
  ChangeCustomPageStatusRequest,
  ChangeCustomPageStatusResponse,
  OpenAdvertisingShowRequest,
  CloseAdvertisingShowRequest,
} from './services/goldplan/GoldPlanService';

// ==================== 支付有礼服务 ====================
export {
  GiftActivityService,
  CreateFullSendActRequest,
  CreateFullSendActResponse,
  GetActDetailRequest,
  ActDetail,
  ListActivitiesRequest,
  ListActivitiesResponse,
  TerminateActivityRequest,
  TerminateActivityResponse,
  AddActivityMerchantRequest,
  AddActivityMerchantResponse,
  DeleteActivityMerchantRequest,
  DeleteActivityMerchantResponse,
  ListActivityMerchantRequest,
  ListActivityMerchantResponse,
  ListActivitySkuRequest,
  ListActivitySkuResponse,
} from './services/giftactivity/GiftActivityService';

// ==================== 爱心餐服务 ====================
export {
  LovefeastService,
  GetBrandRequest,
  Brand,
  GetByUserRequest,
  UserLovefeast,
  ListByUserRequest,
  ListByUserResponse,
} from './services/lovefeast/LovefeastService';

// ==================== 微工卡服务 ====================
export {
  PayrollCardService,
  PreOrderAuthenticationRequest,
  PreOrderAuthenticationResponse,
  PreOrderAuthenticationWithAuthRequest,
  GetAuthenticationRequest,
  Authentication,
  ListAuthenticationsRequest,
  ListAuthenticationsResponse,
  GetRelationRequest,
  Relation,
  CreateTokenRequest,
  CreateTokenResponse,
  CreateTransferBatchRequest,
  CreateTransferBatchResponse,
} from './services/payrollcard/PayrollCardService';

// ==================== 零售小店服务 ====================
export {
  RetailStoreService,
  CreateMaterialsRequest,
  CreateMaterialsResponse,
  AddStoresRequest,
  AddStoresResponse,
  DeleteStoresRequest,
  DeleteStoresResponse,
  GetStoreRequest,
  Store,
  ListStoreRequest,
  ListStoreResponse,
  AddRepresentativeRequest,
  AddRepresentativeResponse,
  DeleteRepresentativeRequest,
  DeleteRepresentativeResponse,
  ListRepresentativeRequest,
  ListRepresentativeResponse,
  ApplyActivityRequest,
  ApplyActivityResponse,
  ListActsByAreaRequest,
  ListActsByAreaResponse,
  LockQualificationRequest,
  LockQualificationResponse,
  UnlockQualificationRequest,
  UnlockQualificationResponse,
} from './services/retailstore/RetailStoreService';

// ==================== 公共出行服务 ====================
export {
  WeixinPayScanAndRideService,
  CreateTransactionRequest,
  CreateTransactionResponse,
  QueryTransactionRequest,
  Transaction as ScanAndRideTransaction,
  QueryUserServiceRequest,
  UserService,
} from './services/scanandride/WeixinPayScanAndRideService';

// ==================== 停车服务 ====================
export {
  WexinPayScoreParkingService,
  CreateParkingRequest,
  CreateParkingResponse,
  QueryPlateServiceRequest,
  PlateService,
  CreateParkingTransactionRequest,
  CreateParkingTransactionResponse,
  QueryParkingTransactionRequest,
  ParkingTransaction,
} from './services/parking/WexinPayScoreParkingService';
