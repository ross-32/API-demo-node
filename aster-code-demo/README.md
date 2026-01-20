# Aster Builder Code Demo / Aster Builder Code 演示

## 📘 项目简介 / Project Introduction

本项目演示如何使用 **Aster Builder Code 模式**对接 Pro-API（EIP-712 Signer/Agent 认证）。

This project demonstrates how to integrate with **Aster Builder Code Mode** Pro-API using EIP-712 Signer/Agent authentication.

**核心特性 / Core Features**:
- ✅ 完整复刻 Python `demo.py` 的所有逻辑
- ✅ 支持两种 EIP-712 签名方式（管理类 & 交易类）
- ✅ 中英文双语注释和文档
- ✅ 独立可运行的接口示例
- ✅ 严格的参数透传（feeRate/maxFeeRate 为字符串）

---

## 🔐 两种签名方式 / Two Signature Methods

### 1️⃣ main=True（管理类接口 / Authorization Operations）

**用途 / Usage**: 授权/更新/删除 Agent 或 Builder

**签名方式 / Signature Method**:
- 对参数的 key 进行**首字母大写**（agentName → AgentName）
- 使用**动态 primaryType**（ApproveAgent, UpdateAgent, DelAgent, ApproveBuilder, UpdateBuilder, DelBuilder）
- EIP-712 Domain: `chainId: 56` (生产环境) / Production

**示例接口 / Example APIs**:
- `01_approveAgent.js` - 授权 Agent
- `02_updateAgent.js` - 更新 Agent
- `03_deleteAgent.js` - 删除 Agent
- `05_approveBuilder.js` - 授权 Builder
- `06_updateBuilder.js` - 更新 Builder
- `07_deleteBuilder.js` - 删除 Builder

### 2️⃣ main=False（交易类接口 / Trading Operations）

**用途 / Usage**: 查询数据、下单等交易操作

**签名方式 / Signature Method**:
- 先构建完整的 **querystring**（包含所有参数，但不含 signature）
- 对 querystring 进行 **Message.msg** EIP-712 签名
- EIP-712 Domain: `chainId: 714` (测试网) / Testnet
- 最终 URL = `path?querystring&signature=xxx`

**示例接口 / Example APIs**:
- `04_getAgents.js` - 查询 Agents
- `08_getBuilders.js` - 查询 Builders
- `09_placeOrder.js` - 下单（带 builder + feeRate）

---

## 🚀 快速开始 / Quick Start

### 1. 安装依赖 / Install Dependencies

```bash
cd aster-code-demo
npm install
```

### 2. 配置环境变量 / Configure Environment Variables

复制 `env.example` 为 `.env` 并填入真实配置：

Copy `env.example` to `.env` and fill in real values:

```bash
cp env.example .env
```

**必填项 / Required Fields**:
```env
HOST=http://10.100.7.198:9081
USER_ADDRESS=0x...your_main_wallet...
MAIN_PRIVATE_KEY=0x...your_main_private_key...
SIGNER_ADDRESS=0x...your_signer_address...
SIGNER_PRIVATE_KEY=0x...your_signer_private_key...
BUILDER_ADDRESS=0x...your_builder_address...
```

### 3. 运行示例 / Run Examples

**完整流程 / Complete Workflow**:

```bash
# Step 1: 授权 Agent / Approve Agent
node 01_approveAgent.js

# Step 2: 授权 Builder / Approve Builder
node 05_approveBuilder.js

# Step 3: 下单（带 builder + feeRate）/ Place Order with Builder
node 09_placeOrder.js

# Optional: 查询 Agents / Get Agents
node 04_getAgents.js

# Optional: 查询 Builders / Get Builders
node 08_getBuilders.js
```

---

## 📖 Builder Code 模式流程 / Builder Code Mode Workflow

```
┌─────────────────────────────────────────────────────────┐
│  1. 用户授权 Agent (main=True)                           │
│     User approves Agent with main wallet                │
│     → 01_approveAgent.js                                │
│     → canSpotTrade/canPerpTrade/canWithdraw             │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│  2. 用户授权 Builder Cap (main=True)                     │
│     User approves Builder with maxFeeRate cap           │
│     → 05_approveBuilder.js                              │
│     → builder + maxFeeRate (e.g., 0.00001)              │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│  3. Signer 下单（带 builder + feeRate）(main=False)      │
│     Signer places order with builder + feeRate          │
│     → 09_placeOrder.js                                  │
│     → feeRate <= maxFeeRate                             │
│     → builder 获得手续费收益 / Builder earns fee revenue │
└─────────────────────────────────────────────────────────┘
```

---

## ⚙️ 核心实现细节 / Core Implementation Details

### Nonce 生成 / Nonce Generation

```javascript
// 复刻 Python 的 get_nonce() 逻辑
// Replicates Python's get_nonce() logic
function getNonce() {
    const nowMs = Math.floor(Date.now() / 1000);  // seconds / 秒数
    if (nowMs === _lastMs) {
        _counter += 1;
    } else {
        _lastMs = nowMs;
        _counter = 0;
    }
    return nowMs * 1000000 + _counter;
}
```

### main=True 签名 / main=True Signature

```javascript
// 1. Capitalize all keys / 首字母大写
const capitalizedParams = capitalizeKeys(params);

// 2. Build dynamic primaryType / 动态构建 primaryType
const typedData = {
    types: { [primaryType]: [...] },
    primaryType: primaryType,
    domain: { name, version, chainId: 56, ... },
    message: capitalizedParams
};

// 3. Sign / 签名
const signature = await wallet.signTypedData(domain, types, message);

// 4. Add signature to params and build URL / 添加签名到参数并构建 URL
params.signature = signature;
params.signatureChainId = 56;
const url = `${host}/path?${queryString}`;
```

### main=False 签名 / main=False Signature

```javascript
// 1. Build querystring (without signature) / 构建查询字符串（不含 signature）
const queryString = buildQueryString(params);

// 2. Sign querystring with Message.msg / 对查询字符串进行 Message.msg 签名
const typedData = {
    types: { Message: [{ name: 'msg', type: 'string' }] },
    primaryType: 'Message',
    domain: { name, version, chainId: 714, ... },
    message: { msg: queryString }
};
const signature = await wallet.signTypedData(domain, types, message);

// 3. Append signature to URL / 将签名附加到 URL
const url = `${host}/path?${queryString}&signature=${signature}`;
```

---

## ❌ 常见错误排查 / Common Error Troubleshooting

### 1. "Signature invalid" / "签名无效"

**原因 / Causes**:
- ❌ 签名的字符串与发送的字符串不一致
- ❌ URL 编码问题（`buildQueryString` 使用 `String(value)` 直接拼接）
- ❌ 参数顺序问题（`Object.keys()` 的顺序）
- ❌ chainId 不匹配（main=True 用 56，main=False 用 测试网-714，主网-1666）

**解决方案 / Solutions**:
```javascript
// ✅ 确保 sign what you send
// Sign exactly what you send

// main=False: 先构建 querystring，再签名，再附加 signature
const queryString = buildQueryString(params);
const signature = await signEIP712Message(privateKey, queryString);
const url = `${host}/path?${queryString}&signature=${signature}`;

// main=True: 签名后再拼接所有参数（包括 signature）
params.signature = signature;
const queryString = buildQueryString(params);
const url = `${host}/path?${queryString}`;
```

### 2. "Agent expired" / "Agent 过期"

**原因 / Causes**:
- Agent 未授权或已过期
- ipWhitelist 不匹配

**解决方案 / Solutions**:
```bash
# 重新授权 Agent / Re-approve Agent
node 01_approveAgent.js

# 或更新 Agent / Or update Agent
node 02_updateAgent.js
```

### 3. "Builder not approved" / "Builder 未授权"

**原因 / Causes**:
- Builder 未授权
- maxFeeRate 过低

**解决方案 / Solutions**:
```bash
# 授权 Builder / Approve Builder
node 05_approveBuilder.js
```

### 4. "Fee rate exceeds max" / "费率超过上限"

**原因 / Causes**:
- 下单时的 `feeRate` > 授权时的 `maxFeeRate`

**解决方案 / Solutions**:
```javascript
// Option 1: 降低下单时的 feeRate / Lower feeRate in order
params.feeRate = '0.00001';  // Must be <= maxFeeRate

// Option 2: 提高 maxFeeRate / Increase maxFeeRate
// Run 06_updateBuilder.js with higher maxFeeRate
```

### 5. 429 Too Many Requests / 请求过于频繁

**原因 / Causes**:
- 边缘/网关限流

**解决方案 / Solutions**:
- 实现请求队列和退避策略
- 降低请求频率
- 联系技术支持增加限流配额

---

## 🔒 安全建议 / Security Recommendations

### 1. 保护私钥 / Protect Private Keys

```bash
# ❌ 永远不要将 .env 提交到 Git
# Never commit .env to Git

# ✅ 使用 .gitignore 忽略 .env
# Use .gitignore to ignore .env
echo ".env" >> .gitignore
```

### 2. 配置 IP 白名单 / Configure IP Whitelist

```javascript
// 在授权 Agent 时配置 IP 白名单
// Configure IP whitelist when approving Agent
params.ipWhitelist = '1.2.3.4,5.6.7.8';
```

### 3. 限制 Agent 权限 / Limit Agent Permissions

```javascript
// 根据需要配置权限 / Configure permissions as needed
canSpotTrade: true,   // 现货交易 / Spot trading
canPerpTrade: false,  // 合约交易 / Perp trading
canWithdraw: false    // 提现 / Withdraw (建议 false / Recommended false)
```

### 4. 设置过期时间 / Set Expiry Time

```javascript
// 设置合理的过期时间 / Set reasonable expiry time
expired: Date.now() + (30 * 24 * 60 * 60 * 1000)  // 30 days / 30天
```

---

## 📚 接口列表 / API List

| 文件 / File | 接口 / API | 方法 / Method | 类型 / Type | 说明 / Description |
|------------|-----------|--------------|------------|-------------------|
| 01_approveAgent.js | /fapi/v3/approveAgent | POST | main=True | 授权 Agent / Approve Agent |
| 02_updateAgent.js | /fapi/v3/updateAgent | POST | main=True | 更新 Agent / Update Agent |
| 03_deleteAgent.js | /fapi/v3/agent | DELETE | main=True | 删除 Agent / Delete Agent |
| 04_getAgents.js | /fapi/v3/agent | GET | main=False | 查询 Agents / Get Agents |
| 05_approveBuilder.js | /fapi/v3/approveBuilder | POST | main=True | 授权 Builder / Approve Builder |
| 06_updateBuilder.js | /fapi/v3/updateBuilder | POST | main=True | 更新 Builder / Update Builder |
| 07_deleteBuilder.js | /fapi/v3/builder | DELETE | main=True | 删除 Builder / Delete Builder |
| 08_getBuilders.js | /fapi/v3/builder | GET | main=False | 查询 Builders / Get Builders |
| 09_placeOrder.js | /fapi/v3/order | POST | main=False | 下单 / Place Order |

---

## 🛠️ 技术栈 / Tech Stack

- **Node.js**: >= 18
- **axios**: HTTP 客户端 / HTTP client
- **ethers.js v6**: EIP-712 签名 / EIP-712 signing
- **dotenv**: 环境变量管理 / Environment variables management

---

## 📦 依赖安装 / Dependencies

```bash
npm install axios ethers dotenv
```

---

## 🎯 关键原则 / Key Principles

### 1. Sign What You Send / 签名与发送一致

**main=False 示例 / main=False Example**:
```javascript
// ✅ 正确 / Correct
const queryString = 'user_address=0x...&signer=0x...&nonce=123';
const signature = sign(queryString);
const url = `${host}/path?${queryString}&signature=${signature}`;

// ❌ 错误 / Wrong
const signature = sign(params);  // 签名的是对象 / Signing object
const url = axios.get(path, { params });  // 发送时 axios 重新序列化 / axios re-serializes
```

### 2. 费率必须为字符串 / Fee Rate Must Be String

```javascript
// ✅ 正确 / Correct
feeRate: '0.00001',
maxFeeRate: '0.00001'

// ❌ 错误 / Wrong
feeRate: 0.00001,      // Number 会有精度问题 / Number has precision issues
maxFeeRate: 0.00001
```

### 3. 首字母大写（仅 main=True）/ Capitalize Keys (main=True Only)

```javascript
// main=True: agentName → AgentName
const capitalizedParams = capitalizeKeys(params);

// main=False: 保持原样 / Keep as-is
const params = { user_address, signer, nonce };
```

---

## 🔗 相关链接 / Related Links

- [Aster 官网 / Official Website](https://www.asterdex.com)
- [EIP-712 标准 / Standard](https://eips.ethereum.org/EIPS/eip-712)
- [Ethers.js 文档 / Documentation](https://docs.ethers.org/)

---

## 📝 许可证 / License

MIT License

---

**祝您对接顺利！/ Happy Integrating! **
