/**
 * Approve Agent / 授权 Agent
 * POST /fapi/v3/approveAgent
 * 
 * Main=True (Authorization with main wallet) / 主钱包授权
 * PrimaryType: ApproveAgent
 */

const axios = require('axios');
const { config, getNonce, buildQueryString, signEIP712Main } = require('./utils');

async function approveAgent() {
    try {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📝 Approve Agent / 授权 Agent');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // Build parameters (must match Python demo.py order) / 构建参数（必须与 Python demo.py 顺序一致）
        const params = {
            agentName: config.AGENT_NAME,
            agentAddress: config.SIGNER_ADDRESS,
            ipWhitelist: config.IP_WHITELIST,
            expired: config.AGENT_EXPIRED,
            canSpotTrade: true,
            canPerpTrade: false,
            canWithdraw: false,
            builder: config.BUILDER_ADDRESS,
            maxFeeRate: config.MAX_FEE_RATE,
            builderName: config.BUILDER_NAME
        };
        
        // Add dynamic parameters (added by send_by_url in Python) / 添加动态参数
        params.asterChain = config.ASTER_CHAIN;
        params.user = config.USER_ADDRESS;
        params.nonce = getNonce();
        
        console.log('Request Parameters / 请求参数:');
        console.log(JSON.stringify(params, null, 2));
        console.log('');
        
        // Sign with EIP-712 (main=True, primaryType=ApproveAgent) / 
        // 使用 EIP-712 签名（main=True，primaryType=ApproveAgent）
        const signature = await signEIP712Main(
            config.MAIN_PRIVATE_KEY,
            params,
            'ApproveAgent'
        );
        
        console.log('Signature / 签名:', signature);
        console.log('');
        
        // Add signature to params / 将签名添加到参数
        params.signature = signature;
        params.signatureChainId = config.CHAIN_ID;
        
        // Build URL / 构建 URL
        const queryString = buildQueryString(params);
        const url = `${config.HOST}/fapi/v3/approveAgent?${queryString}`;
        
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
        } else {
            console.error(error.message);
        }
        throw error;
    }
}

// Execute / 执行
if (require.main === module) {
    approveAgent()
        .then(() => console.log('✓ Approve Agent completed / 授权 Agent 完成'))
        .catch(() => console.log('✗ Approve Agent failed / 授权 Agent 失败'));
}

module.exports = approveAgent;
