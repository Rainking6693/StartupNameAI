# StartupnameAI Deployment Checklist & Performance Optimization Guide

## 🚀 Pre-Deployment Verification

### ✅ Code Quality & Security
- [ ] All security headers configured in `netlify.toml`
- [ ] CSP (Content Security Policy) properly configured
- [ ] Rate limiting implemented on all API endpoints
- [ ] Input validation implemented using `express-validator`
- [ ] Error handling middleware properly configured
- [ ] Logging configured with Winston
- [ ] No sensitive data in client-side code
- [ ] Environment variables properly configured

### ✅ Performance Optimization
- [ ] React-snap prerendering configured and working
- [ ] Edge Functions deployed for bot detection
- [ ] Performance optimization edge function deployed
- [ ] Web Vitals collection implemented
- [ ] Compression enabled (Brotli + Gzip)
- [ ] Static asset caching configured (1 year for immutable assets)
- [ ] HTML caching configured (60s with stale-while-revalidate)
- [ ] Font preloading configured
- [ ] Critical CSS inlined
- [ ] Images optimized and WebP supported

### ✅ Database & Backend
- [ ] PostgreSQL database provisioned
- [ ] Database schema deployed (`server/config/database.sql`)
- [ ] Connection pooling configured
- [ ] Database indexes created for performance
- [ ] API endpoints tested and functional
- [ ] Rate limiting configured per endpoint
- [ ] Health check endpoints working
- [ ] Monitoring endpoints configured

### ✅ Frontend Build
- [ ] `npm run build:snap` completed successfully
- [ ] All prerendered pages generated
- [ ] Service worker configured (if applicable)
- [ ] Web Vitals integration tested
- [ ] Error boundary implemented
- [ ] Loading states implemented
- [ ] 404 error page configured

### ✅ Netlify Configuration
- [ ] `netlify.toml` properly configured
- [ ] Edge Functions deployed
- [ ] Build command configured: `npm install && npm run build:snap`
- [ ] Publish directory set to `build/`
- [ ] Environment variables configured
- [ ] Redirects configured for SPA routing
- [ ] Headers configured for performance and security

## 🛠️ Environment Variables Setup

### Required Environment Variables

#### Server (.env):
```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production

# API Keys
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# CORS & Security
CORS_ORIGIN=https://startupnamer.org,https://www.startupnamer.org
JWT_SECRET=your_jwt_secret_key

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
AI_RATE_LIMIT_WINDOW=15
AI_RATE_LIMIT_MAX=10

# Logging
LOG_LEVEL=info

# Email (if used)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

#### Netlify Environment Variables:
```bash
# Build Configuration  
NODE_VERSION=18
NPM_VERSION=9
CI=false
GENERATE_SOURCEMAP=false
REACT_SNAP=true

# API Configuration (if needed)
REACT_APP_API_URL=https://your-api-domain.com
```

## 📊 Performance Targets

### Core Web Vitals Goals:
- **LCP (Largest Contentful Paint)**: ≤ 2.5s (75th percentile)
- **INP (Interaction to Next Paint)**: ≤ 200ms (75th percentile) 
- **CLS (Cumulative Layout Shift)**: ≤ 0.1 (75th percentile)

### Additional Performance Metrics:
- **FCP (First Contentful Paint)**: ≤ 1.8s
- **TTFB (Time to First Byte)**: ≤ 800ms
- **Speed Index**: ≤ 3.4s
- **Total Blocking Time**: ≤ 200ms

## 🔧 Post-Deployment Verification

### ✅ Performance Testing
- [ ] Run Lighthouse audit (aim for 90+ performance score)
- [ ] Test Core Web Vitals with PageSpeed Insights
- [ ] Verify prerendering working for bots
- [ ] Test edge functions functionality
- [ ] Verify Web Vitals collection endpoint
- [ ] Check compression is working (Brotli/Gzip)
- [ ] Verify static asset caching headers

### ✅ Security Testing
- [ ] Test security headers with securityheaders.com (aim for A+)
- [ ] Verify CSP is working (no console errors)
- [ ] Test rate limiting on API endpoints
- [ ] Verify CORS configuration
- [ ] Test input validation on all endpoints
- [ ] Check for exposed sensitive information

### ✅ Functionality Testing
- [ ] Test all main user flows
- [ ] Verify prerendered pages load correctly
- [ ] Test API endpoints with different payloads
- [ ] Verify error handling works correctly
- [ ] Test mobile responsiveness
- [ ] Verify SEO meta tags are correct
- [ ] Test social media sharing

### ✅ Monitoring Setup
- [ ] Web Vitals monitoring active
- [ ] Performance alerts configured
- [ ] Error tracking implemented
- [ ] Uptime monitoring configured
- [ ] Database performance monitoring
- [ ] API response time monitoring

## 🚨 Critical Performance Alerts

Configure alerts for these thresholds:

### Core Web Vitals Alerts:
- **LCP > 4000ms**: Critical alert
- **LCP > 2500ms**: Warning alert
- **INP > 500ms**: Critical alert  
- **INP > 200ms**: Warning alert
- **CLS > 0.25**: Critical alert
- **CLS > 0.1**: Warning alert

### System Alerts:
- **API Response Time > 5000ms**: Critical
- **API Response Time > 1000ms**: Warning
- **Error Rate > 5%**: Critical
- **Error Rate > 1%**: Warning
- **Database Connection Issues**: Critical
- **Memory Usage > 90%**: Critical

## 🧪 Testing Commands

### Performance Testing:
```bash
# Run Lighthouse CI
npx lighthouse https://your-domain.com --output=json --output=html

# Test Web Vitals
npx web-vitals-cli https://your-domain.com

# Test prerendering
curl -H "User-Agent: Googlebot" https://your-domain.com/pricing
```

### API Testing:
```bash
# Test health endpoint
curl https://your-api-domain.com/api/health

# Test vitals endpoint
curl -X POST https://your-api-domain.com/api/vitals \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","metrics":{"LCP":1500}}'

# Test rate limiting
for i in {1..20}; do curl https://your-api-domain.com/api/names/generate; done
```

### Security Testing:
```bash
# Test security headers
curl -I https://your-domain.com

# Test CSP
# Check browser console for CSP violations

# Test CORS
curl -H "Origin: https://malicious-site.com" https://your-api-domain.com/api/health
```

## 📈 Performance Optimization Checklist

### Frontend Optimizations:
- [x] React-snap prerendering for SEO
- [x] Edge Functions for bot detection
- [x] Web Vitals monitoring
- [x] Critical resource preloading
- [x] Image optimization and lazy loading
- [x] Font optimization and preloading
- [x] CSS and JS minification
- [x] Compression (Brotli + Gzip)
- [x] Service Worker caching (if implemented)

### Backend Optimizations:
- [x] Database connection pooling
- [x] Response compression
- [x] API rate limiting
- [x] Database indexing
- [x] Query optimization
- [x] Error handling and logging
- [x] Health check endpoints
- [x] Performance monitoring

### CDN & Caching:
- [x] Static asset caching (1 year)
- [x] HTML caching with revalidation
- [x] Font caching (30 days)
- [x] API response caching policies
- [x] ETags for cache validation
- [x] Vary headers for compression

## 🔍 Monitoring Dashboard

Access performance data via:
- **Dashboard**: `GET /api/monitoring/dashboard?period=24h`
- **Alerts**: `GET /api/monitoring/alerts?status=open`
- **Health**: `GET /api/monitoring/health`
- **Real-time Metrics**: `GET /api/monitoring/metrics`

## 🚀 Deployment Command

```bash
# Build and deploy
cd client
npm install
npm run build:snap

# Verify build
ls -la build/
ls -la build/static/

# Deploy to Netlify
netlify deploy --prod --dir=build
```

## 📋 Success Criteria

### Performance:
- ✅ Lighthouse score ≥ 90
- ✅ Core Web Vitals in "Good" range
- ✅ PageSpeed Insights score ≥ 90
- ✅ GTmetrix grade A or B

### Security:
- ✅ Security headers grade A+
- ✅ No CSP violations
- ✅ SSL Labs score A+
- ✅ No exposed sensitive data

### Functionality:
- ✅ All user flows working
- ✅ Mobile responsive
- ✅ SEO meta tags correct
- ✅ Error handling working
- ✅ API endpoints responsive

### Monitoring:
- ✅ Web Vitals collection active
- ✅ Performance alerts configured
- ✅ Error tracking working
- ✅ Uptime monitoring active

## 🆘 Rollback Plan

If issues are detected post-deployment:

1. **Immediate**: Revert to previous Netlify deployment
2. **API Issues**: Scale down problematic endpoints
3. **Database Issues**: Check connection pooling and queries
4. **Performance Issues**: Disable non-critical features
5. **Security Issues**: Immediately patch and redeploy

## 📞 Support Contacts

- **Performance Issues**: Check `/api/monitoring/dashboard`
- **API Issues**: Check `/api/health` and logs
- **Database Issues**: Check connection pooling status
- **CDN Issues**: Check Netlify dashboard
- **Security Issues**: Review security headers and logs

---

**Last Updated**: August 30, 2024
**Version**: 1.0.0
**Environment**: Production Ready