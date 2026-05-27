# 🚀 Deployment Guide - Pulse Music

Complete guide to deploy Pulse Music to production environments.

## Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Audio files uploaded
- [ ] Images optimized
- [ ] Supabase project created
- [ ] Database schema configured
- [ ] Storage buckets created
- [ ] Authentication configured
- [ ] Environment variables ready
- [ ] SSL certificate obtained
- [ ] Domain name purchased

## Option 1: Vercel (Recommended - Easiest)

### Setup
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd pulse-music
vercel deploy --prod
```

3. Configure environment:
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Features
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Auto-scaling
- ✅ Serverless functions (optional)
- ✅ 100 GB bandwidth/month free
- ✅ Custom domain support

### Cost
- Free tier: ~3-5 GB bandwidth
- Pro: $20/month
- Enterprise: Custom pricing

---

## Option 2: Netlify (Easy Alternative)

### Setup
1. Connect GitHub:
   - Push repo to GitHub
   - Go to netlify.com
   - Click "Connect from Git"
   - Select repository

2. Build settings:
   - Build command: (leave empty)
   - Publish directory: `.`

3. Deploy:
   - Click "Deploy site"

### Features
- ✅ Git integration
- ✅ Automatic deployments
- ✅ Form handling
- ✅ Functions support
- ✅ 100 GB bandwidth/month free
- ✅ 300 concurrent functions

### Cost
- Free tier: Perfect for this project
- Pro: $19/month
- Enterprise: Custom

---

## Option 3: GitHub Pages (Free Static)

### Setup
1. Create GitHub repository:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/pulse-music.git
git push -u origin main
```

2. Enable Pages:
   - Settings → Pages
   - Select `main` branch
   - Save

3. Configure domain (optional):
   - Add custom domain
   - Update DNS records

### Features
- ✅ Completely free
- ✅ No setup required
- ✅ Git-based deployment
- ✅ Custom domain support
- ✅ Unlimited bandwidth

### Limitations
- ❌ No backend functions
- ❌ No redirects
- ❌ Static only
- ❌ Longer caching

---

## Option 4: Traditional VPS (Advanced)

### Hosting Options
- AWS EC2
- DigitalOcean
- Linode
- Vultr
- Hetzner

### Setup on DigitalOcean (Example)

1. Create Droplet:
   - Ubuntu 20.04 LTS
   - $5/month basic plan
   - Add SSH key

2. SSH into server:
```bash
ssh root@your_server_ip
```

3. Install dependencies:
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
```

4. Clone repository:
```bash
cd /var/www
git clone https://github.com/username/pulse-music.git
cd pulse-music
```

5. Configure Nginx:
```nginx
server {
    listen 80;
    server_name your_domain.com;
    
    root /var/www/pulse-music;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

6. Enable HTTPS:
```bash
sudo certbot --nginx -d your_domain.com
```

7. Restart Nginx:
```bash
sudo systemctl restart nginx
```

### Cost
- DigitalOcean: $5-24/month
- Domain: $10-15/year
- SSL: Free (Let's Encrypt)

---

## Supabase Configuration

### 1. Create Project
- Go to https://supabase.com
- Sign up/login
- Create new project
- Wait for provisioning (5-10 min)

### 2. Database Setup
```sql
-- Run all SQL from DATABASE_SCHEMA.md
-- Go to SQL Editor in Supabase Dashboard
-- Create each table with provided SQL
```

### 3. Authentication
- Go to Authentication → Settings
- Enable Email auth
- Configure redirect URLs
- Set up email templates

### 4. Storage
- Create bucket: `audio-files`
- Create bucket: `images`
- Configure CORS
- Set policies

### 5. Configure App
Update `supabase.js`:
```javascript
const SUPABASE_URL = 'your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

---

## Environment Variables

### Production (.env.production)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=https://your-domain.com
VITE_APP_ENV=production
```

### Staging (.env.staging)
```
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=staging-anon-key
VITE_APP_URL=https://staging.your-domain.com
VITE_APP_ENV=staging
```

### Development (.env.local)
```
VITE_SUPABASE_URL=http://localhost:3000
VITE_SUPABASE_ANON_KEY=local-anon-key
VITE_APP_URL=http://localhost:8000
VITE_APP_ENV=development
```

---

## Performance Optimization

### Before Deployment

#### 1. Minify Code
```bash
# Using terser
npm install -g terser
terser app.js -o app.min.js -c -m
```

#### 2. Optimize Images
```bash
# Using ImageMagick
convert image.jpg -quality 85 image-optimized.jpg
```

#### 3. Enable Gzip
In Nginx config:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
gzip_vary on;
```

#### 4. Cache Configuration
```nginx
# Cache static assets
location ~* \.(js|css|png|jpg|gif|ico)$ {
    expires 365d;
    add_header Cache-Control "public, immutable";
}

# Don't cache HTML
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-store, no-cache, must-revalidate, max-age=0";
}
```

### Performance Metrics
- Page Load: < 2s
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: 90+

---

## SSL/TLS Certificate

### Free Option: Let's Encrypt
```bash
sudo apt install certbot
sudo certbot certonly --standalone -d your-domain.com
```

### Auto-Renewal
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Paid Option: Cloudflare
- Go to cloudflare.com
- Add domain
- Update nameservers
- Enable Flexible SSL
- Enable Auto HTTPS rewrites

---

## Domain Setup

### DNS Configuration

#### Vercel/Netlify
```
CNAME: your-domain.com → your-site.vercel.app
```

#### Traditional Server
```
A Record: @ → your.server.ip
CNAME: www → @ (or your.server.ip)
MX Records: (if using email)
```

#### Cloudflare
```
A Record: @ → your.server.ip
CNAME: www → @ 
```

---

## Monitoring & Logging

### Application Monitoring
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Datadog** - Performance monitoring

### Setup Sentry
```javascript
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});
```

### Server Monitoring
- **Uptime Robot** - Uptime monitoring
- **StatusPage.io** - Status page
- **PagerDuty** - Alerting

---

## Database Backups

### Automatic Backups (Supabase)
- Daily backups included
- 7-day retention
- 1-click restore

### Manual Backup
```bash
pg_dump -h your-server.supabase.co -U postgres dbname > backup.sql
```

### Backup Location
- Store in AWS S3
- Store in Google Cloud Storage
- Store in Azure Backup
- Local encrypted backup

---

## SSL Labs Report

Visit https://www.ssllabs.com/ssltest/ to check SSL configuration.

Target: **A+ Rating**
- ✅ TLS 1.2+
- ✅ Strong ciphers
- ✅ HSTS enabled
- ✅ No weak protocols

---

## Load Testing

Before launch, test with:

### Apache Bench
```bash
ab -n 10000 -c 100 https://your-domain.com
```

### Locust
```bash
locust -f locustfile.py --host=https://your-domain.com
```

### Expected Results
- Requests per second: 1000+
- P95 latency: < 500ms
- Error rate: < 0.1%

---

## Launch Checklist

- [ ] Vercel/Netlify deployed
- [ ] Custom domain configured
- [ ] SSL certificate installed
- [ ] HTTPS redirect enabled
- [ ] Supabase configured
- [ ] Database backup scheduled
- [ ] Monitoring set up
- [ ] Error tracking enabled
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] CDN configured
- [ ] Cache headers set
- [ ] Sitemap created
- [ ] Analytics installed
- [ ] Email configured
- [ ] Backup tested
- [ ] Launch announced
- [ ] Monitoring active

---

## Post-Launch

### Day 1
- Monitor error logs
- Check performance metrics
- Test core features
- Gather user feedback

### Week 1
- Fix reported bugs
- Optimize slow queries
- Update analytics
- Share update

### Month 1
- Review metrics
- Plan v2.0 features
- Gather feature requests
- Improve UX based on data

---

## Scaling Considerations

### Database
- Consider Supabase scaling
- Set up read replicas
- Implement caching layer
- Monitor query performance

### Storage
- Use CDN for audio files
- Implement S3 for backups
- Consider compression
- Monitor usage

### Traffic
- Implement load balancing
- Use auto-scaling
- Monitor concurrent users
- Plan capacity

### Infrastructure
- Consider Kubernetes
- Implement microservices
- Use containerization
- Plan for 10x growth

---

## Troubleshooting

### Deployment Issues
**Problem**: Deploy fails with "Cannot find module"
**Solution**: 
- Check all imports
- Verify file paths
- Clear node_modules
- Reinstall dependencies

**Problem**: CORS errors
**Solution**:
- Configure CORS headers
- Check Supabase CORS
- Update authentication
- Test with curl

**Problem**: Audio won't play in production
**Solution**:
- Verify HTTPS
- Check CORS headers
- Test audio format
- Check CDN configuration

---

## Support & Monitoring

### Helpful Tools
- **Uptime Robot** - Status monitoring
- **Pingdom** - Performance monitoring
- **StatusPage** - Public status page
- **Better Stack** - Alerts and logs

### Contact Support
- Supabase: support@supabase.io
- Vercel: support.vercel.com
- Netlify: support@netlify.com

---

## Congratulations! 🎉

Your Pulse Music platform is now live and serving users!

**Next Steps:**
1. Share with friends
2. Gather feedback
3. Plan v2.0 features
4. Monitor analytics
5. Celebrate success! 🎵

---

For more help, visit:
- Documentation: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com

**Happy streaming! 🎧**
