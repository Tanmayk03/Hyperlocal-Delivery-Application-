# 🚀 Deployment Guide

Complete deployment guide for Blinkit Full Stack Clone with **React frontend** on **Vercel** and **Express backend** on **Render/Railway**. Includes database setup, environment configuration, and production optimizations.

## 🎯 Deployment Overview

| Component | Platform | URL | Status |
|-----------|----------|-----|--------|
| **Frontend** | Vercel | [blinkit-full-stack.vercel.app](https://blinkit-full-stack-d5vp.vercel.app/) | ✅ Live |
| **Backend** | Render/Railway | API endpoint | ✅ Live |
| **Database** | MongoDB Atlas | Cloud cluster | ✅ Connected |
| **Images** | Cloudinary | CDN storage | ✅ Active |

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Frontend Deployment (Vercel)](#-frontend-deployment-vercel)
- [Backend Deployment (Render)](#-backend-deployment-render)
- [Database Setup (MongoDB Atlas)](#-database-setup-mongodb-atlas)
- [Environment Variables](#-environment-variables)
- [Domain & SSL](#-domain--ssl)
- [Monitoring & Analytics](#-monitoring--analytics)
- [Troubleshooting](#-troubleshooting)

## ✅ Prerequisites

### Required Accounts
- [GitHub](https://github.com) - Code repository
- [Vercel](https://vercel.com) - Frontend hosting
- [Render](https://render.com) or [Railway](https://railway.app) - Backend hosting
- [MongoDB Atlas](https://cloud.mongodb.com) - Database
- [Cloudinary](https://cloudinary.com) - Image storage
- [Stripe](https://stripe.com) - Payment processing

### Local Setup Verification
```bash
# Verify your app runs locally
npm run dev        # Frontend
npm run server     # Backend

# Test all functionality
✅ User registration/login
✅ Product display
✅ Cart operations
✅ Payment processing (Stripe + COD)
✅ Order management
```

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Production

#### Build Optimization
```json
// package.json - Frontend
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "serve dist"
  }
}
```

#### Production Environment Variables
```env
# .env.production (Frontend)
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Step 2: Deploy to Vercel

#### Method 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd client

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Method 2: GitHub Integration
1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Import Project"
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```bash
   # Framework Preset: Vite
   # Root Directory: client
   # Build Command: npm run build
   # Output Directory: dist
   ```

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all production environment variables
   - Redeploy after adding variables

### Step 3: Vercel Configuration
```json
// vercel.json (in client directory)
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## 🖥️ Backend Deployment (Render)

### Step 1: Prepare Backend for Production

#### Production Dependencies
```json
// package.json - Backend
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "npm install"
  },
  "engines": {
    "node": "18.x"
  }
}
```

#### Production Middleware
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

// Production CORS configuration
const corsOptions = {
  origin: [
    'https://your-frontend-url.vercel.app',
    'http://localhost:3000' // For development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Trust proxy for production
app.set('trust proxy', 1);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 2: Deploy to Render

#### Create New Web Service
1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New" → "Web Service"**
3. **Connect GitHub Repository**

#### Configure Service Settings
```yaml
# Service Configuration
Name: blinkit-backend
Environment: Node
Region: Oregon (US West)
Branch: main
Root Directory: server (if backend is in server folder)
Build Command: npm install
Start Command: npm start
```

#### Environment Variables (Render)
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blinkit
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Alternative: Railway Deployment

#### Railway Setup
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

#### Railway Configuration
```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health"
  }
}
```

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Cluster

#### Cluster Configuration
1. **Go to [MongoDB Atlas](https://cloud.mongodb.com)**
2. **Create New Cluster**
   ```
   Provider: AWS
   Region: Mumbai (ap-south-1) or closest to your users
   Tier: M0 Sandbox (Free) or M2/M5 for production
   ```

3. **Database Access**
   - Create database user with read/write permissions
   - Note down username and password

4. **Network Access**
   - Add IP addresses: `0.0.0.0/0` (allow from anywhere)
   - Or specific IPs for better security

### Step 2: Connection String
```javascript
// Database connection string format
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database_name>?retryWrites=true&w=majority

// Example connection in backend
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
```

### Step 3: Database Seeding (Optional)
```javascript
// scripts/seedDatabase.js
const seedProducts = async () => {
  const products = [
    {
      name: "Fresh Apples",
      price: 120,
      category: "fruits",
      image: "cloudinary_url",
      stock: 50
    }
    // Add more products...
  ];
  
  await Product.insertMany(products);
  console.log('Database seeded successfully');
};
```

## 🔐 Environment Variables

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Backend (Production)
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/blinkit
JWT_SECRET=super-secret-production-key-minimum-32-characters
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CLIENT_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app,https://custom-domain.com
```

### Environment Variable Management
```bash
# For Render - Add via dashboard
# For Railway - Use CLI
railway variables set NODE_ENV=production
railway variables set MONGODB_URI=your_connection_string

# For Vercel - Use CLI or dashboard
vercel env add REACT_APP_API_URL production
```

## 🌍 Domain & SSL

### Custom Domain Setup

#### Vercel Custom Domain
1. **Go to Project Settings → Domains**
2. **Add Custom Domain:** `yourdomain.com`
3. **Configure DNS Records:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61
   ```

#### SSL Certificate
- **Automatic SSL:** Vercel provides free SSL certificates
- **Custom SSL:** Upload your own certificate if needed

### Backend Domain (Render)
```
Default: https://your-service-name.onrender.com
Custom: Configure custom domain in Render dashboard
```

## 📊 Monitoring & Analytics

### Application Monitoring

#### Health Checks
```javascript
// Health check endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

app.get('/api/status', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({
      api: 'OK',
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      api: 'OK',
      database: 'Disconnected',
      error: error.message
    });
  }
});
```

#### Error Logging
```javascript
// Production error handling
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});
```

### Performance Monitoring
```javascript
// Add to both frontend and backend
// Google Analytics for user tracking
// Sentry for error tracking
// New Relic for performance monitoring
```

## 🚨 Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Frontend build issues
Error: Build failed
Solution: Check environment variables and dependencies

# Clear cache and rebuild
npm run build --verbose
```

#### CORS Errors
```javascript
// Fix CORS issues
const corsOptions = {
  origin: [
    'https://your-frontend.vercel.app',
    'https://custom-domain.com'
  ],
  credentials: true
};
```

#### Database Connection Issues
```javascript
// MongoDB connection timeout
Error: MongoNetworkTimeoutError
Solution: 
1. Check IP whitelist in MongoDB Atlas
2. Verify connection string
3. Check network access settings
```

#### Environment Variable Issues
```bash
# Missing environment variables
Error: JWT_SECRET is not defined
Solution: Add all required environment variables to deployment platform
```

### Debugging Tools

#### Backend Logs
```bash
# Render logs
View logs in Render dashboard

# Railway logs
railway logs

# Local debugging
DEBUG=* npm start
```

#### Frontend Logs
```bash
# Vercel function logs
vercel logs

# Browser console
Check network tab for API calls
```

## 🔧 Production Optimizations

### Frontend Optimizations
```javascript
// Code splitting
const LazyComponent = lazy(() => import('./Component'));

// Image optimization
<img 
  src={`${cloudinaryUrl}/w_400,h_300,c_fill,f_auto,q_auto/v1/${imageId}`}
  loading="lazy"
  alt="Product"
/>

// Bundle analysis
npm run build -- --analyze
```

### Backend Optimizations
```javascript
// Compression middleware
const compression = require('compression');
app.use(compression());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Caching
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);
```

## 📈 Scaling Considerations

### Horizontal Scaling
- **Load Balancers:** Use Render/Railway auto-scaling
- **Database Scaling:** MongoDB Atlas auto-scaling
- **CDN:** Cloudinary for global image delivery

### Monitoring Scaling
```javascript
// Monitor resource usage
app.get('/metrics', (req, res) => {
  res.json({
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    cpu: process.cpuUsage()
  });
});
```

## 🔄 CI/CD Pipeline

### Automated Deployment
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- [ ] **Monitor application logs** - Weekly review
- [ ] **Update dependencies** - Monthly security updates
- [ ] **Database backups** - Automated daily backups
- [ ] **SSL certificate renewal** - Automatic with Vercel
- [ ] **Performance monitoring** - Continuous monitoring

### Contact Information
- **Developer:** Tanmay Kapoor
- **Email:** tanmaykapoor003@gmail.com
- **GitHub:** [Tanmayk03](https://github.com/Tanmayk03)
- **Live App:** [blinkit-full-stack.vercel.app](https://blinkit-full-stack-d5vp.vercel.app/)

---

**🚀 Successfully deployed on Vercel & Render • Built with React, Express.js, and MongoDB**