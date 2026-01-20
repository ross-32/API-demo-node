/**
 * Aster Builder Code Utility Functions & Configuration / Aster Builder Code 工具函数与配置
 * 
 * Contains EIP-712 signing logic, nonce generation, request building, and configuration
 * 包含 EIP-712 签名逻辑、nonce 生成、请求构建和配置管理
 */

const { ethers } = require('ethers');
require('dotenv').config();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration / 配置
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const config = {
    HOST: process.env.HOST || 'http://10.100.7.198:9081',
    USER_ADDRESS: process.env.USER_ADDRESS || '0x9FdC25AE9dE3791ECb122959ff196d600d5aDDA4',
    MAIN_PRIVATE_KEY: process.env.MAIN_PRIVATE_KEY || '',
    SIGNER_ADDRESS: process.env.SIGNER_ADDRESS || '0x34b208e2674f120343B541e4C75C9035EbF8f5c4',
    SIGNER_PRIVATE_KEY: process.env.SIGNER_PRIVATE_KEY || '',
    BUILDER_ADDRESS: process.env.BUILDER_ADDRESS || '0xc2af13e1B1de3A015252A115309A0F9DEEDCFa0A',
    BUILDER_NAME: process.env.BUILDER_NAME || 'ivan',
    MAX_FEE_RATE: process.env.MAX_FEE_RATE || '0.00001',
    FEE_RATE: process.env.FEE_RATE || '0.00001',
    AGENT_NAME: process.env.AGENT_NAME || '2dkkd0001',
    IP_WHITELIST: process.env.IP_WHITELIST,
    AGENT_EXPIRED: parseInt(process.env.AGENT_EXPIRED || '1867945395040'),
    CHAIN_ID: parseInt(process.env.CHAIN_ID || '56'),
    ASTER_CHAIN: process.env.ASTER_CHAIN || 'Testnet',
    
    // EIP-712 Domain for main=True / 用于 main=True 的 EIP-712 域
    EIP712_DOMAIN: {
        name: 'AsterSignTransaction',
        version: '1',
        chainId: 56,
        verifyingContract: '0x0000000000000000000000000000000000000000'
    },
    
    // EIP-712 Domain for main=False / 用于 main=False 的 EIP-712 域
    EIP712_DOMAIN_MESSAGE: {
        name: 'AsterSignTransaction',
        version: '1',
        chainId: 714,
        verifyingContract: '0x0000000000000000000000000000000000000000'
    }
};

// Nonce state / Nonce 状态
let _lastMs = 0;
let _counter = 0;

/**
 * Generate nonce (replicate Python's get_nonce) / 生成 nonce（复刻 Python 的 get_nonce）
 * Format: timestamp_seconds * 1,000,000 + counter
 * 格式：时间戳秒数 * 1,000,000 + 计数器
 */
function getNonce() {
    const nowMs = Math.floor(Date.now() / 1000); // Get seconds / 获取秒数
    
    if (nowMs === _lastMs) {
        _counter += 1;
    } else {
        _lastMs = nowMs;
        _counter = 0;
    }
    
    return nowMs * 1000000 + _counter;
}

/**
 * Build query string from parameters / 从参数构建查询字符串
 */
function buildQueryString(params) {
    return Object.keys(params)
        .filter(key => params[key] !== undefined && params[key] !== null)
        .map(key => `${key}=${String(params[key])}`)
        .join('&');
}

/**
 * Capitalize first letter of each key / 将每个 key 的首字母大写
 * Example: agentName -> AgentName
 */
function capitalizeKeys(obj) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        result[capitalizedKey] = value;
    }
    return result;
}

/**
 * Sign with EIP-712 for main=True operations (dynamic primaryType) / 
 * 为 main=True 操作进行 EIP-712 签名（动态 primaryType）
 * 
 * @param {string} privateKey - Main wallet private key / 主钱包私钥
 * @param {Object} params - Parameters to sign / 要签名的参数
 * @param {string} primaryType - Primary type name (e.g., 'ApproveAgent') / 主类型名称
 * @returns {string} Signature / 签名
 */
async function signEIP712Main(privateKey, params, primaryType) {
    // Capitalize all keys / 将所有 key 首字母大写
    const capitalizedParams = capitalizeKeys(params);
    
    // Build types dynamically (match Python's infer_eip712_type logic) / 动态构建类型（匹配 Python 的类型推断逻辑）
    const messageType = [];
    for (const [key, value] of Object.entries(capitalizedParams)) {
        let type = 'string'; // Default to string / 默认为 string
        
        if (typeof value === 'boolean') {
            type = 'bool';
        } else if (typeof value === 'number' && Number.isInteger(value)) {
            // Only integers are uint256, floats default to string / 只有整数才是 uint256，浮点数默认为 string
            type = 'uint256';
        }
        // Everything else (including strings, floats) is 'string' / 其他所有类型（包括字符串、浮点数）都是 'string'
        
        messageType.push({ name: key, type });
    }
    
    // Build EIP-712 typed data / 构建 EIP-712 类型化数据
    const typedData = {
        types: {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' }
            ],
            [primaryType]: messageType
        },
        primaryType: primaryType,
        domain: config.EIP712_DOMAIN,
        message: capitalizedParams
    };
    
    console.log('EIP-712 Typed Data / EIP-712 类型化数据:');
    console.log(JSON.stringify(typedData, null, 2));
    console.log('');
    
    // Sign / 签名
    const wallet = new ethers.Wallet(privateKey);
    const signature = await wallet.signTypedData(
        typedData.domain,
        { [primaryType]: typedData.types[primaryType] },
        typedData.message
    );
    
    return signature;
}

/**
 * Sign with EIP-712 for main=False operations (Message.msg) / 
 * 为 main=False 操作进行 EIP-712 签名（Message.msg）
 * 
 * @param {string} privateKey - Signer private key / Signer 私钥
 * @param {string} message - Message string (querystring) / 消息字符串（查询字符串）
 * @returns {string} Signature / 签名
 */
async function signEIP712Message(privateKey, message) {
    const typedData = {
        types: {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' }
            ],
            Message: [
                { name: 'msg', type: 'string' }
            ]
        },
        primaryType: 'Message',
        domain: config.EIP712_DOMAIN_MESSAGE,
        message: {
            msg: message
        }
    };
    
    console.log('Signing Message / 签名消息:', message);
    console.log('EIP-712 Domain / EIP-712 域:', JSON.stringify(typedData.domain));
    console.log('');
    
    const wallet = new ethers.Wallet(privateKey);
    const signature = await wallet.signTypedData(
        typedData.domain,
        { Message: typedData.types.Message },
        typedData.message
    );
    
    return signature;
}

module.exports = {
    config,
    getNonce,
    buildQueryString,
    capitalizeKeys,
    signEIP712Main,
    signEIP712Message
};
