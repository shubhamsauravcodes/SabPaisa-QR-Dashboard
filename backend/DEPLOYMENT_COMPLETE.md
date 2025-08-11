# 🚀 Complete Environment Variable Setup

Your new backend URL: https://sabpaisa-qr-backend-n0o2lilwp-sabpaisa-qr-dashboard.vercel.app

## Environment Variables to Add:

Go to: https://vercel.com/sabpaisa-qr-dashboard/sabpaisa-qr-backend-api/settings/environment-variables

Add these variables one by one:

### 1. MONGODB_URI
- Key: MONGODB_URI
- Value: mongodb+srv://shubhamsourav:jh15f3233@sabpaisa.6ajnqiq.mongodb.net/SabPaisa?retryWrites=true&w=majority&appName=SabPaisa
- Environment: Production, Preview, Development

### 2. NODE_ENV
- Key: NODE_ENV
- Value: production
- Environment: Production, Preview, Development

### 3. FRONTEND_URL
- Key: FRONTEND_URL
- Value: https://your-frontend-domain.vercel.app
- Environment: Production, Preview, Development

### 4. JWT_SECRET
- Key: JWT_SECRET
- Value: sabpaisa_qr_dashboard_super_secret_key_2024
- Environment: Production, Preview, Development

### 5. JWT_EXPIRE
- Key: JWT_EXPIRE
- Value: 30d
- Environment: Production, Preview, Development

### 6. RATE_LIMIT_REQUESTS
- Key: RATE_LIMIT_REQUESTS
- Value: 100
- Environment: Production, Preview, Development

### 7. RATE_LIMIT_WINDOW_MS
- Key: RATE_LIMIT_WINDOW_MS
- Value: 900000
- Environment: Production, Preview, Development

### 8. LOG_LEVEL
- Key: LOG_LEVEL
- Value: info
- Environment: Production, Preview, Development

## After Adding Variables:

The deployment will automatically redeploy. Test these endpoints:

- Health: https://sabpaisa-qr-backend-n0o2lilwp-sabpaisa-qr-dashboard.vercel.app/api/
- QR Codes: https://sabpaisa-qr-backend-n0o2lilwp-sabpaisa-qr-dashboard.vercel.app/api/qr
- Transactions: https://sabpaisa-qr-backend-n0o2lilwp-sabpaisa-qr-dashboard.vercel.app/api/transactions
