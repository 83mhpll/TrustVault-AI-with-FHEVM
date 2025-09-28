# 🛡️ TrustVault AI - Enterprise-Grade Confidential AI Model Rating Platform

> **The Future of Private AI Model Evaluation** - Rate AI models with complete confidentiality using Zama FHEVM
> technology.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-TrustVault%20AI-brightgreen?style=for-the-badge&logo=vercel)](https://trustvault-ai-demo.vercel.app)
[![Network](https://img.shields.io/badge/Network-Sepolia%20Testnet-blue?style=for-the-badge&logo=ethereum)](https://sepolia.etherscan.io)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

## 🌟 What is TrustVault AI?

TrustVault AI is a revolutionary **confidential rating platform** that allows users to evaluate AI models with complete
privacy. Built on Zama FHEVM technology, your individual ratings are never exposed - only encrypted aggregates are
stored on-chain.

### ✨ Key Features

- 🔐 **Complete Privacy**: Individual ratings are encrypted and never revealed
- 🛡️ **FHEVM Technology**: Powered by Zama's Fully Homomorphic Encryption
- ⭐ **1-5 Star Rating**: Simple, intuitive rating system
- 📊 **Aggregated Insights**: View collective averages without compromising privacy
- 🎯 **AI Model Catalog**: Comprehensive database of AI models
- 💰 **Revenue Model**: Sustainable business with creation, reveal, and promotion fees
- 🤖 **AI-Powered Analytics**: Advanced insights using OpenAI integration
- 🏢 **Business Solutions**: Enterprise-grade confidential data processing

## 🚀 Live Demo

**Experience TrustVault AI now**: [https://trustvault-ai-demo.vercel.app](https://trustvault-ai-demo.vercel.app)

### 🎯 Quick Start Guide

1. **Connect Wallet**: Connect your MetaMask to Sepolia testnet
2. **Get Test ETH**: Use the faucet link in the header
3. **Browse Models**: Explore the AI Model Catalog
4. **Rate Privately**: Select a model and give your 1-5 star rating
5. **Reveal Averages**: View aggregated results without exposing individual votes

## 🏗️ Technical Architecture

### Smart Contracts (Sepolia)

- **RatingFactory**: `0x45Fba25A3Eea1d0f3A7f43B3939CF93F83bE8795`
  - [View on Etherscan](https://sepolia.etherscan.io/address/0x45Fba25A3Eea1d0f3A7f43B3939CF93F83bE8795#code)
- **RatingItem**: `0xFA6A70E59D0A816C6D99a28a46E607566813B183`
  - [View on Etherscan](https://sepolia.etherscan.io/address/0xFA6A70E59D0A816C6D99a28a46E607566813B183#code)

### Technology Stack

- **Frontend**: React + Vite + TypeScript
- **Blockchain**: Ethereum Sepolia + Zama FHEVM
- **Wallet**: RainbowKit + Wagmi
- **AI Integration**: OpenAI GPT-4 API
- **Deployment**: Vercel

## 💼 Business Model

TrustVault AI operates on a sustainable revenue model:

### 💰 Fee Structure

- **Creation Fee**: 0.001 ETH per new rating item
- **Reveal Fee**: 0.0005 ETH per average reveal
- **Promotion Fee**: 0.01 ETH for 7-day model promotion
- **API Access**: Tiered pricing for enterprise users

### 🎯 Target Markets

1. **AI Research Organizations**: Confidential model evaluation
2. **Enterprise AI Teams**: Internal model assessment
3. **Academic Institutions**: Research and benchmarking
4. **AI Model Developers**: Community feedback collection
5. **Data Privacy-Conscious Users**: Secure platform

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+
- npm 7+
- MetaMask wallet
- Sepolia testnet ETH

### Installation

```bash
# Clone the repository
git clone https://github.com/83mhpll/TrustVault-AI.git
cd TrustVault-AI

# Install dependencies
npm install

# Install web dependencies
cd web
npm install
```

### Local Development

```bash
# Start local blockchain
npx hardhat node

# Deploy contracts locally
npx hardhat --network localhost deploy

# Start web development server
cd web
npm run dev
```

### Sepolia Deployment

```bash
# Set environment variables
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY

# Deploy to Sepolia
npx hardhat --network sepolia deploy
```

## 🧪 Testing

### Smart Contract Testing

```bash
# Run contract tests
npx hardhat test

# Test rating functionality
npx hardhat --network localhost rating:create --name "Test Model" --desc "Test Description"
npx hardhat --network localhost rating:rate --item <RatingItem> --score 5
npx hardhat --network localhost rating:decrypt --item <RatingItem>
```

### Web Application Testing

```bash
# Start development server
cd web
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

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

## 📊 Features Overview

### 🏆 Model Catalog

- Comprehensive AI model database
- Advanced search and filtering
- Trending, top-rated, and most-rated categories
- Quick selection and rating

### ⭐ Rating System

- 1-5 star rating scale
- Encrypted on-chain storage
- Wallet integration for secure transactions
- Real-time feedback

### 📈 Analytics Dashboard

- Aggregated rating statistics
- AI-powered insights
- Business analytics
- Revenue tracking

### 🤖 AI Integration

- OpenAI GPT-4 analysis
- Model recommendations
- Business intelligence
- Automated insights

## 🌐 Network Information

- **Network**: Ethereum Sepolia Testnet
- **Chain ID**: 11155111
- **RPC**: Multiple fallback endpoints configured
- **Faucet**: [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)

## 📱 Mobile Support

TrustVault AI is fully responsive and optimized for:

- 📱 Mobile devices
- 💻 Desktop browsers
- 🖥️ Tablet interfaces
- 🌐 Progressive Web App (PWA) ready

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zama**: For the revolutionary FHEVM technology
- **Ethereum Foundation**: For the robust blockchain infrastructure
- **OpenAI**: For AI integration capabilities
- **Community**: For feedback and support

## 🚀 Roadmap

### Phase 1 (Current)

- ✅ Core rating functionality
- ✅ Model catalog
- ✅ Basic analytics
- ✅ Revenue model
- ✅ AI Analytics API Marketplace
- ✅ UI/UX improvements
- ✅ Documentation updates

### Phase 2 (Next)

- 🔄 Enterprise Dashboard
- 🔄 Mobile App
- 🔄 API Marketplace
- 🔄 Certification System
- 🔄 Advanced AI Features

## 📚 Documentation

### Business Plans

- [AI Analytics API Marketplace Plan](AI-ANALYTICS-MARKETPLACE-PLAN.md)
- [Executive Summary](AI-ANALYTICS-MARKETPLACE-EXECUTIVE-SUMMARY.md)
- [Technical Specifications](AI-ANALYTICS-MARKETPLACE-TECHNICAL-SPEC.md)
- [Development Roadmap](AI-ANALYTICS-MARKETPLACE-ROADMAP.md)
- [Investor Presentation](AI-ANALYTICS-MARKETPLACE-PRESENTATION.md)

### Technical Documentation

- [AI-FHEVM Integration Guide](AI-FHEVM-INTEGRATION.md)
- [Business Solutions](AI-BUSINESS-SOLUTIONS.md)
- [Business Plan](BUSINESS-PLAN.md)
- [API Documentation](API-DOCUMENTATION.md)
- [Deployment Guide](DEPLOYMENT-GUIDE.md)
- [Troubleshooting Guide](TROUBLESHOOTING-GUIDE.md)

## 🔧 Deployment

### Vercel Deployment

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Build Settings**:
   - Build Command: `cd web && npm run build`
   - Output Directory: `web/dist`
3. **Set Environment Variables**:
   - `VITE_PRIVATE_VOTE_ADDRESS`: Your deployed contract address
   - `VITE_OPENAI_API_KEY`: Your OpenAI API key (optional)
4. **Deploy**: Automatic deployment on git push

### Access Control

- **Public Access**: Ensure your Vercel project is set to public
- **OIDC Federation**: Disable if you want public access
- **Password Protection**: Disable for public access

## 🆘 Troubleshooting

### Common Issues

1. **Access Denied**: Check Vercel project settings for public access
2. **Wallet Connection**: Ensure MetaMask is connected to Sepolia testnet
3. **Contract Errors**: Verify contract addresses in environment variables
4. **AI Features**: Check OpenAI API key configuration

### Support

- **GitHub Issues**: [Report bugs and feature requests](https://github.com/83mhpll/AI-Rating-Board-with-FHEVM/issues)
- **Documentation**: Check the documentation files above


**Built with ❤️ using Zama FHEVM technology**

_TrustVault AI - Where Privacy Meets Innovation_
