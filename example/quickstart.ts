/**
 * Node.js SDK 重构版本 - 快速开始示例
 * 
 * 展示如何使用重构后的 SDK 结构
 */

import { createWechatPay, WechatPayOptions } from './src/WechatPay';
import { NativePayService } from './src/services/payments/NativePayService';
import fs from 'fs';

// ==================== 1. 基础配置 ====================

const config: WechatPayOptions = {
  appId: 'wx1234567890abcdef',
  mchId: '1900000001',
  privateKey: fs.readFileSync('./apiclient_key.pem'),
  serialNo: 'your_serial_no',
  apiV3Key: 'your_api_v3_key',
  httpConfig: {
    timeout: 10000,      // 10 秒超时
    retries: 2,          // 失败重试 2 次
    userAgent: 'my-app/1.0.0',
    enableMultiDomain: true, // 启用双域名容灾
  },
};

// ==================== 2. 创建支付实例 ====================

const wechatPay = createWechatPay(config);

// ==================== 3. 使用服务类 ====================

async function exampleNativePay() {
  // 创建 Native 支付服务
  const nativePayService = new NativePayService(
    wechatPay.getConfig(),
    wechatPay.getHttpClient()
  );

  try {
    // Native 支付下单
    const result = await nativePayService.prepay({
      description: '测试商品',
      out_trade_no: 'order_' + Date.now(),
      notify_url: 'https://your-domain.com/notify',
      amount: {
        total: 1, // 单位：分
        currency: 'CNY',
      },
    });

    console.log('Native 支付下单成功');
    console.log('二维码链接:', result.code_url);

    return result;
  } catch (error) {
    console.error('Native 支付下单失败', error);
    throw error;
  }
}

async function exampleQueryOrder() {
  const nativePayService = new NativePayService(
    wechatPay.getConfig(),
    wechatPay.getHttpClient()
  );

  try {
    // 查询订单
    const transaction = await nativePayService.queryByOutTradeNo({
      outTradeNo: 'order_123456',
    });

    console.log('订单状态:', transaction.trade_state);
    console.log('订单金额:', transaction.amount.total);

    return transaction;
  } catch (error) {
    console.error('查询订单失败', error);
    throw error;
  }
}

async function exampleCloseOrder() {
  const nativePayService = new NativePayService(
    wechatPay.getConfig(),
    wechatPay.getHttpClient()
  );

  try {
    // 关闭订单
    await nativePayService.close({
      outTradeNo: 'order_123456',
    });

    console.log('订单关闭成功');
  } catch (error) {
    console.error('关闭订单失败', error);
    throw error;
  }
}

// ==================== 4. 错误处理示例 ====================

async function exampleErrorHandling() {
  const nativePayService = new NativePayService(
    wechatPay.getConfig(),
    wechatPay.getHttpClient()
  );

  try {
    await nativePayService.prepay({
      description: '测试商品',
      out_trade_no: 'order_' + Date.now(),
      notify_url: 'https://your-domain.com/notify',
      amount: {
        total: 1,
        currency: 'CNY',
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('错误类型:', error.name);
      console.error('错误信息:', error.message);
      console.error('错误堆栈:', error.stack);
    }
    throw error;
  }
}

// ==================== 5. 并发请求示例 ====================

async function exampleConcurrentRequests() {
  const nativePayService = new NativePayService(
    wechatPay.getConfig(),
    wechatPay.getHttpClient()
  );

  try {
    // 并发查询多个订单
    const orders = ['order_001', 'order_002', 'order_003'];
    const results = await Promise.all(
      orders.map(outTradeNo => 
        nativePayService.queryByOutTradeNo({ outTradeNo })
      )
    );

    console.log('批量查询成功，结果数:', results.length);
    return results;
  } catch (error) {
    console.error('批量查询失败', error);
    throw error;
  }
}

// ==================== 6. 回调通知处理示例 ====================

// 注意：实际使用时需要结合 Express/Koa 等 Web 框架
async function exampleNotificationHandling(req: any, res: any) {
  // 这里会使用 NotificationParser 来处理
  // 示例代码省略，参考 NotificationParser 文档
  console.log('收到回调通知');
  console.log('请求体:', req.body);
  console.log('请求头:', req.headers);
  
  res.status(200).send({ code: 'SUCCESS', message: '成功' });
}

// ==================== 运行示例 ====================

async function main() {
  try {
    console.log('=== Node.js SDK 重构版本示例 ===\n');

    console.log('1. Native 支付下单示例...');
    await exampleNativePay();
    console.log('✓ 成功\n');

    console.log('2. 查询订单示例...');
    await exampleQueryOrder();
    console.log('✓ 成功\n');

    console.log('3. 关闭订单示例...');
    await exampleCloseOrder();
    console.log('✓ 成功\n');

    console.log('4. 错误处理示例...');
    await exampleErrorHandling();
    console.log('✓ 成功\n');

    console.log('5. 并发请求示例...');
    await exampleConcurrentRequests();
    console.log('✓ 成功\n');

    console.log('=== 所有示例执行完成 ===');
  } catch (error) {
    console.error('示例执行失败:', error);
    process.exit(1);
  }
}

// 导出示例函数供外部调用
export {
  exampleNativePay,
  exampleQueryOrder,
  exampleCloseOrder,
  exampleErrorHandling,
  exampleConcurrentRequests,
  exampleNotificationHandling,
};

// 如果直接运行此文件，则执行 main 函数
if (require.main === module) {
  main();
}
