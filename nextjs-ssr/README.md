# StartupNamer.org - Next.js SSR Version

This is the server-side rendered version of StartupNamer.org built with Next.js to solve critical SEO issues and improve search engine crawlability.

## 🚀 Key Features

- **Server-Side Rendering (SSR)** - All pages are rendered on the server for optimal SEO
- **Dynamic Sitemap Generation** - Automatically generated sitemap.xml with all routes
- **Proper Robots.txt** - SEO-friendly robots.txt with crawling permissions
- **Industry-Specific Pages** - Dedicated pages for different startup categories
- **Performance Optimized** - Built with Next.js 14 and optimized for Core Web Vitals
- **Netlify Ready** - Configured for seamless Netlify deployment

## 📁 Project Structure

```
nextjs-ssr/
├── pages/
│   ├── api/
│   │   ├── robots.js          # Dynamic robots.txt generation
│   │   └── sitemap.js         # Dynamic sitemap.xml generation
│   ├── _app.js               # Global app configuration
│   ├── index.js              # Homepage with SSR
│   ├── naming-tool.js        # Main naming tool page
│   ├── features.js           # Features page
│   ├── tech-startup-names.js # Tech industry names page
│   └── [more pages...]
├── components/
│   ├── Layout.js             # Global layout wrapper
│   ├── Header.js             # Site header
│   └── Footer.js             # Site footer
├── styles/
│   └── globals.css           # Global styles with Tailwind
├── public/
│   └── [static assets]
├── next.config.js            # Next.js configuration
├── netlify.toml             # Netlify deployment config
└── package.json
```

## 🛠 Installation & Setup

1. **Install Dependencies**
   ```bash
   cd nextjs-ssr
   npm install
   ```

2. **Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

3. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## 🌐 Deployment

### Netlify Deployment (Recommended)

1. **Connect Repository**
   - Connect your GitHub repository to Netlify
   - Set build directory to `nextjs-ssr`

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `20`

3. **Environment Variables**
   Set the following environment variables in Netlify:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_SITE_URL=https://startupnamer.org
   NEXT_PUBLIC_GA_ID=your-ga-id (optional)
   ```

4. **Deploy**
   The `netlify.toml` file contains all necessary configuration for:
   - Next.js serverless functions
   - Redirects and rewrites
   - Security headers
   - Caching policies

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🔍 SEO Features

### Server-Side Rendering
- All pages are rendered on the server
- Meta tags, Open Graph, and Twitter Cards are server-rendered
- JSON-LD structured data included on all pages

### Dynamic Sitemap
- Available at `/sitemap.xml`
- Automatically includes all static routes
- Updates lastmod dates dynamically
- Proper priority and changefreq settings

### Robots.txt
- Available at `/robots.txt`
- Allows crawling of important pages
- Disallows admin and API routes
- References sitemap location

### Industry-Specific Pages
Each industry page includes:
- Targeted SEO content
- Industry-specific keywords
- Example names and categories
- Internal linking structure

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Custom Components** - Reusable UI components
- **Responsive Design** - Mobile-first approach
- **Performance Optimized** - Minimal CSS bundle

## 📊 Analytics & Monitoring

- **Google Analytics** - Page view tracking
- **Vercel Analytics** - Performance monitoring
- **Speed Insights** - Core Web Vitals tracking
- **Error Boundary** - Error tracking and recovery

## 🔧 Configuration

### Next.js Config (`next.config.js`)
- Image optimization settings
- Security headers
- Redirects and rewrites
- Bundle analysis setup

### Netlify Config (`netlify.toml`)
- Build settings
- Function configuration
- Headers and redirects
- Plugin configuration

## 🚀 Performance Optimizations

- **Static Generation** where possible
- **Image Optimization** with Next.js Image component
- **Bundle Splitting** for optimal loading
- **Prefetching** for faster navigation
- **Compression** and minification
- **CDN Delivery** via Netlify

## 🔐 Security

- **Security Headers** - CSP, HSTS, X-Frame-Options
- **Input Sanitization** - XSS protection
- **Rate Limiting** - API protection
- **HTTPS Enforcement** - Secure connections only

## 📱 Mobile Optimization

- **Responsive Design** - Works on all screen sizes
- **Touch Friendly** - Optimized for mobile interactions
- **Fast Loading** - Optimized for mobile networks
- **PWA Ready** - Progressive Web App capabilities

## 🧪 Testing

Run tests locally:
```bash
npm test
```

## 📈 Migration from CRA

This Next.js version replaces the existing Create React App build to solve SEO issues:

1. **Server-Side Rendering** - Pages are now rendered on the server
2. **Better SEO** - Meta tags and structured data are server-rendered
3. **Improved Performance** - Better Core Web Vitals scores
4. **Enhanced Crawlability** - Search engines can properly index content

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Ensure Node.js version 18+ is installed
   - Clear `node_modules` and reinstall dependencies
   - Check for TypeScript errors if using TS

2. **Deployment Issues**
   - Verify environment variables are set
   - Check Netlify build logs for errors
   - Ensure `netlify.toml` is properly configured

3. **SEO Issues**
   - Verify meta tags are server-rendered (view page source)
   - Check sitemap.xml is accessible and valid
   - Ensure robots.txt allows crawling

## 📞 Support

For issues or questions:
- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Netlify deployment guides](https://docs.netlify.com/frameworks/next-js/)
- Contact the development team

## 📝 License

This project is part of the StartupNamer.org platform.