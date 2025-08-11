# Vercel Deployment Environment Variables

Add these environment variables in your Vercel project settings:

## Required Environment Variables:

```
MONGODB_URI=mongodb+srv://shubhamsourav:jh15f3233@sabpaisa.6ajnqiq.mongodb.net/SabPaisa?retryWrites=true&w=majority&appName=SabPaisa
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.vercel.app
JWT_SECRET=sabpaisa_qr_dashboard_super_secret_key_2024
JWT_EXPIRE=30d
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
LOG_LEVEL=info
```

## Deployment Steps:

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Configure settings:
   - Project Name: sabpaisa-qr-dashboard-backend
   - Root Directory: backend
   - Build Command: npm run build
   - Install Command: npm install
5. Add all environment variables above
6. Click "Deploy"

## After Deployment:

Your backend will be available at: https://sabpaisa-qr-dashboard-backend.vercel.app

Test endpoints:
- Health Check: https://your-backend-url.vercel.app/api/
- QR Codes: https://your-backend-url.vercel.app/api/qr
- Transactions: https://your-backend-url.vercel.app/api/transactions

## Update Frontend:

Update your frontend to use the new backend URL instead of localhost:5000
