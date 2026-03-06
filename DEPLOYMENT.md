# 🚀 DEPLOYMENT GUIDE

Complete guide for deploying your AI Skin Analysis app to production.

## Table of Contents
1. [Backend Deployment](#backend-deployment)
2. [Frontend Deployment](#frontend-deployment)
3. [Environment Variables](#environment-variables)
4. [SSL/HTTPS Setup](#sslhttps-setup)
5. [Post-Deployment](#post-deployment)

---

## Backend Deployment

### Option 1: Railway (Recommended - Easy)

1. **Create account at [Railway.app](https://railway.app/)**

2. **Connect your GitHub repository**

3. **Deploy:**
   ```bash
   # In your backend folder
   railway up
   ```

4. **Set environment variables in Railway dashboard:**
   ```
   ANTHROPIC_API_KEY=your_key
   NODE_ENV=production
   ```

5. **Get your backend URL:** `https://your-app.up.railway.app`

### Option 2: Render

1. **Create account at [Render.com](https://render.com/)**

2. **New Web Service → Connect Repository**

3. **Settings:**
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment Variables:
     ```
     ANTHROPIC_API_KEY=your_key
     NODE_ENV=production
     ```

4. **Deploy!**

### Option 3: Heroku

1. **Install Heroku CLI**

2. **Create Procfile in backend folder:**
   ```
   web: node server.js
   ```

3. **Deploy:**
   ```bash
   heroku login
   heroku create your-app-name
   heroku config:set ANTHROPIC_API_KEY=your_key
   git push heroku main
   ```

---

## Frontend Deployment

### Option 1: Vercel (Recommended - Easy)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **In frontend folder:**
   ```bash
   # Build first
   npm run build
   
   # Deploy
   vercel --prod
   ```

3. **Set environment variable in Vercel dashboard:**
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **In frontend folder:**
   ```bash
   # Build
   npm run build
   
   # Deploy
   netlify deploy --prod --dir=build
   ```

3. **Set environment variable:**
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```

### Option 3: GitHub Pages

1. **Add to package.json:**
   ```json
   "homepage": "https://yourusername.github.io/ai-skin-analysis"
   ```

2. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add deploy scripts to package.json:**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

---

## Environment Variables

### Backend (.env)
```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
PORT=5000
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend-url.com
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.com
```

---

## SSL/HTTPS Setup

**IMPORTANT:** Camera access requires HTTPS in production!

### For Vercel/Netlify/Railway:
✅ SSL is automatic - nothing to do!

### For Custom Server:
1. Get free SSL from [Let's Encrypt](https://letsencrypt.org/)
2. Use [Certbot](https://certbot.eff.org/) for auto-renewal
3. Configure your web server (Nginx/Apache)

---

## Post-Deployment Checklist

### Backend Testing
```bash
# Test health endpoint
curl https://your-backend-url.com/health

# Test analysis (with a test image)
curl -X POST https://your-backend-url.com/api/analyze \
  -F "image=@test.jpg"
```

### Frontend Testing
1. ✅ Open your frontend URL
2. ✅ Allow camera permissions
3. ✅ Capture test photo
4. ✅ Verify analysis works
5. ✅ Check all features work
6. ✅ Test on mobile device

### Performance Optimization

1. **Enable Compression** (backend)
   Already included in server.js ✅

2. **Enable Caching** (frontend)
   Add to build:
   ```javascript
   // In index.html
   <link rel="preconnect" href="https://your-backend-url.com">
   ```

3. **Monitor Performance**
   - Use [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)
   - Check loading times
   - Optimize images if needed

### Security Checklist

- ✅ HTTPS enabled
- ✅ Environment variables secured
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ File size limits set
- ✅ File type validation active

---

## Monitoring & Maintenance

### Logs
```bash
# Railway
railway logs

# Heroku
heroku logs --tail

# Render
Check dashboard
```

### Uptime Monitoring
- Use [UptimeRobot](https://uptimerobot.com/) (free)
- Set up alerts for downtime

### API Key Management
- Rotate Anthropic API key quarterly
- Monitor usage in Anthropic dashboard
- Set up budget alerts

---

## Troubleshooting

### Camera Not Working
❌ **Problem:** Camera blocked in production  
✅ **Solution:** Ensure HTTPS is enabled

### CORS Errors
❌ **Problem:** Frontend can't reach backend  
✅ **Solution:** Add frontend URL to ALLOWED_ORIGINS

### High API Costs
❌ **Problem:** Too many API calls  
✅ **Solution:** Implement rate limiting, caching

### Slow Performance
❌ **Problem:** Analysis takes too long  
✅ **Solution:** 
- Optimize image size before upload
- Use CDN for static files
- Enable backend compression

---

## Cost Estimates

### Anthropic API
- ~$0.015 per analysis (using Claude Sonnet 4)
- 1000 analyses = ~$15

### Hosting
- **Railway:** Free tier, then $5/month
- **Vercel:** Free tier available
- **Netlify:** Free tier available

**Total:** ~$5-20/month for moderate usage

---

## Scaling

### For High Traffic:

1. **Add Redis Caching**
   - Cache analysis results
   - Reduce API calls

2. **Use CDN**
   - CloudFlare (free tier)
   - Serve static assets faster

3. **Database**
   - Store user history
   - Track usage patterns

4. **Load Balancer**
   - Multiple backend instances
   - Better availability

---

## Support

For deployment issues:
- Check provider's documentation
- Review error logs carefully
- Ensure all environment variables are set
- Test locally first

**Good luck with your deployment! 🚀**
