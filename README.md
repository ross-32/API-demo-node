# AsterDEX API Demo Collection / AsterDEX API示例集合

Complete API examples for Spot, Futures, and Futures V3 APIs (REST & WebSocket).  
完整的现货、期货和期货V3 API示例（REST & WebSocket）。

## 📁 Project Structure / 项目结构

```
api-demo/
├── spot-demo/          # Spot REST API (29 endpoints) / 现货REST API（29个接口）
├── spot-ws/            # Spot WebSocket (14 streams) / 现货WebSocket（14个流）
├── futures-demo/       # Futures REST API (47 endpoints) / 期货REST API（47个接口）
├── futures-ws/         # Futures WebSocket (15 streams) / 期货WebSocket（15个流）
├── futures-v3-demo/    # Futures V3 REST API (46 endpoints) / 期货V3 REST API（46个接口）
└── futures-v3-ws/      # Futures V3 WebSocket (15 streams) / 期货V3 WebSocket（15个流）
```

## 📊 Statistics / 统计

- **Total Files / 总文件数**: 175
- **Total API Endpoints / API接口总数**: 122
- **Total WebSocket Streams / WebSocket流总数**: 44
- **Languages / 语言**: JavaScript (Node.js)
- **Documentation / 文档**: 中英文双语注释

## 🚀 Quick Start / 快速开始

### 1. Install Dependencies / 安装依赖

For REST API examples / REST API示例:
```bash
cd spot-demo && npm install
cd futures-demo && npm install
cd futures-v3-demo && npm install
```

For WebSocket examples / WebSocket示例:
```bash
cd spot-ws && npm install
cd futures-ws && npm install
cd futures-v3-ws && npm install
```

### 2. Configure API Credentials / 配置API凭证

Edit the `config.js` file in each directory:  
编辑每个目录中的`config.js`文件：

```javascript
module.exports = {
    BASE_URL: 'https://api.asterdex.com',
    API_KEY: 'your_api_key_here',
    SECRET_KEY: 'your_secret_key_here',
    // ...
};
```

### 3. Run Examples / 运行示例

```bash
# Spot API example / 现货API示例
cd spot-demo
node 01_ping.js

# Spot WebSocket example / 现货WebSocket示例
cd spot-ws
node 01_aggTrade.js

# Futures API example / 期货API示例
cd futures-demo
node 01_ping.js

# And so on... / 以此类推...
```

## 📚 API Documentation / API文档

### Spot API / 现货API
- **REST API**: 29 endpoints (market data, trading, account, wallet)
- **WebSocket**: 14 streams (trades, klines, tickers, depth, user data)
- **Base URL**: `https://sapi.asterdex.com`
- **WebSocket URL**: `wss://sstream.asterdex.com/ws`

### Futures API / 期货API
- **REST API**: 47 endpoints (market data, trading, positions, leverage)
- **WebSocket**: 15 streams (trades, klines, tickers, liquidations, user data)
- **Base URL**: `https://fapi.asterdex.com`
- **WebSocket URL**: `wss://fstream.asterdex.com/ws`

### Futures V3 API / 期货V3 API
- **REST API**: 46 endpoints (enhanced futures API)
- **WebSocket**: 15 streams (same as Futures)
- **Base URL**: `https://fapi.asterdex.com` (with /fapi/v3 paths)
- **WebSocket URL**: `wss://fstream.asterdex.com/ws`

## 🔐 Security / 安全性

⚠️ **IMPORTANT / 重要提示**:

1. **Never commit API credentials / 永远不要提交API凭证**
   - Add `config.js` to `.gitignore`
   - Use environment variables in production / 在生产环境使用环境变量

2. **API Key Permissions / API密钥权限**
   - Only grant necessary permissions / 只授予必要的权限
   - Use different keys for different purposes / 不同用途使用不同的密钥

3. **Signature Security / 签名安全**
   - Always use HMAC SHA256 signatures / 始终使用HMAC SHA256签名
   - Include timestamp and recvWindow / 包含时间戳和接收窗口

## 📝 Features / 功能特点

✅ **Complete Coverage / 完整覆盖**
- All documented endpoints / 所有文档化的接口
- All WebSocket streams / 所有WebSocket流

✅ **Bilingual Comments / 双语注释**
- English and Chinese / 英文和中文
- Clear parameter descriptions / 清晰的参数说明

✅ **Production Ready / 生产就绪**
- Error handling / 错误处理
- Signature generation / 签名生成
- Configurable parameters / 可配置参数

✅ **Easy to Use / 易于使用**
- Standalone examples / 独立示例
- Copy and modify / 复制和修改
- Well-organized structure / 组织良好的结构

## 🔧 Utility Functions / 工具函数

Each REST API directory includes:  
每个REST API目录包含：

- `config.js`: Configuration file / 配置文件
- `utils.js`: Signature and query string utilities / 签名和查询字符串工具

Key utilities / 主要工具:
- `createSignature()`: Generate HMAC SHA256 signature / 生成HMAC SHA256签名
- `buildQueryString()`: Build URL query string / 构建URL查询字符串
- `signParams()`: Add timestamp and signature / 添加时间戳和签名

## 📖 Examples by Category / 按类别分类的示例

### Market Data / 市场数据
- Ping, Server Time, Exchange Info
- Order Book Depth
- Recent/Historical Trades
- Kline/Candlestick Data
- 24hr Ticker Statistics
- Price Tickers

### Trading / 交易
- Place Order (Market, Limit, Stop)
- Cancel Order (Single, Batch, All)
- Query Orders (Open, All, History)
- Account Information
- Trade History

### Account & Wallet / 账户和钱包
- Account Balance
- Position Information
- Leverage Management
- Margin Management
- Asset Transfer
- Withdraw

### User Data Streams / 用户数据流
- Create/Keepalive/Close ListenKey
- Account Updates
- Order Updates
- Position Updates

## 🌐 WebSocket Streams / WebSocket流

### Public Streams / 公开流
- Aggregate Trade Stream
- Trade Stream
- Kline Stream
- Ticker Streams (Mini, Full)
- Book Ticker Stream
- Depth Streams (Partial, Diff)
- Liquidation Streams (Futures only)
- Mark Price Streams (Futures only)

### Private Streams / 私有流
- User Data Stream
- Account Updates
- Order Updates
- Balance Updates

## 🛠️ Troubleshooting / 故障排除

### Common Issues / 常见问题

**1. Signature Invalid / 签名无效**
- Check API Key and Secret / 检查API密钥和密钥
- Verify timestamp is correct / 验证时间戳正确
- Ensure parameters are sorted / 确保参数已排序

**2. IP Limit Exceeded / IP限制超出**
- Use WebSocket for real-time data / 使用WebSocket获取实时数据
- Implement request throttling / 实现请求限流
- Check rate limits in exchangeInfo / 检查exchangeInfo中的频率限制

**3. WebSocket Connection Failed / WebSocket连接失败**
- Check network connectivity / 检查网络连接
- Verify WebSocket URL / 验证WebSocket URL
- For user data: check listenKey validity / 对于用户数据：检查listenKey有效性

**4. Order Rejected / 订单被拒绝**
- Check symbol is valid / 检查交易对有效
- Verify quantity meets LOT_SIZE / 验证数量符合LOT_SIZE
- Check price meets PRICE_FILTER / 检查价格符合PRICE_FILTER
- Ensure sufficient balance / 确保余额充足

## 📄 License / 许可证

MIT License

## 🤝 Contributing / 贡献

Feel free to submit issues and enhancement requests!  
欢迎提交问题和改进请求！

## 📞 Support / 支持

For API documentation and support:  
API文档和支持：

- Website: https://www.asterdex.com/
- Documentation: Check the provided markdown files
- API Support: Contact AsterDEX support team

## ⚠️ Disclaimer / 免责声明

These examples are provided for educational purposes.  
这些示例仅供教育目的。

Trading cryptocurrencies involves risk. Always do your own research.  
加密货币交易涉及风险。务必进行自己的研究。

---

