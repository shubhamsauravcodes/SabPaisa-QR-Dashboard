# Vercel Deployment Guide

## Prerequisites

1. **MongoDB Database**: You'll need a MongoDB database. You can use:
   - MongoDB Atlas (cloud) - Recommended for production
   - Local MongoDB (for development)

2. **Environment Variables**: Set up the following environment variables in Vercel:

## Environment Variables for Vercel

Go to your Vercel project settings and add these environment variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sabpaisa_qr
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## Deployment Steps

1. **Connect Repository**: 
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - Root Directory: `backend` (if this is in a monorepo)
   - Build Command: `npm run build`
   - Output Directory: Leave empty (serverless function)
   - Install Command: `npm install`

3. **Environment Variables**:
   - Add all the environment variables listed above

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically deploy your application

## Testing Deployment

After deployment, test these endpoints:

1. **Health Check**: `GET https://your-app.vercel.app/api/`
2. **QR Codes**: `GET https://your-app.vercel.app/api/qr`
3. **Transactions**: `GET https://your-app.vercel.app/api/transactions`

## Troubleshooting

### CORS Issues
- Make sure your frontend URL is added to the CORS configuration
- Update the `FRONTEND_URL` environment variable

### Database Connection
- Ensure MongoDB URI is correct
- Check if your IP is whitelisted in MongoDB Atlas

### Function Timeout
- The function timeout is set to 10 seconds
- For longer operations, consider increasing this in `vercel.json`

## Files Added for Vercel

- `vercel.json`: Vercel configuration
- `.vercelignore`: Files to exclude from deployment

## Post-Deployment

1. Update your frontend to use the new backend URL
2. Test all API endpoints
3. Monitor logs in Vercel dashboard for any issues
