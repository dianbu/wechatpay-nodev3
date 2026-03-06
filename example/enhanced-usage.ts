/**
 * 完整使用示例 - 展示如何使用增强后的 Node.js SDK
 */

import Pay from './index';
import fs from 'fs';
import {
  // 导入新增的功能
  autoCertificateManager,
  NotificationParser,
  TransactionNotification,
  EnhancedHttpClient,
  BrandProfitSharingService,
  EcommerceProfitSharingService,
  EcommerceRefundService,
  BillDownloadServiceExtension,
  // 异常类
  HttpException,
  ValidationException,
  ServiceException,
} from './lib/services';

// ==================== 1. 初始化配置 ====================

// 读取证书和密钥
const appid = 'your_appid';
const mchid = 'your_mchid';
const serialNo = 'your_serial_no';
const apiV3Key = 'your_api_v3_key';
const publicKey = fs.readFileSync('./apiclient_cert.pem');
const privateKey = fs.readFileSync('./apiclient_key.pem');

// 创建支付实例
const pay = new Pay({
  appid,
  mchid,
  publicKey,
  privateKey,
  key: apiV3Key,
  serial_no: serialNo,
});

// ==================== 2. 初始化自动证书管理器 ====================

async function initializeCertificate() {
  try {
    await autoCertificateManager.initialize({
      mchid: mchid,
      serialNo: serialNo,
      privateKey: privateKey,
      apiSecret: apiV3Key,
      httpService: pay.getHttpService(),
    });
    
    console.log('证书管理器初始化成功');
    console.log('证书数量:', autoCertificateManager.getCertificateCount());
    console.log('证书序列号:', autoCertificateManager.getSerialNumbers());
  } catch (error) {
    console.error('证书管理器初始化失败', error);
    throw error;
  }
}

// ==================== 3. 使用增强的 HTTP 客户端 ====================

function createEnhancedPay() {
  // 创建带配置的 HTTP 客户端
  const httpClient = new EnhancedHttpClient({
    connectTimeoutMs: 10000,      // 连接超时 10 秒
    readTimeoutMs: 10000,         // 读取超时 10 秒
    writeTimeoutMs: 10000,        // 写入超时 10 秒
    enableMultiDomainRetry: true, // 启用双域名容灾
    maxRetries: 2,                // 最大重试 2 次
    userAgent: 'my-app/1.0.0',    // 自定义 User-Agent
  });
  
  // 可以使用这个 httpClient 创建新的支付实例
  return pay;
}

// ==================== 4. Native 支付示例 ====================

async function nativePayExample() {
  try {
    const params = {
      appid,
      mchid,
      description: '测试商品',
      out_trade_no: 'order_' + Date.now(),
      notify_url: 'https://your-domain.com/notify',
      amount: {
        total: 1, // 单位：分
        currency: 'CNY',
      },
    };

    const result = await pay.transactions_native(params);
    
    if (result.status === 200 && result.data) {
      console.log('Native 支付下单成功');
      console.log('二维码链接:', result.data.code_url);
      return result.data;
    }
  } catch (error) {
    if (error instanceof ServiceException) {
      console.error('服务异常:', error.statusCode, error.errorCode, error.errorMessage);
    } else if (error instanceof HttpException) {
      console.error('HTTP 异常:', error.message);
    } else {
      console.error('未知错误:', error);
    }
    throw error;
  }
}

// ==================== 5. 处理支付回调通知 ====================

async function handlePaymentNotify(req: any, res: any) {
  // 创建通知解析器
  const parser = new NotificationParser({
    apiSecret: apiV3Key,
    certificateManager: autoCertificateManager,
  });

  // 构建通知请求（注意：body 必须是原始报文）
  const notification = {
    body: req.body, // 重要：必须是原始 body，不能是 JSON.parse 后的对象
    signature: req.headers['wechatpay-signature'],
    serialNo: req.headers['wechatpay-serial'],
    nonce: req.headers['wechatpay-nonce'],
    timestamp: req.headers['wechatpay-timestamp'],
  };

  try {
    // 解析通知并转换为业务对象
    const transaction = await parser.parse<TransactionNotification>(
      notification,
      TransactionNotification
    );

    console.log('支付成功通知');
    console.log('商户订单号:', transaction.out_trade_no);
    console.log('微信支付订单号:', transaction.transaction_id);
    console.log('支付金额:', transaction.amount.payer_total);
    console.log('支付状态:', transaction.trade_state);

    // 处理业务逻辑...
    // await updateOrderStatus(transaction.out_trade_no, 'PAID');

    // 返回成功响应
    res.status(200).send({ code: 'SUCCESS', message: '成功' });
  } catch (error) {
    console.error('处理通知失败', error);
    
    if (error instanceof ValidationException) {
      console.error('验签失败:', error.reason);
    }
    
    res.status(400).send({ code: 'FAIL', message: '失败' });
  }
}

// ==================== 6. 品牌分账示例 ====================

async function brandProfitSharingExample() {
  const brandService = new BrandProfitSharingService(
    pay.getHttpService(),
    appid,
    mchid
  );

  try {
    // 添加分账接收方
    const addReceiverResult = await brandService.addReceiver({
      sub_mchid: 'sub_merchant_001',
      type: 'MERCHANT_ID',
      account: 'receiver_account',
      relation_type: 'STORE',
      custom_relation: '加盟店',
    });

    console.log('添加分账接收方成功', addReceiverResult);

    // 创建分账订单
    const createOrderResult = await brandService.createOrder({
      sub_mchid: 'sub_merchant_001',
      out_order_no: 'profit_order_' + Date.now(),
      transaction_id: 'wechat_transaction_id',
      receivers: [
        {
          type: 'MERCHANT_ID',
          account: 'receiver_account',
          amount: 100, // 分账金额，单位：分
          description: '品牌分账',
        },
      ],
      unfreeze_unsplit: false,
    });

    console.log('创建分账订单成功', createOrderResult);

    // 查询分账订单
    const queryResult = await brandService.queryOrder({
      sub_mchid: 'sub_merchant_001',
      out_order_no: 'profit_order_' + Date.now(),
    });

    console.log('查询分账订单成功', queryResult);
  } catch (error) {
    console.error('品牌分账失败', error);
    throw error;
  }
}

// ==================== 7. 电商分账示例 ====================

async function ecommerceProfitSharingExample() {
  const ecommerceService = new EcommerceProfitSharingService(
    pay.getHttpService(),
    appid,
    mchid
  );

  try {
    // 创建分账订单
    const result = await ecommerceService.createOrder({
      sub_mchid: 'sub_merchant_001',
      out_order_no: 'ecommerce_profit_' + Date.now(),
      transaction_id: 'wechat_transaction_id',
      receivers: [
        {
          type: 'MERCHANT_ID',
          account: 'platform_account',
          amount: 50, // 平台分账金额
          description: '平台服务费',
        },
        {
          type: 'MERCHANT_ID',
          account: 'merchant_account',
          amount: 950, // 商户分账金额
          description: '商品款项',
        },
      ],
      unfreeze_unsplit: false,
    });

    console.log('电商分账成功', result);
  } catch (error) {
    console.error('电商分账失败', error);
    throw error;
  }
}

// ==================== 8. 电商退款示例 ====================

async function ecommerceRefundExample() {
  const refundService = new EcommerceRefundService(
    pay.getHttpService(),
    appid,
    mchid
  );

  try {
    // 申请退款
    const result = await refundService.createRefund({
      sub_mchid: 'sub_merchant_001',
      out_refund_no: 'refund_' + Date.now(),
      transaction_id: 'wechat_transaction_id',
      reason: '用户申请退款',
      amount: {
        total: 100,
        refund: 100,
        currency: 'CNY',
      },
    });

    console.log('电商退款申请成功', result);

    // 查询退款
    const queryResult = await refundService.queryRefundByOutRefundNo(
      'refund_' + Date.now(),
      'sub_merchant_001'
    );

    console.log('查询退款成功', queryResult);
  } catch (error) {
    console.error('电商退款失败', error);
    throw error;
  }
}

// ==================== 9. 账单下载示例 ====================

async function downloadBillExample() {
  const billService = new BillDownloadServiceExtension(pay.getHttpService());

  try {
    // 首先申请账单（使用 pay 的 tradebill 方法）
    const billResult = await pay.tradebill({
      bill_date: '2024-01-01',
      bill_type: 'ALL',
    });

    if (billResult.status === 200 && billResult.data) {
      const downloadUrl = billResult.data.download_url;
      const hashValue = billResult.data.hash_value;
      const hashType = billResult.data.hash_type as 'SHA1' | 'MD5';

      console.log('账单申请成功');
      console.log('下载地址:', downloadUrl);
      console.log('哈希值:', hashValue);

      // 下载并校验账单
      const { content, isValid, actualHash } = 
        await billService.downloadAndVerifyBill(downloadUrl, hashValue, hashType);

      if (isValid) {
        console.log('账单校验成功');
        console.log('实际哈希:', actualHash);

        // 解析 CSV 账单
        const records = billService.parseCsvBill(content);
        console.log('账单记录数:', records.length);
        console.log('前 3 条记录:', records.slice(0, 3));
      } else {
        console.error('账单校验失败');
        console.error('期望哈希:', hashValue);
        console.error('实际哈希:', actualHash);
      }
    }
  } catch (error) {
    console.error('账单下载失败', error);
    throw error;
  }
}

// ==================== 10. 敏感信息加密示例 ====================

function encryptSensitiveData() {
  // 读取微信支付公钥
  const wxPublicKey = fs.readFileSync('./wechatpay_public_key.pem');

  // 加密敏感信息（使用 SHA-256，符合官方标准）
  const sensitiveData = '13800138000'; // 手机号
  const encrypted = pay.publicEncrypt(sensitiveData, wxPublicKey);

  console.log('加密成功');
  console.log('加密后:', encrypted);

  // 在请求中使用加密数据
  // params.user_name = encrypted;
}

// ==================== 主函数 ====================

async function main() {
  try {
    console.log('=== Node.js SDK 增强功能示例 ===\n');

    // 1. 初始化证书管理器
    console.log('1. 初始化证书管理器...');
    await initializeCertificate();
    console.log('✓ 证书管理器初始化成功\n');

    // 2. 创建增强 HTTP 客户端
    console.log('2. 创建增强 HTTP 客户端...');
    createEnhancedPay();
    console.log('✓ HTTP 客户端创建成功\n');

    // 3. Native 支付示例
    console.log('3. Native 支付示例...');
    await nativePayExample();
    console.log('✓ Native 支付成功\n');

    // 4. 品牌分账示例
    console.log('4. 品牌分账示例...');
    await brandProfitSharingExample();
    console.log('✓ 品牌分账成功\n');

    // 5. 电商分账示例
    console.log('5. 电商分账示例...');
    await ecommerceProfitSharingExample();
    console.log('✓ 电商分账成功\n');

    // 6. 电商退款示例
    console.log('6. 电商退款示例...');
    await ecommerceRefundExample();
    console.log('✓ 电商退款成功\n');

    // 7. 账单下载示例
    console.log('7. 账单下载示例...');
    await downloadBillExample();
    console.log('✓ 账单下载成功\n');

    // 8. 敏感信息加密示例
    console.log('8. 敏感信息加密示例...');
    encryptSensitiveData();
    console.log('✓ 加密成功\n');

    console.log('=== 所有示例执行完成 ===');
  } catch (error) {
    console.error('执行失败:', error);
    process.exit(1);
  }
}

// 运行示例
// main();

export {
  initializeCertificate,
  nativePayExample,
  handlePaymentNotify,
  brandProfitSharingExample,
  ecommerceProfitSharingExample,
  ecommerceRefundExample,
  downloadBillExample,
};
