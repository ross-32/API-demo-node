/**
 * Get Agents / 查询 Agents
 * GET /fapi/v3/agent
 * 
 * Main=False (Trading with signer) / 使用 Signer 交易
 * Signature: Message.msg (querystring)
 */

const axios = require('axios');
const { config, getNonce, buildQueryString, signEIP712Message } = require('./utils');

async function getAgents() {
    try {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 Get Agents / 查询 Agents');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // Build parameters (must match Python demo.py order) / 构建参数（必须与 Python demo.py 顺序一致）
        // Python: params = {} (empty, no business params)
        const params = {};
        
        // Add dynamic parameters (added by send_by_url in Python) / 添加动态参数
        params.asterChain = config.ASTER_CHAIN;
        params.user = config.USER_ADDRESS;
        params.signer = config.SIGNER_ADDRESS;  // Added for main=False
        params.nonce = getNonce();
        
        console.log('Request Parameters / 请求参数:');
        console.log(JSON.stringify(params, null, 2));
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
        const url = `${config.HOST}/fapi/v3/agent?${queryString}&signature=${signature}`;
        
        console.log('Request URL / 请求 URL:');
        console.log(url);
        console.log('');
        
        // Send request / 发送请求
        const response = await axios.get(url, {
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
        } else {
            console.error(error.message);
        }
        throw error;
    }
}

// Execute / 执行
if (require.main === module) {
    getAgents()
        .then(() => console.log('✓ Get Agents completed / 查询 Agents 完成'))
        .catch(() => console.log('✗ Get Agents failed / 查询 Agents 失败'));
}

module.exports = getAgents;
