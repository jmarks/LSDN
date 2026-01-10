# Local Singles Date Night - Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Local Singles Date Night application to various cloud platforms for public testing.

## Deployment Options

### Option 1: Render.com (Recommended for Easy Deployment)

Render.com is recommended for the easiest deployment experience with minimal configuration.

#### Backend Deployment

1. **Create Render Account**
   - Sign up at [render.com](https://render.com)
   - Connect your GitHub repository

2. **Deploy Backend**
   - Click "New" → "Web Service"
   - Connect your repository
   - Configure settings:
     - **Name**: `lsdn-backend`
     - **Region**: Choose closest to your target users
     - **Branch**: `main`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Environment**: Node.js

3. **Set Environment Variables**
   Add these environment variables in Render dashboard:
   ```
   DATABASE_URL=your-postgres-connection-string
   REDIS_URL=your-redis-connection-string
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRES_IN=7d
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   FRONTEND_URL=https://your-frontend-url.onrender.com
   PARTNER_URL=https://your-partner-url.onrender.com
   PORT=10000
   ```

4. **Add PostgreSQL Database**
   - Click "New" → "PostgreSQL"
   - Name: `lsdn-database`
   - Region: Same as backend
   - Connection string will be auto-generated

5. **Add Redis Cache**
   - Click "New" → "Redis"
   - Name: `lsdn-cache`
   - Region: Same as backend

#### Frontend Deployment

1. **Deploy Frontend**
   - Click "New" → "Static Site"
   - Connect your repository
   - Configure settings:
     - **Name**: `lsdn-frontend`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`
     - **Branch**: `main`

2. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable
   ```

#### Partner Portal Deployment

1. **Deploy Partner Portal**
   - Click "New" → "Static Site"
   - Connect your repository
   - Configure settings:
     - **Name**: `lsdn-partner-portal`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`
     - **Branch**: `main`

2. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

### Option 2: Railway

Railway is another excellent option for easy deployment.

#### Quick Setup

1. **Deploy to Railway**
   - Click the "Deploy on Railway" button
   - Connect your GitHub repository
   - Railway will automatically detect and deploy all services

2. **Configure Environment Variables**
   - Go to each service settings
   - Add the same environment variables as Render.com

### Option 3: Vercel + Railway (Alternative)

For frontend on Vercel and backend on Railway:

#### Frontend on Vercel

1. **Deploy to Vercel**
   - Sign up at [vercel.com](https://vercel.com)
   - Import your project
   - Configure build settings:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

2. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable
   ```

#### Backend on Railway

1. **Deploy Backend**
   - Use Railway for backend deployment
   - Same configuration as above

## Required Services

### Database: PostgreSQL
- **Render**: Built-in PostgreSQL service
- **Railway**: Built-in PostgreSQL service
- **Alternative**: Supabase, Neon, or any PostgreSQL provider

### Cache: Redis
- **Render**: Built-in Redis service
- **Railway**: Built-in Redis service
- **Alternative**: Upstash Redis, Redis Cloud

### Email Service
- **Recommended**: SendGrid, Mailgun, or Gmail SMTP
- Set up SMTP credentials in environment variables

### Image Storage: Cloudinary
- Sign up at [cloudinary.com](https://cloudinary.com)
- Get cloud name, API key, and API secret
- Set in environment variables

### Payment Processing: Stripe
- Sign up at [stripe.com](https://stripe.com)
- Get publishable and secret keys
- Set up webhook endpoint for payment notifications

## Environment Variables Reference

### Backend (.env)
```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Cache
REDIS_URL="redis://user:password@host:port"

# Authentication
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN="7d"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Application
PORT=10000
FRONTEND_URL="https://your-frontend-url.com"
PARTNER_URL="https://your-partner-url.com"
```

### Frontend (.env)
```bash
VITE_API_URL="https://your-backend-url.com/api"
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable"
```

### Partner Portal (.env)
```bash
VITE_API_URL="https://your-backend-url.com/api"
```

## Database Migrations

After deployment, run database migrations:

```bash
# For Render.com
render run --service lsdn-backend --command "npm run migrate"

# For Railway
railway run --service lsdn-backend --command "npm run migrate"

# Or manually via SSH/Console
npm run migrate
```

## SSL and Custom Domains

### Render.com
- SSL is automatically provided
- Add custom domain in service settings

### Railway
- SSL is automatically provided
- Add custom domain in project settings

### Vercel
- SSL is automatically provided
- Add custom domain in project settings

## Monitoring and Logs

### Render.com
- View logs in service dashboard
- Set up alerts for uptime monitoring
- Monitor database performance

### Railway
- View logs in service dashboard
- Set up alerts and monitoring
- Monitor resource usage

## Scaling Considerations

### Database Scaling
- Monitor connection limits
- Consider read replicas for high traffic
- Optimize queries and add indexes

### Cache Scaling
- Monitor Redis memory usage
- Consider larger Redis instances
- Implement cache invalidation strategies

### Application Scaling
- Monitor response times
- Scale horizontally with multiple instances
- Implement load balancing

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Check spelling and case sensitivity
   - Restart services after adding variables

2. **Database Connection Issues**
   - Verify connection string format
   - Check firewall and network settings
   - Ensure database is running

3. **CORS Errors**
   - Verify FRONTEND_URL and PARTNER_URL settings
   - Check CORS configuration in backend

4. **Stripe Integration Issues**
   - Verify webhook endpoint URL
   - Check webhook secret
   - Ensure test mode vs live mode consistency

### Debugging

1. **Check Logs**
   - View service logs in dashboard
   - Look for error messages and stack traces

2. **Test Endpoints**
   - Use curl or Postman to test API endpoints
   - Verify database connectivity

3. **Monitor Performance**
   - Check response times
   - Monitor resource usage
   - Identify bottlenecks

## Security Best Practices

1. **Environment Variables**
   - Never commit secrets to repository
   - Use strong, unique secrets
   - Rotate secrets regularly

2. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Limit database access

3. **API Security**
   - Implement rate limiting
   - Use HTTPS only
   - Validate all inputs

4. **Monitoring**
   - Set up alerts for suspicious activity
   - Monitor failed login attempts
   - Track API usage patterns

## Cost Optimization

### Free Tiers
- Render.com: Free PostgreSQL and Redis
- Railway: Free PostgreSQL and Redis
- Vercel: Free static hosting

### Paid Services
- Monitor usage to avoid unexpected charges
- Scale down when not needed
- Use reserved instances for predictable workloads

## Support

For deployment issues:
1. Check platform documentation
2. Review logs for error details
3. Verify environment configuration
4. Test locally before deploying

For application issues:
1. Check API endpoints
2. Verify database connectivity
3. Test with sample data
4. Review error handling