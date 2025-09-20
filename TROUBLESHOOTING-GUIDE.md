# 🆘 TrustVault AI Troubleshooting Guide

> **Complete troubleshooting guide for TrustVault AI platform**

## 📋 Overview

This guide helps you resolve common issues with TrustVault AI, including deployment, wallet connection, smart contract
interactions, and AI features.

## 🔍 Quick Diagnosis

### Common Issues Checklist

- [ ] **Access Denied**: Check Vercel project settings
- [ ] **Wallet Connection**: Verify MetaMask configuration
- [ ] **Contract Errors**: Check contract addresses and network
- [ ] **AI Features**: Verify OpenAI API key
- [ ] **Build Failures**: Check dependencies and environment

## 🌐 Deployment Issues

### Problem: Access Denied / Request Access Page

**Symptoms**:

- Users see "Access Required" page
- "Request Access" button appears
- Cannot access the application

**Causes**:

- OIDC Federation enabled
- Password protection enabled
- Private access settings

**Solutions**:

1. **Check Vercel Project Settings**:

   ```
   Vercel Dashboard → Project → Settings → General
   ```

   - Ensure **Public Access** is enabled
   - Disable **OIDC Federation**
   - Disable **Password Protection**

2. **Verify Access Control**:

   ```
   Settings → Security → Access Control
   ```

   - Should show "Public" or "No restrictions"
   - Remove any authentication requirements

3. **Check vercel.json**:
   ```json
   {
     "version": 2,
     "builds": [{ "src": "web/package.json", "use": "@vercel/static-build" }],
     "public": true,
     "access": "public"
   }
   ```

### Problem: Build Failures

**Symptoms**:

- Deployment fails during build
- Error messages in build logs
- Application doesn't deploy

**Causes**:

- Missing dependencies
- Environment variables not set
- Node.js version incompatibility

**Solutions**:

1. **Check Build Logs**:

   ```
   Vercel Dashboard → Project → Deployments → View Logs
   ```

2. **Verify Dependencies**:

   ```bash
   # Check package.json
   cat web/package.json

   # Install dependencies locally
   cd web
   npm install
   ```

3. **Set Environment Variables**:

   ```
   Vercel Dashboard → Project → Settings → Environment Variables
   ```

   Required variables:
   - `VITE_PRIVATE_VOTE_ADDRESS`
   - `VITE_RATING_FACTORY_ADDRESS`
   - `VITE_OPENAI_API_KEY` (optional)

4. **Check Node.js Version**:
   ```bash
   # Verify Node.js version
   node --version  # Should be 20+
   ```

### Problem: Environment Variables Not Working

**Symptoms**:

- Features not working
- API calls failing
- Configuration not loading

**Solutions**:

1. **Verify Environment Variables**:

   ```bash
   # Check .env file
   cat web/.env

   # Verify Vercel environment variables
   vercel env ls
   ```

2. **Redeploy After Changes**:
   ```bash
   # Trigger new deployment
   git commit --allow-empty -m "Trigger deployment"
   git push
   ```

## 🔗 Wallet Connection Issues

### Problem: MetaMask Not Connecting

**Symptoms**:

- "Connect Wallet" button not working
- MetaMask popup doesn't appear
- Connection fails

**Causes**:

- MetaMask not installed
- Wrong network
- Multiple wallet extensions

**Solutions**:

1. **Install MetaMask**:
   - Download from [metamask.io](https://metamask.io)
   - Create or import wallet
   - Ensure it's unlocked

2. **Configure Sepolia Network**:

   ```
   Network Name: Sepolia
   RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   Chain ID: 11155111
   Currency Symbol: ETH
   Block Explorer: https://sepolia.etherscan.io
   ```

3. **Disable Other Wallets**:
   - Disable other wallet extensions
   - Keep only MetaMask active
   - Refresh the page

4. **Get Test ETH**:
   - Use [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
   - Request test ETH for Sepolia

### Problem: Transaction Failures

**Symptoms**:

- Transactions fail
- Gas estimation errors
- Contract interaction errors

**Causes**:

- Insufficient ETH
- Wrong contract address
- Network issues

**Solutions**:

1. **Check ETH Balance**:
   - Ensure sufficient Sepolia ETH
   - Get more from faucet if needed

2. **Verify Contract Addresses**:

   ```env
   VITE_PRIVATE_VOTE_ADDRESS=0xFA6A70E59D0A816C6D99a28a46E607566813B183
   VITE_RATING_FACTORY_ADDRESS=0x45Fba25A3Eea1d0f3A7f43B3939CF93F83bE8795
   ```

3. **Check Network Connection**:
   - Ensure stable internet connection
   - Try different RPC endpoint
   - Check Sepolia network status

## 🤖 AI Features Issues

### Problem: AI Analysis Not Working

**Symptoms**:

- AI features not responding
- Analysis requests failing
- OpenAI API errors

**Causes**:

- Missing API key
- Invalid API key
- API rate limits

**Solutions**:

1. **Verify OpenAI API Key**:

   ```env
   VITE_OPENAI_API_KEY=sk-your-api-key-here
   ```

2. **Check API Key Permissions**:
   - Ensure key has GPT-4 access
   - Check usage limits
   - Verify billing is set up

3. **Test API Key**:

   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        https://api.openai.com/v1/models
   ```

4. **Check Rate Limits**:
   - Monitor API usage
   - Implement rate limiting
   - Consider upgrading plan

### Problem: AI Insights Not Loading

**Symptoms**:

- Loading states persist
- No insights displayed
- Error messages

**Solutions**:

1. **Check Network Requests**:
   - Open browser dev tools
   - Check Network tab
   - Look for failed requests

2. **Verify Data Format**:
   - Ensure data is properly formatted
   - Check for required fields
   - Validate input data

## 🔒 Smart Contract Issues

### Problem: Contract Interaction Errors

**Symptoms**:

- Contract calls failing
- Transaction reverts
- Gas estimation errors

**Causes**:

- Wrong contract address
- Insufficient permissions
- Contract not deployed

**Solutions**:

1. **Verify Contract Deployment**:

   ```bash
   # Check contract on Etherscan
   https://sepolia.etherscan.io/address/0xFA6A70E59D0A816C6D99a28a46E607566813B183
   ```

2. **Check Contract ABI**:
   - Ensure ABI matches deployed contract
   - Verify function signatures
   - Check parameter types

3. **Test Contract Functions**:
   ```bash
   # Test with Hardhat
   npx hardhat --network sepolia rating:create --name "Test" --desc "Test"
   ```

### Problem: FHEVM Encryption Issues

**Symptoms**:

- Encryption/decryption failing
- Relayer errors
- Ciphertext issues

**Solutions**:

1. **Check FHEVM Configuration**:

   ```typescript
   // Verify FHEVM setup
   const fhevm = await getFhevm();
   ```

2. **Verify Relayer Connection**:
   - Check relayer status
   - Ensure proper network configuration
   - Test with simple operations

3. **Check Browser Compatibility**:
   - Use supported browsers
   - Enable required features
   - Check console for errors

## 📱 Mobile Issues

### Problem: Mobile Wallet Connection

**Symptoms**:

- Wallet not connecting on mobile
- MetaMask mobile not working
- Touch interactions failing

**Solutions**:

1. **Use MetaMask Mobile**:
   - Install MetaMask mobile app
   - Connect via QR code
   - Enable mobile browser support

2. **Check Mobile Compatibility**:
   - Test on different devices
   - Verify touch interactions
   - Check responsive design

3. **Alternative Wallets**:
   - Try other mobile wallets
   - Use WalletConnect
   - Test with different browsers

## 🔧 Development Issues

### Problem: Local Development Not Working

**Symptoms**:

- Local server not starting
- Build errors
- Dependencies issues

**Solutions**:

1. **Check Node.js Version**:

   ```bash
   node --version  # Should be 20+
   npm --version   # Should be 7+
   ```

2. **Clean Install**:

   ```bash
   # Remove node_modules and reinstall
   rm -rf node_modules
   rm -rf web/node_modules
   npm install
   cd web && npm install
   ```

3. **Check Environment Variables**:

   ```bash
   # Create .env file
   cd web
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Start Development Server**:
   ```bash
   cd web
   npm run dev
   ```

### Problem: Build Errors

**Symptoms**:

- TypeScript errors
- Import/export issues
- Dependency conflicts

**Solutions**:

1. **Check TypeScript Configuration**:

   ```bash
   # Verify tsconfig.json
   cat web/tsconfig.json
   ```

2. **Update Dependencies**:

   ```bash
   # Update packages
   npm update
   cd web && npm update
   ```

3. **Check Import Paths**:
   - Verify import statements
   - Check file paths
   - Ensure proper exports

## 📊 Performance Issues

### Problem: Slow Loading

**Symptoms**:

- Long loading times
- Slow interactions
- Poor user experience

**Solutions**:

1. **Optimize Images**:
   - Compress images
   - Use appropriate formats
   - Implement lazy loading

2. **Check Bundle Size**:

   ```bash
   # Analyze bundle
   npm run build
   # Check dist folder size
   ```

3. **Implement Caching**:
   - Use browser caching
   - Implement service workers
   - Cache API responses

## 🆘 Getting Help

### Self-Help Resources

1. **Check Documentation**:
   - README.md
   - API documentation
   - Technical specifications

2. **Search Issues**:
   - GitHub issues
   - Stack Overflow
   - Community forums

3. **Debug Tools**:
   - Browser dev tools
   - Vercel logs
   - Contract explorer

### Contact Support

1. **GitHub Issues**:
   - [Report bugs](https://github.com/83mhpll/AI-Rating-Board-with-FHEVM/issues)
   - Search existing issues
   - Provide detailed information

2. **Community Support**:
   - Discord server
   - Telegram group
   - Reddit community

3. **Professional Support**:
   - Enterprise support
   - Consulting services
   - Custom development

## 📝 Reporting Issues

### When Reporting Issues

Include the following information:

1. **Environment**:
   - Browser and version
   - Operating system
   - Node.js version

2. **Steps to Reproduce**:
   - Detailed steps
   - Expected behavior
   - Actual behavior

3. **Error Messages**:
   - Console errors
   - Network errors
   - Contract errors

4. **Additional Context**:
   - Screenshots
   - Logs
   - Configuration files

### Issue Template

```markdown
## Bug Report

### Environment

- Browser: Chrome 120.0.0.0
- OS: macOS 14.0
- Node.js: 20.10.0

### Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. See error

### Expected Behavior

What should happen

### Actual Behavior

What actually happens

### Error Messages
```

Error: ...

```

### Additional Context
Add any other context about the problem here.
```

## 🎯 Prevention

### Best Practices

1. **Regular Updates**:
   - Keep dependencies updated
   - Monitor security advisories
   - Test after updates

2. **Testing**:
   - Test on multiple devices
   - Verify all features
   - Check error handling

3. **Monitoring**:
   - Monitor application health
   - Track error rates
   - Set up alerts

4. **Documentation**:
   - Keep docs updated
   - Document known issues
   - Provide clear instructions

---

**Built with ❤️ using Zama FHEVM technology**

_TrustVault AI Troubleshooting Guide - Where Privacy Meets Innovation_

---

_Document Version: 1.0_  
_Last Updated: December 2024_  
_Prepared by: TrustVault AI Team_
