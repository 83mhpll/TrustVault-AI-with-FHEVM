# 📚 TrustVault AI API Documentation

> **Complete API documentation for TrustVault AI platform**

## 📋 Overview

TrustVault AI provides a comprehensive API for rating AI models with complete privacy using FHEVM technology. This
documentation covers all available endpoints, authentication, and usage examples.

## 🔗 Base URL

```
Production: https://trustvault-ai-demo.vercel.app
Development: http://localhost:5173
```

## 🔐 Authentication

### API Key Authentication

```typescript
// Set API key in headers
const headers = {
  Authorization: "Bearer YOUR_API_KEY",
  "Content-Type": "application/json",
};
```

### Wallet Authentication

```typescript
// Connect wallet for blockchain operations
const { address, signer } = await connectWallet();
```

## 🏗️ Smart Contract APIs

### RatingFactory Contract

**Address**: `0x45Fba25A3Eea1d0f3A7f43B3939CF93F83bE8795`

#### Create Rating Item

```typescript
interface CreateRatingItemParams {
  name: string;
  description: string;
  category: string;
  modelUrl?: string;
}

async function createRatingItem(params: CreateRatingItemParams) {
  const contract = new ethers.Contract(RATING_FACTORY_ADDRESS, RatingFactoryABI, signer);

  const tx = await contract.createRatingItem(params.name, params.description, params.category, params.modelUrl || "");

  return await tx.wait();
}
```

#### Get Rating Items

```typescript
async function getRatingItems() {
  const contract = new ethers.Contract(RATING_FACTORY_ADDRESS, RatingFactoryABI, provider);

  const items = await contract.getAllRatingItems();
  return items;
}
```

### RatingItem Contract

**Address**: `0xFA6A70E59D0A816C6D99a28a46E607566813B183`

#### Rate Item

```typescript
interface RateItemParams {
  itemAddress: string;
  rating: number; // 1-5
}

async function rateItem(params: RateItemParams) {
  const contract = new ethers.Contract(params.itemAddress, RatingItemABI, signer);

  // Encrypt rating using FHEVM
  const encryptedRating = await fhevm.encrypt(params.rating);

  const tx = await contract.rate(encryptedRating);
  return await tx.wait();
}
```

#### Reveal Average

```typescript
interface RevealAverageParams {
  itemAddress: string;
  revealFee: string; // in ETH
}

async function revealAverage(params: RevealAverageParams) {
  const contract = new ethers.Contract(params.itemAddress, RatingItemABI, signer);

  const tx = await contract.revealAverage({
    value: ethers.parseEther(params.revealFee),
  });

  const receipt = await tx.wait();

  // Decrypt and return average
  const average = await fhevm.decrypt(receipt.logs[0].data);
  return average;
}
```

#### Get Rating Statistics

```typescript
async function getRatingStats(itemAddress: string) {
  const contract = new ethers.Contract(itemAddress, RatingItemABI, provider);

  const stats = await contract.getStats();
  return {
    totalRatings: stats.totalRatings,
    averageRating: stats.averageRating,
    lastUpdated: stats.lastUpdated,
  };
}
```

## 🤖 AI Analytics APIs

### AI Analysis

```typescript
interface AIAnalysisParams {
  ratings: number[];
  modelName: string;
  category: string;
}

async function analyzeRatingsWithAI(params: AIAnalysisParams) {
  const response = await fetch("/api/v1/analytics/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(params),
  });

  return await response.json();
}
```

**Response**:

```json
{
  "analysis": {
    "sentiment": "positive",
    "trend": "increasing",
    "insights": "Model shows strong performance with consistent ratings",
    "recommendations": ["Consider for production use", "Monitor performance metrics"]
  },
  "confidence": 0.95,
  "processingTime": "2.5s"
}
```

### Business Intelligence

```typescript
interface BusinessIntelligenceParams {
  data: any;
  analysisType: "sales" | "risk" | "market";
}

async function generateBusinessIntelligence(params: BusinessIntelligenceParams) {
  const response = await fetch("/api/v1/business/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(params),
  });

  return await response.json();
}
```

**Response**:

```json
{
  "insights": {
    "forecast": "Sales expected to increase 15% next quarter",
    "riskAssessment": "Low risk profile",
    "marketAnalysis": "Strong competitive position",
    "recommendations": ["Expand market reach", "Invest in R&D"]
  },
  "confidence": 0.88,
  "processingTime": "3.2s"
}
```

## 🔒 Privacy-Preserving APIs

### Encrypted Data Processing

```typescript
interface EncryptedProcessingParams {
  encryptedData: string;
  processingType: "aggregation" | "analysis" | "comparison";
}

async function processEncryptedData(params: EncryptedProcessingParams) {
  const response = await fetch("/api/v1/privacy/process", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(params),
  });

  return await response.json();
}
```

### Zero-Knowledge Proofs

```typescript
interface ZKProofParams {
  data: any;
  proofType: "rating" | "identity" | "ownership";
}

async function generateZKProof(params: ZKProofParams) {
  const response = await fetch("/api/v1/privacy/proof", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(params),
  });

  return await response.json();
}
```

## 📊 Analytics APIs

### Rating Analytics

```typescript
interface RatingAnalyticsParams {
  itemAddress: string;
  timeRange: "day" | "week" | "month" | "year";
}

async function getRatingAnalytics(params: RatingAnalyticsParams) {
  const response = await fetch(`/api/v1/analytics/ratings/${params.itemAddress}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  return await response.json();
}
```

**Response**:

```json
{
  "analytics": {
    "totalRatings": 1250,
    "averageRating": 4.2,
    "ratingDistribution": {
      "1": 50,
      "2": 100,
      "3": 200,
      "4": 400,
      "5": 500
    },
    "trends": {
      "daily": [4.1, 4.2, 4.3, 4.1, 4.2],
      "weekly": [4.0, 4.1, 4.2, 4.2, 4.3],
      "monthly": [4.0, 4.1, 4.2]
    }
  },
  "insights": {
    "performance": "Above average",
    "trend": "Improving",
    "recommendations": ["Continue current strategy"]
  }
}
```

### Model Performance

```typescript
interface ModelPerformanceParams {
  modelId: string;
  metrics: string[];
}

async function getModelPerformance(params: ModelPerformanceParams) {
  const response = await fetch(`/api/v1/analytics/models/${params.modelId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  return await response.json();
}
```

## 🌐 On-Chain Analytics APIs

### Transaction Analysis

```typescript
interface TransactionAnalysisParams {
  address: string;
  timeRange: string;
}

async function analyzeTransactions(params: TransactionAnalysisParams) {
  const response = await fetch("/api/v1/onchain/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(params),
  });

  return await response.json();
}
```

### Smart Contract Metrics

```typescript
interface SmartContractMetricsParams {
  contractAddress: string;
  metrics: string[];
}

async function getSmartContractMetrics(params: SmartContractMetricsParams) {
  const response = await fetch(`/api/v1/onchain/contracts/${params.contractAddress}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  return await response.json();
}
```

## 🔗 Oracle Integration APIs

### Submit Data to Oracle

```typescript
interface OracleSubmissionParams {
  data: any;
  oracleType: "chainlink" | "band" | "custom";
  targetChain: string;
}

async function submitToOracle(params: OracleSubmissionParams) {
  const response = await fetch("/api/v1/oracle/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(params),
  });

  return await response.json();
}
```

### Get Oracle Data

```typescript
interface OracleDataParams {
  oracleId: string;
  dataType: string;
}

async function getOracleData(params: OracleDataParams) {
  const response = await fetch(`/api/v1/oracle/data/${params.oracleId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  return await response.json();
}
```

## 📱 SDK Examples

### JavaScript/TypeScript SDK

```typescript
import { TrustVaultAI } from "@trustvault-ai/sdk";

const client = new TrustVaultAI({
  apiKey: "your-api-key",
  network: "sepolia",
});

// Rate an AI model
const result = await client.rateModel({
  modelId: "gpt-4",
  rating: 5,
  review: "Excellent performance",
});

// Get analytics
const analytics = await client.getAnalytics({
  modelId: "gpt-4",
  timeRange: "month",
});
```

### Python SDK

```python
from trustvault_ai import TrustVaultAI

client = TrustVaultAI(
    api_key='your-api-key',
    network='sepolia'
)

# Rate an AI model
result = client.rate_model(
    model_id='gpt-4',
    rating=5,
    review='Excellent performance'
)

# Get analytics
analytics = client.get_analytics(
    model_id='gpt-4',
    time_range='month'
)
```

## 🔧 Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_RATING",
    "message": "Rating must be between 1 and 5",
    "details": {
      "field": "rating",
      "value": 6,
      "constraint": "min: 1, max: 5"
    }
  },
  "timestamp": "2024-12-01T10:00:00Z",
  "requestId": "req_123456789"
}
```

### Common Error Codes

| Code                   | Description              | Solution                  |
| ---------------------- | ------------------------ | ------------------------- |
| `INVALID_RATING`       | Rating out of range      | Use rating 1-5            |
| `INSUFFICIENT_FUNDS`   | Not enough ETH           | Add more ETH to wallet    |
| `CONTRACT_ERROR`       | Smart contract error     | Check contract status     |
| `NETWORK_ERROR`        | Network connection issue | Check internet connection |
| `AUTHENTICATION_ERROR` | Invalid API key          | Verify API key            |

## 📊 Rate Limits

### API Rate Limits

| Endpoint              | Limit         | Window   |
| --------------------- | ------------- | -------- |
| `/api/v1/analytics/*` | 100 requests  | 1 minute |
| `/api/v1/business/*`  | 50 requests   | 1 minute |
| `/api/v1/privacy/*`   | 200 requests  | 1 minute |
| `/api/v1/onchain/*`   | 1000 requests | 1 minute |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🔒 Security

### API Key Security

- Store API keys securely
- Use environment variables
- Rotate keys regularly
- Monitor usage

### Data Privacy

- All data encrypted in transit
- FHEVM encryption for sensitive data
- No personal data stored
- GDPR compliant

## 📈 Monitoring

### Health Check

```typescript
async function checkHealth() {
  const response = await fetch("/api/v1/health");
  return await response.json();
}
```

**Response**:

```json
{
  "status": "healthy",
  "timestamp": "2024-12-01T10:00:00Z",
  "version": "1.0.0",
  "services": {
    "database": "healthy",
    "blockchain": "healthy",
    "ai": "healthy"
  }
}
```

### Usage Statistics

```typescript
async function getUsageStats() {
  const response = await fetch("/api/v1/stats", {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  return await response.json();
}
```

## 🆘 Support

### Getting Help

1. **Documentation**: Check this guide
2. **GitHub Issues**: [Report bugs](https://github.com/83mhpll/AI-Rating-Board-with-FHEVM/issues)
3. **Community**: Join our Discord
4. **Email**: support@trustvault.ai

### API Status

- **Status Page**: [status.trustvault.ai](https://status.trustvault.ai)
- **Uptime**: 99.9%
- **Response Time**: <200ms average

---

**Built with ❤️ using Zama FHEVM technology**

_TrustVault AI API Documentation - Where Privacy Meets Innovation_

---

_Document Version: 1.0_  
_Last Updated: December 2024_  
_Prepared by: TrustVault AI Team_
