/**
 * Place Order with Builder / 下单（带 Builder）
 * POST /fapi/v3/order
 * 
 * Main=False (Trading with signer) / 使用 Signer 交易
 * Signature: Message.msg (querystring)
 * 
 * ⚠️ IMPORTANT: This order includes builder and feeRate parameters
 * ⚠️ 重要：此订单包含 builder 和 feeRate 参数
 */

const axios = require('axios');
const config = require('./config');
const { getNonce, buildQueryString, signEIP712Message } = require('./utils');

async function placeOrder() {
    try {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📈 Place Order (Builder Mode) / 下单（Builder 模式）');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // Build parameters (must match Python demo.py order) / 构建参数（必须与 Python demo.py 顺序一致）
        const params = {
            symbol: 'BTCUSDT',
            type: 'MARKET',
            builder: config.BUILDER_ADDRESS,
            feeRate: 0.00001,  // Match Python exactly (number, not string in Python)
            side: 'BUY',
            quantity: '0.03'
        };
        
        // Add dynamic parameters (added by send_by_url in Python) / 添加动态参数
        params.asterChain = config.ASTER_CHAIN;
        params.user = config.USER_ADDRESS;
        params.signer = config.SIGNER_ADDRESS;  // Added for main=False
        params.nonce = getNonce();
        
        console.log('Request Parameters / 请求参数:');
        console.log(JSON.stringify(params, null, 2));
        console.log('');
        
        console.log('⚠️  Note / 注意:');
        console.log('- feeRate must be <= maxFeeRate approved for this builder');
        console.log('- feeRate 必须 <= 为此 builder 授权的 maxFeeRate');
        console.log('- Both builder and feeRate are required for Builder Code mode');
        console.log('- Builder Code 模式需要同时提供 builder 和 feeRate');
        console.log('');
        
        // Build querystring (without signature) / 构建查询字符串（不含签名）
        const queryString = buildQueryString(params);
        
        // Sign the querystring with Message.msg / 对查询字符串进行 Message.msg 签名
        const signature = await signEIP712Message(
            config.SIGNER_PRIVATE_KEY,
            queryString
        );
        
        console.log('Signature / 签名:', signature);
        console.log('');
        
        // Build final URL / 构建最终 URL
        const url = `${config.HOST}/fapi/v3/order?${queryString}&signature=${signature}`;
        
        console.log('Request URL / 请求 URL:');
        console.log(url);
        console.log('');
        
        // Send request / 发送请求
        const response = await axios.post(url, {}, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'NodeApp/1.0'
            }
        });
        
        console.log('Response Status / 响应状态:', response.status);
        console.log('Response Data / 响应数据:');
        console.log(JSON.stringify(response.data, null, 2));
        console.log('');
        
    } catch (error) {
        console.error('❌ Error / 错误:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            console.error('');
            console.error('Common errors / 常见错误:');
            console.error('- "Builder not approved": Need to approve builder first (run 05_approveBuilder.js)');
            console.error('- "Builder 未授权": 需要先授权 builder（运行 05_approveBuilder.js）');
            console.error('- "Agent expired": Need to approve/update agent (run 01_approveAgent.js)');
            console.error('- "Agent 过期": 需要授权/更新 agent（运行 01_approveAgent.js）');
            console.error('- "Fee rate exceeds max": feeRate > maxFeeRate approved');
            console.error('- "费率超过上限": feeRate > 已授权的 maxFeeRate');
        } else {
            console.error(error.message);
        }
        throw error;
    }
}

// Execute / 执行
if (require.main === module) {
    placeOrder()
        .then(() => console.log('✓ Place Order completed / 下单完成'))
        .catch(() => console.log('✗ Place Order failed / 下单失败'));
}

module.exports = placeOrder;
