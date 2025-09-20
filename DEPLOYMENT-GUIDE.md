# 🚀 TrustVault AI Deployment Guide

> **Complete guide for deploying TrustVault AI to Vercel with public access**

## 📋 Overview

This guide provides step-by-step instructions for deploying TrustVault AI to Vercel and ensuring it's accessible to the
public.

## 🎯 Prerequisites

- GitHub repository with your code
- Vercel account
- MetaMask wallet
- Sepolia testnet ETH
- OpenAI API key (optional)

## 🔧 Step 1: Vercel Setup

### 1.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Verify your email address

### 1.2 Connect Repository

1. Click "New Project" in Vercel dashboard
2. Import your GitHub repository
3. Select the repository: `AI-Rating-Board-with-FHEVM`

## ⚙️ Step 2: Project Configuration

### 2.1 Build Settings

Configure the following settings in Vercel:

```json
{
  "buildCommand": "cd web && npm run build",
  "outputDirectory": "web/dist",
  "installCommand": "npm install && cd web && npm install"
}
```

### 2.2 Environment Variables

Set the following environment variables in Vercel:

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

### 2.3 Vercel Configuration

Ensure your `vercel.json` file is configured correctly:

```json
{
  "version": 2,
  "builds": [{ "src": "web/package.json", "use": "@vercel/static-build" }],
  "public": true,
  "access": "public"
}
```

## 🌐 Step 3: Access Control Configuration

### 3.1 Enable Public Access

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **General**
3. Scroll down to **Access Control**
4. Ensure the following settings:
   - ✅ **Public Access**: Enabled
   - ❌ **OIDC Federation**: Disabled
   - ❌ **Password Protection**: Disabled
   - ❌ **Vercel Authentication**: Disabled

### 3.2 Disable OIDC Federation

If you see "Secure Backend Access with OIDC Federation":

1. Go to **Settings** → **Security**
2. Find **OIDC Federation** section
3. Click **Disable** or **Remove**
4. Confirm the action

### 3.3 Verify Public Access

1. Go to **Settings** → **General**
2. Check **Access Control** section
3. Ensure it shows **"Public"** or **"No restrictions"**

## 🚀 Step 4: Deployment

### 4.1 Initial Deployment

1. Click **Deploy** in Vercel dashboard
2. Wait for the build to complete
3. Note the deployment URL

### 4.2 Automatic Deployments

Vercel will automatically deploy when you push to your main branch:

```bash
# Push changes to trigger deployment
git add .
git commit -m "Update for deployment"
git push origin main
```

## 🔍 Step 5: Verification

### 5.1 Test Deployment

1. Visit your deployment URL
2. Verify the application loads correctly
3. Test wallet connection
4. Test basic functionality

### 5.2 Common URLs

Your deployment might be available at:

- `https://your-project-name.vercel.app`
- `https://trustvault-ai-demo.vercel.app`
- `https://ai-rating-board-with-fhevm.vercel.app`

## 🛠️ Step 6: Troubleshooting

### 6.1 Access Denied Issues

**Problem**: Users see "Access Required" or "Request Access" page

**Solution**:

1. Check Vercel project settings
2. Ensure **Public Access** is enabled
3. Disable **OIDC Federation**
4. Disable **Password Protection**

### 6.2 Build Failures

**Problem**: Deployment fails during build

**Solution**:

1. Check build logs in Vercel dashboard
2. Verify all dependencies are installed
3. Check environment variables
4. Ensure Node.js version compatibility

### 6.3 Environment Variables

**Problem**: Features not working due to missing environment variables

**Solution**:

1. Go to **Settings** → **Environment Variables**
2. Add all required variables
3. Redeploy the project

## 📱 Step 7: Mobile Optimization

### 7.1 Responsive Design

Ensure your application is mobile-friendly:

- Test on different screen sizes
- Verify touch interactions work
- Check mobile wallet connections

### 7.2 PWA Configuration

For Progressive Web App features:

1. Add `manifest.json` to `web/public/`
2. Configure service worker
3. Enable PWA features in Vercel

## 🔒 Step 8: Security Considerations

### 8.1 Environment Variables

- Never commit API keys to repository
- Use Vercel environment variables
- Rotate keys regularly

### 8.2 Access Control

- Keep public access enabled for demo
- Consider authentication for production
- Monitor usage and abuse

## 📊 Step 9: Monitoring

### 9.1 Vercel Analytics

1. Enable Vercel Analytics
2. Monitor performance metrics
3. Track user engagement

### 9.2 Error Tracking

1. Set up error monitoring
2. Configure alerts
3. Monitor application health

## 🎉 Step 10: Go Live

### 10.1 Final Checklist

- ✅ Application loads correctly
- ✅ Wallet connection works
- ✅ Smart contract interactions work
- ✅ AI features function (if enabled)
- ✅ Mobile responsive
- ✅ Public access enabled
- ✅ No access restrictions

### 10.2 Share Your Project

1. Update README.md with live URL
2. Share on social media
3. Submit to relevant communities
4. Update project documentation

## 🔄 Step 11: Maintenance

### 11.1 Regular Updates

- Monitor for security updates
- Update dependencies regularly
- Test after each deployment

### 11.2 Performance Optimization

- Monitor Core Web Vitals
- Optimize images and assets
- Implement caching strategies

## 📞 Support

### Common Issues

1. **Access Denied**: Check Vercel access settings
2. **Build Failures**: Check build logs and dependencies
3. **Environment Variables**: Verify all required variables are set
4. **Wallet Connection**: Ensure MetaMask is configured for Sepolia

### Getting Help

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Issues**: [Report bugs and feature requests](https://github.com/83mhpll/AI-Rating-Board-with-FHEVM/issues)
- **Community**: Join our Discord for support

## 🎯 Best Practices

### Development

- Use feature branches for development
- Test locally before deploying
- Keep environment variables secure

### Deployment

- Use automatic deployments
- Monitor build logs
- Test after each deployment

### Security

- Never expose API keys
- Use environment variables
- Keep dependencies updated

---

**Built with ❤️ using Zama FHEVM technology**

_TrustVault AI Deployment Guide - Where Privacy Meets Innovation_

---

_Document Version: 1.0_  
_Last Updated: December 2024_  
_Prepared by: TrustVault AI Team_
