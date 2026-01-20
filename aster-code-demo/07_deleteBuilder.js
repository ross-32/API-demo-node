/**
 * Delete Builder / 删除 Builder
 * DELETE /fapi/v3/builder
 * 
 * Main=True (Authorization with main wallet) / 主钱包授权
 * PrimaryType: DelBuilder
 */

const axios = require('axios');
const config = require('./config');
const { getNonce, buildQueryString, signEIP712Main } = require('./utils');

async function deleteBuilder() {
    try {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🗑️  Delete Builder / 删除 Builder');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // Build parameters (must match Python demo.py order) / 构建参数（必须与 Python demo.py 顺序一致）
        const params = {
            builder: config.BUILDER_ADDRESS
        };
        
        // Add dynamic parameters (added by send_by_url in Python) / 添加动态参数
        params.asterChain = config.ASTER_CHAIN;
        params.user = config.USER_ADDRESS;
        params.nonce = getNonce();
        
        console.log('Request Parameters / 请求参数:');
        console.log(JSON.stringify(params, null, 2));
        console.log('');
        
        // Sign with EIP-712 (main=True, primaryType=DelBuilder) /
        // 使用 EIP-712 签名（main=True，primaryType=DelBuilder）
        const signature = await signEIP712Main(
            config.MAIN_PRIVATE_KEY,
            params,
            'DelBuilder'
        );
        
        console.log('Signature / 签名:', signature);
        console.log('');
        
        // Add signature to params / 将签名添加到参数
        params.signature = signature;
        params.signatureChainId = config.CHAIN_ID;
        
        // Build URL / 构建 URL
        const queryString = buildQueryString(params);
        const url = `${config.HOST}/fapi/v3/builder?${queryString}`;
        
        console.log('Request URL / 请求 URL:');
        console.log(url);
        console.log('');
        
        // Send request / 发送请求
        const response = await axios.delete(url, {
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
    deleteBuilder()
        .then(() => console.log('✓ Delete Builder completed / 删除 Builder 完成'))
        .catch(() => console.log('✗ Delete Builder failed / 删除 Builder 失败'));
}

module.exports = deleteBuilder;
