# Futures API Demo / 期货 API 示例

## ⚠️ 重要提示 / Important Notice

**Futures API 使用 HMAC SHA256 签名认证，与 Futures V3 API 不同！**

**Futures API uses HMAC SHA256 signature authentication, different from Futures V3 API!**

---

## 🔐 认证方式 / Authentication Method

### HMAC SHA256 签名 / HMAC SHA256 Signature

Futures API 需要以下参数：
- `timestamp` - 毫秒时间戳
- `recvWindow` - 请求有效时间窗口（可选）
- `signature` - HMAC SHA256 签名

签名流程：
1. 将所有参数按字母顺序排序
2. 构建查询字符串（key=value&key=value...）
3. 使用 API Secret 进行 HMAC SHA256 签名
4. 将签名附加到请求参数中

Futures API requires the following parameters:
- `timestamp` - Millisecond timestamp
- `recvWindow` - Request validity time window (optional)
- `signature` - HMAC SHA256 signature

Signature process:
1. Sort all parameters alphabetically
2. Build query string (key=value&key=value...)
3. Sign with HMAC SHA256 using API Secret
4. Append signature to request parameters

---

## 📦 安装依赖 / Install Dependencies

```bash
cd futures-demo
npm install
```

依赖包括：
- `axios` - HTTP 客户端
- `crypto` - 签名加密（Node.js 内置）

Dependencies include:
- `axios` - HTTP client
- `crypto` - Signature encryption (Node.js built-in)

---

## ⚙️ 配置 / Configuration

### 1. 获取 API 密钥 / Get API Key

访问 AsterDEX 创建 API 密钥：
- 英文：https://www.asterdex.com/en/futures/account/api-management
- 中文：https://www.asterdex.com/zh/futures/account/api-management

您将获得：
- `API_KEY` - API 密钥
- `API_SECRET` - API 密钥

Visit AsterDEX to create API keys:
- English: https://www.asterdex.com/en/futures/account/api-management
- Chinese: https://www.asterdex.com/zh/futures/account/api-management

You will receive:
- `API_KEY` - API Key
- `API_SECRET` - API Secret

### 2. 创建 config.js

在 `futures-demo` 目录下创建 `config.js` 文件：

Create `config.js` file in `futures-demo` directory:

```javascript
module.exports = {
    // 基础URL / Base URL
    BASE_URL: 'https://fapi.asterdex.com',
    
    // API密钥（从API管理页面获取）
    // API Key (from API management page)
    API_KEY: 'your_api_key_here',
    
    // API密钥（从API管理页面获取）
    // API Secret (from API management page)
    API_SECRET: 'your_api_secret_here',
    
    // 默认交易对 / Default symbol
    DEFAULT_SYMBOL: 'BTCUSDT',
    
    // 请求有效时间窗口（毫秒）/ Request validity window (milliseconds)
    RECV_WINDOW: 5000
};
```

⚠️ **安全提示 / Security Notice**：
- 永远不要将真实的 API 密钥提交到 Git
- `config.js` 已在 `.gitignore` 中
- 使用测试账户进行测试
- 建议设置 IP 白名单

- Never commit real API keys to Git
- `config.js` is already in `.gitignore`
- Use test accounts for testing
- Recommend setting IP whitelist

---

## 🚀 使用示例 / Usage Examples

### 测试连接 / Test Connection

```bash
node 01_ping.js
```

### 下单 / Place Order

```bash
node 21_order.js
```

### 查询账户信息 / Get Account Info

```bash
node 33_account.js
```

### 查询持仓 / Get Position Risk

```bash
node 38_positionRisk.js
```

---

## 📝 示例文件列表 / Example Files

### 市场数据 / Market Data (NONE - 无需签名)

| 文件 / File | 功能 / Function | 说明 / Description |
|------------|----------------|-------------------|
| `01_ping.js` | 测试连接 / Test Connectivity | 测试与API的连通性 |
| `02_time.js` | 服务器时间 / Server Time | 获取服务器时间 |
| `03_exchangeInfo.js` | 交易规则 / Exchange Info | 获取交易规则和交易对信息 |
| `04_depth.js` | 深度信息 / Order Book | 获取市场深度数据 |
| `05_trades.js` | 最近成交 / Recent Trades | 获取最近成交记录 |
| `06_historicalTrades.js` | 历史成交 / Historical Trades | 获取历史成交记录 |
| `07_aggTrades.js` | 归集成交 / Aggregate Trades | 获取归集成交记录 |
| `08_klines.js` | K线数据 / Kline/Candlestick | 获取K线数据 |
| `09_indexPriceKlines.js` | 指数价格K线 / Index Price Klines | 获取指数价格K线 |
| `10_markPriceKlines.js` | 标记价格K线 / Mark Price Klines | 获取标记价格K线 |
| `11_premiumIndex.js` | 溢价指数 / Premium Index | 获取溢价指数和标记价格 |
| `12_fundingRate.js` | 资金费率 / Funding Rate | 获取资金费率历史 |
| `13_fundingRateConfig.js` | 资金费率配置 / Funding Rate Config | 获取资金费率配置 |
| `14_ticker24hr.js` | 24小时价格 / 24hr Ticker | 获取24小时价格变动统计 |
| `15_tickerPrice.js` | 最新价格 / Latest Price | 获取最新价格 |
| `16_bookTicker.js` | 最优挂单 / Best Order Book | 获取最优买卖挂单 |

### 账户和交易 / Account & Trading (TRADE/USER_DATA - 需要签名)

#### 持仓和保证金模式 / Position & Margin Mode

| 文件 / File | 功能 / Function | 说明 / Description |
|------------|----------------|-------------------|
| `17_positionSideDual.js` | 设置持仓模式 / Change Position Mode | 设置单向/双向持仓模式 |
| `18_getPositionSideDual.js` | 查询持仓模式 / Get Position Mode | 查询当前持仓模式 |
| `19_multiAssetsMargin.js` | 设置联合保证金 / Change Multi-Assets | 设置联合保证金模式 |
| `20_getMultiAssetsMargin.js` | 查询联合保证金 / Get Multi-Assets | 查询联合保证金模式 |

#### 订单操作 / Order Operations

| 文件 / File | 功能 / Function | 说明 / Description |
|------------|----------------|-------------------|
| `21_order.js` | 下单 / New Order | 创建新订单 |
| `22_batchOrders.js` | 批量下单 / Batch Orders | 批量创建订单 |
| `23_transfer.js` | 资金划转 / Transfer | 现货与合约账户划转 |
| `24_queryOrder.js` | 查询订单 / Query Order | 查询指定订单 |
| `25_cancelOrder.js` | 撤销订单 / Cancel Order | 撤销指定订单 |
| `26_allOpenOrders.js` | 撤销所有订单 / Cancel All Orders | 撤销所有当前订单 |
| `27_batchOrdersCancel.js` | 批量撤销 / Batch Cancel | 批量撤销订单 |
| `28_countdownCancelAll.js` | 倒计时撤销 / Countdown Cancel | 设置倒计时自动撤销 |
| `29_openOrder.js` | 查询当前订单 / Current Open Order | 查询指定当前订单 |
| `30_openOrders.js` | 查询所有当前订单 / All Open Orders | 查询所有当前订单 |
| `31_allOrders.js` | 查询所有订单 / All Orders | 查询所有订单（包括历史） |

#### 账户信息 / Account Information

| 文件 / File | 功能 / Function | 说明 / Description |
|------------|----------------|-------------------|
| `32_balance.js` | 账户余额 / Account Balance | 获取合约账户余额 |
| `33_account.js` | 账户信息 / Account Information | 获取账户详细信息 |

#### 杠杆和保证金 / Leverage & Margin

| 文件 / File | 功能 / Function | 说明 / Description |
|------------|----------------|-------------------|
| `34_leverage.js` | 调整杠杆 / Change Leverage | 调整开仓杠杆 |
| `35_marginType.js` | 变换保证金模式 / Change Margin Type | 切换逐仓/全仓模式 |
| `36_positionMargin.js` | 调整逐仓保证金 / Modify Isolated Margin | 增加/减少逐仓保证金 |
| `37_positionMarginHistory.js` | 保证金变动历史 / Margin Change History | 查询逐仓保证金变动历史 |
| `38_positionRisk.js` | 持仓风险 / Position Risk | 获取用户持仓风险信息 |

#### 交易历史和费率 / Trade History & Commission

| 文件 / File | 功能 / Function | 说明 / Description |
|------------|----------------|-------------------|
| `39_userTrades.js` | 成交历史 / Account Trade List | 获取账户成交历史 |
| `40_income.js` | 损益资金流水 / Get Income History | 获取账户损益资金流水 |
| `41_leverageBracket.js` | 杠杆分层标准 / Notional Bracket | 获取杠杆分层标准 |
| `42_adlQuantile.js` | ADL队列估算 / ADL Quantile | 持仓ADL队列估算 |
| `43_forceOrders.js` | 强平单 / Force Orders | 用户强平单历史 |
| `44_commissionRate.js` | 手续费率 / Commission Rate | 获取用户手续费率 |

#### 用户数据流 / User Data Stream

| 文件 / File | 功能 / Function | 说明 / Description |
|------------|----------------|-------------------|
| `45_createListenKey.js` | 创建ListenKey / Create Listen Key | 创建用户数据流ListenKey |
| `46_keepaliveListenKey.js` | 延长ListenKey / Keepalive Listen Key | 延长ListenKey有效期 |
| `47_closeListenKey.js` | 关闭ListenKey / Close Listen Key | 关闭用户数据流 |

---

## 🔧 工具函数 / Utility Functions

### utils.js

提供签名和请求工具：

Provides signature and request utilities:

```javascript
const { signParams, buildQueryString } = require('./utils');

// 生成签名参数 / Generate signed parameters
const signedParams = signParams(params, apiSecret);

// 构建查询字符串 / Build query string
const queryString = buildQueryString(signedParams);
```

#### 主要函数 / Main Functions

- **`signParams(params, apiSecret)`**
  - 为参数生成 HMAC SHA256 签名
  - Generate HMAC SHA256 signature for parameters
  
- **`buildQueryString(params)`**
  - 将对象转换为查询字符串
  - Convert object to query string

---

## 🆚 API 对比 / API Comparison

| 特性 / Feature | Futures API | Futures V3 API |
|---------------|-------------|----------------|
| **认证方式 / Auth** | HMAC SHA256 | Web3 ECDSA |
| **所需凭证 / Credentials** | API Key + Secret | Wallet Address + Private Key |
| **签名工具 / Signing** | crypto (Node.js) | ethers (Web3) |
| **复杂度 / Complexity** | ⭐⭐ 中等 / Medium | ⭐⭐⭐ 复杂 / Complex |
| **功能 / Features** | 完整 / Complete | 完整 / Complete |
| **适用场景 / Use Case** | 传统 API 集成 / Traditional API | Web3 去中心化应用 / Web3 DApps |

---

## 📖 参考文档 / Reference Documentation

### API 文档 / API Documentation
- **官方文档**: https://github.com/asterdex/api-docs/blob/master/aster-finance-futures-api.md
- **Official Docs**: https://github.com/asterdex/api-docs/blob/master/aster-finance-futures-api.md

### 相关指南 / Related Guides
- **配置指南**: `../CONFIGURATION_GUIDE.md`
- **Configuration Guide**: `../CONFIGURATION_GUIDE.md`
- **安全须知**: `../SECURITY_NOTICE.md`
- **Security Notice**: `../SECURITY_NOTICE.md`
- **TimeInForce 参数**: `../TIME_IN_FORCE_GUIDE.md`
- **TimeInForce Parameters**: `../TIME_IN_FORCE_GUIDE.md`

---

## ❓ 常见问题 / FAQ

### Q1: 如何获取 API Key 和 Secret？
**A:** 
1. 登录 AsterDEX
2. 访问"API 管理"页面
3. 创建新的 API Key
4. 保存 API Secret（只显示一次）
5. 建议设置 IP 白名单

**How to get API Key and Secret?**
1. Login to AsterDEX
2. Visit "API Management" page
3. Create new API Key
4. Save API Secret (shown only once)
5. Recommend setting IP whitelist

### Q2: 签名失败怎么办？
**A:** 检查以下几点：
- API Key 和 Secret 是否正确
- 系统时间是否同步（误差不超过1秒）
- 参数顺序是否正确
- 是否使用了正确的签名算法（HMAC SHA256）

**What if signature fails?**
Check the following:
- Are API Key and Secret correct?
- Is system time synchronized (error < 1 second)?
- Is parameter order correct?
- Are you using correct algorithm (HMAC SHA256)?

### Q3: 时间戳错误怎么办？
**A:** 
- 使用 `02_time.js` 获取服务器时间
- 同步本地时间与服务器时间
- 增加 `recvWindow` 参数值

**What about timestamp errors?**
- Use `02_time.js` to get server time
- Sync local time with server time
- Increase `recvWindow` parameter value

### Q4: 可以用 Spot API 的密钥吗？
**A:** 不可以。现货和合约需要不同的 API Key。

**Can I use Spot API keys?**
No. Spot and Futures require different API Keys.

### Q5: 如何设置杠杆？
**A:** 使用 `34_leverage.js` 设置杠杆倍数。注意：
- 不同交易对有不同的最大杠杆限制
- 持仓时修改杠杆有风险
- 建议在开仓前设置杠杆

**How to set leverage?**
Use `34_leverage.js` to set leverage multiplier. Note:
- Different symbols have different max leverage limits
- Changing leverage with open positions has risks
- Recommend setting leverage before opening positions

### Q6: 单向持仓和双向持仓有什么区别？
**A:** 
- **单向持仓**：同一交易对只能持有一个方向的仓位（多头或空头）
- **双向持仓**：同一交易对可以同时持有多头和空头仓位
- 使用 `17_positionSideDual.js` 切换模式

**What's the difference between One-way and Hedge mode?**
- **One-way**: Can only hold one direction (long or short) per symbol
- **Hedge mode**: Can hold both long and short positions simultaneously
- Use `17_positionSideDual.js` to switch modes

### Q7: 全仓和逐仓有什么区别？
**A:** 
- **全仓**：使用账户全部可用余额作为保证金
- **逐仓**：仅使用分配给该仓位的保证金
- 使用 `35_marginType.js` 切换模式

**What's the difference between Cross and Isolated margin?**
- **Cross**: Uses entire account balance as margin
- **Isolated**: Only uses allocated margin for the position
- Use `35_marginType.js` to switch modes

---

## 🔗 相关链接 / Related Links

- **AsterDEX 官网** / **AsterDEX Official**: https://www.asterdex.com
- **API 管理** / **API Management**: https://www.asterdex.com/en/futures/account/api-management
- **API 文档** / **API Docs**: https://github.com/asterdex/api-docs

---

## 💡 最佳实践 / Best Practices

1. **测试环境** / **Test Environment**
   - 先在测试账户上测试所有功能
   - Test all features on test account first

2. **错误处理** / **Error Handling**
   - 所有示例都包含错误处理
   - All examples include error handling
   - 检查响应状态码和错误信息
   - Check response status codes and error messages

3. **速率限制** / **Rate Limits**
   - 注意 API 速率限制
   - Be aware of API rate limits
   - 合理控制请求频率
   - Control request frequency reasonably

4. **资金安全** / **Fund Security**
   - 设置 IP 白名单
   - Set IP whitelist
   - 定期更换 API Key
   - Regularly rotate API Keys
   - 不要分享 API Secret
   - Never share API Secret

5. **风险管理** / **Risk Management**
   - 合理设置杠杆
   - Set leverage reasonably
   - 使用止损止盈
   - Use stop-loss and take-profit
   - 分散投资风险
   - Diversify investment risks

---

## 📄 许可证 / License

MIT

