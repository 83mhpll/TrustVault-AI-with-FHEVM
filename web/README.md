# 🛡️ TrustVault AI Web Application

> **Enterprise-Grade Confidential AI Model Rating Platform** - Built with React, Vite, and FHEVM technology

[![Live Demo](https://img.shields.io/badge/Live%20Demo-TrustVault%20AI-brightgreen?style=for-the-badge&logo=vercel)](https://trustvault-ai-demo.vercel.app)
[![Network](https://img.shields.io/badge/Network-Sepolia%20Testnet-blue?style=for-the-badge&logo=ethereum)](https://sepolia.etherscan.io)

## 🌟 Overview

TrustVault AI Web is a modern React application that provides a user-friendly interface for rating AI models with
complete privacy using Zama FHEVM technology. The platform allows users to evaluate AI models confidentially while
maintaining aggregated insights.

## ✨ Features

- 🔐 **Complete Privacy**: Individual ratings are encrypted and never revealed
- 🛡️ **FHEVM Technology**: Powered by Zama's Fully Homomorphic Encryption
- ⭐ **1-5 Star Rating**: Simple, intuitive rating system
- 📊 **Aggregated Insights**: View collective averages without compromising privacy
- 🎯 **AI Model Catalog**: Comprehensive database of AI models
- 🤖 **AI-Powered Analytics**: Advanced insights using OpenAI integration
- 🏢 **Business Solutions**: Enterprise-grade confidential data processing
- 📱 **Responsive Design**: Optimized for all devices

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Blockchain**: Ethereum Sepolia + Zama FHEVM
- **Wallet**: RainbowKit + Wagmi
- **AI Integration**: OpenAI GPT-4 API
- **Styling**: CSS3 + Modern UI Components
- **Deployment**: Vercel

## 📋 Requirements

- Node.js 20+
- npm 7+
- MetaMask wallet (or compatible Web3 wallet)
- Sepolia testnet ETH
- Deployed smart contracts

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/83mhpll/AI-Rating-Board-with-FHEVM.git
cd AI-Rating-Board-with-FHEVM

# Install dependencies
npm install

# Install web dependencies
cd web
npm install
```

### 2. Environment Setup

Create a `.env` file in the `web` directory:

```env
# Contract Addresses
VITE_PRIVATE_VOTE_ADDRESS=0xFA6A70E59D0A816C6D99a28a46E607566813B183
VITE_RATING_FACTORY_ADDRESS=0x45Fba25A3Eea1d0f3A7f43B3939CF93F83bE8795

# OpenAI API Key (optional)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Network Configuration
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/your_infura_key
```

### 3. Development Server

```bash
# Start development server
npm run dev
```

Open the local URL printed in the terminal (usually `http://localhost:5173`).

### 4. Usage

1. **Connect Wallet**: Connect your MetaMask to Sepolia testnet
2. **Get Test ETH**: Use the faucet link in the header
3. **Browse Models**: Explore the AI Model Catalog
4. **Rate Privately**: Select a model and give your 1-5 star rating
5. **Reveal Averages**: View aggregated results without exposing individual votes

## 🏗️ Project Structure

```
web/
├── src/
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── dist/                   # Build output
├── package.json            # Dependencies and scripts
└── vite.config.ts          # Vite configuration
```

## 🔧 Available Scripts

```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run preview            # Preview production build
npm run lint               # Run ESLint

# Vercel Deployment
npm run vercel-build       # Build for Vercel deployment
```

## 🌐 Network Configuration

### Sepolia Testnet

- **Network Name**: Sepolia
- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
- **Block Explorer**: https://sepolia.etherscan.io

### Smart Contracts

- **RatingFactory**: `0x45Fba25A3Eea1d0f3A7f43B3939CF93F83bE8795`
- **RatingItem**: `0xFA6A70E59D0A816C6D99a28a46E607566813B183`

## 🔒 Privacy & Security

### Encryption Details

- **Individual Ratings**: Encrypted using `euint32` FHE types
- **Storage**: Only encrypted sum and count stored on-chain
- **Decryption**: Client-side via Zama Relayer (EIP-712)
- **Access Control**: FHE ACL for ciphertext protection

### Privacy Guarantees

- ✅ Individual ratings never exposed
- ✅ Only aggregated averages can be revealed
- ✅ User controls their own decryption
- ✅ No central authority can access individual votes

## 🤖 AI Integration

### OpenAI GPT-4 Features

- **Rating Analysis**: AI-powered insights on rating patterns
- **Model Recommendations**: Intelligent suggestions based on ratings
- **Business Intelligence**: Advanced analytics for enterprise users
- **Automated Insights**: Real-time analysis and reporting

### API Usage

```typescript
// Example AI analysis
const analysis = await analyzeRatingsWithAI(ratings, {
  model: "gpt-4",
  temperature: 0.7,
  maxTokens: 1000,
});
```

## 📱 Mobile Support

TrustVault AI is fully responsive and optimized for:

- 📱 Mobile devices (iOS/Android)
- 💻 Desktop browsers (Chrome, Firefox, Safari, Edge)
- 🖥️ Tablet interfaces
- 🌐 Progressive Web App (PWA) ready

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Set Environment Variables**:
   - `VITE_PRIVATE_VOTE_ADDRESS`
   - `VITE_OPENAI_API_KEY` (optional)
4. **Deploy**: Automatic deployment on git push

### Access Control

- **Public Access**: Ensure your Vercel project is set to public
- **OIDC Federation**: Disable if you want public access
- **Password Protection**: Disable for public access

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🆘 Troubleshooting

### Common Issues

1. **Wallet Connection Issues**:
   - Ensure MetaMask is installed and unlocked
   - Check that you're connected to Sepolia testnet
   - Disable other wallet extensions to avoid conflicts

2. **Contract Interaction Errors**:
   - Verify contract addresses in environment variables
   - Ensure you have sufficient Sepolia ETH
   - Check network connectivity

3. **AI Features Not Working**:
   - Verify OpenAI API key is set correctly
   - Check API key permissions and usage limits
   - Ensure network connectivity

4. **Build Errors**:
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version (requires 20+)
   - Verify all environment variables are set

### Support

- **GitHub Issues**: [Report bugs and feature requests](https://github.com/83mhpll/AI-Rating-Board-with-FHEVM/issues)
- **Documentation**: Check the main README.md
- **Community**: Join our Discord for support

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](../CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- **Zama**: For the revolutionary FHEVM technology
- **Ethereum Foundation**: For the robust blockchain infrastructure
- **OpenAI**: For AI integration capabilities
- **Community**: For feedback and support

---

**Built with ❤️ using Zama FHEVM technology**

_TrustVault AI Web - Where Privacy Meets Innovation_
