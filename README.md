
<p style="text-align: center;">
  <h1 align="center"><a href="javascript:void(0);">wechatpay-nodev3</a></h1>
</p>


# 微信支付 v3 SDK（TypeScript）

## 简介

微信支付 Node.js SDK v3 版本，对标微信支付官方 Java SDK，提供完整的微信支付 API v3 接口封装，支持 TypeScript 和 JavaScript 项目。

## 特性

- 完整的微信支付 API v3 接口支持（22+ 服务模块）
- 原生 TypeScript 支持，提供完整的类型定义
- Builder 模式构建服务，链式调用简洁优雅
- 统一的服务接口设计，易于理解和使用
- 支持多种配置方式（RSAConfig、自定义 Config）

## 安装

```bash
npm install wechatpay-nodev3@3.0.0
# 或
yarn add wechatpay-nodev3@3.0.0
```

## 快速开始

### 1. 基础配置

```typescript
import { RSAConfig } from 'wechatpay-nodev3';
import fs from 'fs';

// 使用 RSAConfig 配置
const config = RSAConfig.builder()
  .merchantId('你的商户号')
  .privateKey(fs.readFileSync('./apiclient_key.pem'))
  .merchantSerialNumber('证书序列号')
  .apiV3Key('APIv3密钥')
  .appId('应用ID（可选）')
  .wechatpaySerial('微信支付平台证书序列号')
  .build();
```

### 2. 基础支付示例（Native 支付）

```typescript
import { NativePayService } from 'wechatpay-nodev3';

// 构建服务
const nativePayService = NativePayService.builder()
  .config(config)
  .build();

// 发起支付
const response = await nativePayService.prepay({
  appid: '应用ID',
  mchid: '商户号',
  description: '商品描述',
  out_trade_no: '商户订单号',
  notify_url: 'https://your-domain.com/notify',
  amount: {
    total: 100, // 金额，单位分
  },
});

console.log('支付二维码链接:', response.code_url);
```

## 完整服务列表

### 基础支付（直连商户）

| 服务 | 类名 | 说明 |
|------|------|------|
| Native 支付 | `NativePayService` | 扫码支付 |
| JSAPI 支付 | `JsapiPayService` | 公众号/小程序支付 |
| APP 支付 | `AppPayService` | 移动应用支付 |
| H5 支付 | `H5PayService` | 移动端网页支付 |

### 服务商支付

| 服务 | 类名 | 说明 |
|------|------|------|
| 服务商 Native 支付 | `PartnerNativePayService` | 服务商扫码支付 |
| 服务商 JSAPI 支付 | `PartnerJsapiService` | 服务商公众号支付 |
| 服务商 APP 支付 | `PartnerAppService` | 服务商 APP 支付 |
| 服务商 H5 支付 | `PartnerH5Service` | 服务商 H5 支付 |

### 退款服务

```typescript
import { RefundService } from 'wechatpay-nodev3';

const refundService = RefundService.builder()
  .config(config)
  .build();

// 申请退款
const refund = await refundService.create({
  out_trade_no: '原订单号',
  out_refund_no: '退款单号',
  reason: '退款原因',
  amount: {
    refund: 100,
    total: 100,
    currency: 'CNY',
  },
});

// 查询退款
const result = await refundService.queryByOutRefundNo({
  out_refund_no: '退款单号',
});
```

### 转账服务

```typescript
import { TransferService } from 'wechatpay-nodev3';

const transferService = TransferService.builder()
  .config(config)
  .build();

// 发起转账
const batch = await transferService.createTransferBatch({
  appid: '应用ID',
  out_batch_no: '批次单号',
  batch_name: '转账批次名称',
  batch_remark: '转账备注',
  total_amount: 1000,
  total_num: 1,
  transfer_detail_list: [{
    out_detail_no: '明细单号',
    transfer_amount: 1000,
    transfer_remark: '转账备注',
    openid: '用户OpenID',
  }],
});
```

### 分账服务

```typescript
import { 
  ProfitSharingService,
  BrandProfitSharingService,
  EcommerceProfitSharingService 
} from 'wechatpay-nodev3';

// 普通分账
const profitSharingService = ProfitSharingService.builder()
  .config(config)
  .build();

const order = await profitSharingService.createOrder({
  appid: '应用ID',
  transaction_id: '微信订单号',
  out_order_no: '商户分账单号',
  receivers: [{
    type: 'MERCHANT_ID',
    account: '分账接收方商户号',
    amount: 10,
    description: '分账描述',
  }],
});

// 品牌分账
const brandService = BrandProfitSharingService.builder()
  .config(config)
  .build();

// 电商分账
const ecommerceService = EcommerceProfitSharingService.builder()
  .config(config)
  .build();
```

### 电商服务

```typescript
import { 
  EcommerceRefundService,
  EcommerceSubsidyService 
} from 'wechatpay-nodev3';

// 电商退款
const ecommerceRefundService = EcommerceRefundService.builder()
  .config(config)
  .build();

const refund = await ecommerceRefundService.create({
  sub_mchid: '二级商户号',
  sp_appid: '服务商应用ID',
  transaction_id: '微信订单号',
  out_refund_no: '退款单号',
  amount: {
    refund: 100,
    total: 100,
    currency: 'CNY',
  },
});

// 电商补贴
const subsidyService = EcommerceSubsidyService.builder()
  .config(config)
  .build();
```

### 账单服务

```typescript
import { BillService } from 'wechatpay-nodev3';

const billService = BillService.builder()
  .config(config)
  .build();

// 下载交易账单
const tradeBill = await billService.getTradeBill({
  bill_date: '2024-01-01',
});

// 下载资金账单
const fundflowBill = await billService.getFundflowBill({
  bill_date: '2024-01-01',
  account_type: 'BASIC',
});
```

### 营销服务

```typescript
import { 
  CashCouponsService,
  MerchantExclusiveCouponService,
  MarketingBankPackagesService 
} from 'wechatpay-nodev3';

// 代金券服务
const cashCouponsService = CashCouponsService.builder()
  .config(config)
  .build();

const stock = await cashCouponsService.createCouponStock({
  stock_name: '代金券批次名称',
  belong_merchant: '商户号',
  available_begin_time: '2024-01-01T00:00:00+08:00',
  available_end_time: '2024-12-31T23:59:59+08:00',
  stock_use_rule: {
    max_coupons: 100,
    max_amount: 10000,
  },
  coupon_use_rule: {},
  no_cash: false,
});

// 商家券服务
const merchantCouponService = MerchantExclusiveCouponService.builder()
  .config(config)
  .build();

// 银行营销服务
const bankPackagesService = MarketingBankPackagesService.builder()
  .config(config)
  .build();
```

### 文件服务

```typescript
import { 
  CertificateService,
  FileUploadService 
} from 'wechatpay-nodev3';

// 证书服务
const certificateService = CertificateService.builder()
  .config(config)
  .build();

const certs = await certificateService.downloadCertificate();

// 文件上传服务
const fileUploadService = FileUploadService.builder()
  .config(config)
  .build();

const uploadResult = await fileUploadService.uploadImageByPath(
  '/v3/marketing/favor/media/image-upload',
  '{"filename":"test.jpg"}',
  './test.jpg'
);
```

### 点金计划

```typescript
import { GoldPlanService } from 'wechatpay-nodev3';

const goldPlanService = GoldPlanService.builder()
  .config(config)
  .build();

// 开通广告展示
await goldPlanService.openAdvertisingShow({
  sub_mchid: '子商户号',
  page_id: '页面ID',
});

// 关闭广告展示
await goldPlanService.closeAdvertisingShow({
  sub_mchid: '子商户号',
});

// 点金计划管理
await goldPlanService.changeGoldPlanStatus({
  sub_mchid: '子商户号',
  advertising_status: 'OPEN',
});
```

### 支付有礼

```typescript
import { GiftActivityService } from 'wechatpay-nodev3';

const giftActivityService = GiftActivityService.builder()
  .config(config)
  .build();

// 创建全场满额送活动
const activity = await giftActivityService.createFullSendAct({
  activity_name: '活动名称',
  begin_time: '2024-01-01T00:00:00+08:00',
  end_time: '2024-12-31T23:59:59+08:00',
  coupon_list: [{
    coupon_id: '券ID',
    coupon_name: '券名称',
    coupon_type: 'NORMAL',
    coupon_amount: 100,
    transaction_minimum: 1000,
  }],
});
```

### 爱心餐

```typescript
import { LovefeastService } from 'wechatpay-nodev3';

const lovefeastService = LovefeastService.builder()
  .config(config)
  .build();

// 查询品牌信息
const brand = await lovefeastService.getBrand({
  brand_id: '品牌ID',
});
```

### 微工卡

```typescript
import { PayrollCardService } from 'wechatpay-nodev3';

const payrollCardService = PayrollCardService.builder()
  .config(config)
  .build();

// 预下单
const auth = await payrollCardService.preOrderAuthentication({
  openid: '用户OpenID',
  authenticate_number: '认证单号',
  authenticate_type: ' SIGN',
});

// 创建 Token
const token = await payrollCardService.createToken({
  openid: '用户OpenID',
  mchid: '商户号',
});
```

### 零售小店

```typescript
import { RetailStoreService } from 'wechatpay-nodev3';

const retailStoreService = RetailStoreService.builder()
  .config(config)
  .build();

// 创建门店物料
const materials = await retailStoreService.createMaterials({
  brand_id: '品牌ID',
});
```

### 公共出行

```typescript
import { WeixinPayScanAndRideService } from 'wechatpay-nodev3';

const scanAndRideService = WeixinPayScanAndRideService.builder()
  .config(config)
  .build();

// 创建扣费受理
const transaction = await scanAndRideService.createTransaction({
  appid: '应用ID',
  mchid: '商户号',
  out_trade_no: '商户订单号',
  total_amount: 100,
  body: '描述',
});
```

### 停车服务

```typescript
import { WexinPayScoreParkingService } from 'wechatpay-nodev3';

const parkingService = WexinPayScoreParkingService.builder()
  .config(config)
  .build();

// 创建停车入场
const parking = await parkingService.createParking({
  appid: '应用ID',
  plate_number: '车牌号',
  plate_color: 'BLUE',
  start_time: '2024-01-01T00:00:00+08:00',
});
```

## 回调通知处理

```typescript
import { NotificationParser } from 'wechatpay-nodev3';
import crypto from 'crypto';

// 创建通知解析器
const notificationParser = new NotificationParser(config);

// 解析回调通知
app.post('/wechatpay/notify', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const notification = await notificationParser.parse(req.body, {
      'Wechatpay-Serial': req.headers['wechatpay-serial'] as string,
      'Wechatpay-Timestamp': req.headers['wechatpay-timestamp'] as string,
      'Wechatpay-Nonce': req.headers['wechatpay-nonce'] as string,
      'Wechatpay-Signature': req.headers['wechatpay-signature'] as string,
    });
    
    console.log('回调内容:', notification);
    
    // 处理业务逻辑...
    
    res.status(200).send({ code: 'SUCCESS', message: '成功' });
  } catch (error) {
    console.error('回调处理失败:', error);
    res.status(500).send({ code: 'FAIL', message: error.message });
  }
});
```

## 错误处理

```typescript
try {
  const result = await nativePayService.prepay(params);
} catch (error) {
  if (error instanceof WechatPayException) {
    console.error('微信支付错误:', error.message);
    console.error('错误码:', error.code);
  } else {
    console.error('其他错误:', error);
  }
}
```

## 自定义配置

如果需要自定义 HTTP 客户端或其他配置，可以实现 `Config` 接口：

```typescript
import { Config, Signer, Verifier, PrivacyEncryptor, PrivacyDecryptor, AeadCipher, HttpClient } from 'wechatpay-nodev3';

class MyConfig implements Config {
  // ... 实现 Config 接口的所有方法
  
  createHttpClient(): HttpClient {
    // 返回自定义 HTTP 客户端
    return new MyHttpClient();
  }
}
```

## 版本历史

| 版本号 | 版本介绍 |
|--------|----------|
| v3.0.0 | 全面重构，对标 Java SDK，新增 22+ 服务模块 |
| v2.2.1 | 上传图片功能 |
| v2.1.8 | 修复回调签名 key 错误 |
| v2.1.0 | 升级 superagent 依赖到 8.0.6 |
| v2.0.0 | 增加提现到零钱和优化接口参数 |
| v1.3.0 | 增加普通订单的退款和查询 |
| v1.2.0 | 增加回调解密，合单支付 |
| v1.0.0 | 增加支付、查询订单、关闭订单、账单功能 |

## 文档

- [微信支付 v3 开发文档](https://pay.weixin.qq.com/wiki/doc/apiv3/index.shtml)
- [商家转账用户确认模式](https://pay.weixin.qq.com/doc/v3/merchant/4012711988)
- [GitHub Issues](https://github.com/dianbu/wechatpay-nodev3/issues)


## 许可证

[MIT](https://opensource.org/licenses/MIT)
