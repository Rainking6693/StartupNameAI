#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

/**
 * Comprehensive SEO validation for prerendered static files
 */
class SEOValidator {
  constructor(buildDir = 'build') {
    this.buildDir = buildDir;
    this.errors = [];
    this.warnings = [];
    this.validatedPages = [];
  }

  /**
   * Validate all HTML files in build directory
   */
  async validateAll() {
    console.log('🔍 Starting comprehensive SEO validation...\n');
    
    const htmlFiles = this.findHtmlFiles(this.buildDir);
    
    for (const filePath of htmlFiles) {
      await this.validateFile(filePath);
    }
    
    this.printResults();
    return this.errors.length === 0;
  }

  /**
   * Find all HTML files in build directory
   */
  findHtmlFiles(dir) {
    const htmlFiles = [];
    
    const scanDir = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'static') {
          scanDir(fullPath);
        } else if (item.endsWith('.html')) {
          htmlFiles.push(fullPath);
        }
      }
    };
    
    scanDir(dir);
    return htmlFiles;
  }

  /**
   * Validate individual HTML file
   */
  async validateFile(filePath) {
    const relativePath = path.relative(this.buildDir, filePath);
    console.log(`📄 Validating: ${relativePath}`);
    
    try {
      const html = fs.readFileSync(filePath, 'utf8');
      const dom = new JSDOM(html);
      const document = dom.window.document;
      
      const pageData = {
        path: relativePath,
        url: this.getUrlFromPath(relativePath),
        title: document.title,
        metaDescription: this.getMetaContent(document, 'description'),
        canonical: this.getCanonical(document),
        ogTitle: this.getMetaProperty(document, 'og:title'),
        ogDescription: this.getMetaProperty(document, 'og:description'),
        ogImage: this.getMetaProperty(document, 'og:image'),
        twitterCard: this.getMetaContent(document, 'twitter:card'),
        lang: document.documentElement.getAttribute('lang'),
        h1Count: document.querySelectorAll('h1').length,
        images: this.validateImages(document),
        jsonLd: this.validateJsonLd(document, relativePath),
        performance: this.validatePerformance(html),
        accessibility: this.validateAccessibility(document)
      };
      
      this.validatePageSEO(pageData);
      this.validatedPages.push(pageData);
      
    } catch (error) {
      this.addError(relativePath, `File validation failed: ${error.message}`);
    }
  }

  /**
   * Get URL from file path
   */
  getUrlFromPath(filePath) {
    if (filePath === 'index.html') return '/';
    return '/' + filePath.replace('/index.html', '').replace('.html', '') + '/';
  }

  /**
   * Get meta tag content
   */
  getMetaContent(document, name) {
    const meta = document.querySelector(`meta[name="${name}"]`);
    return meta ? meta.getAttribute('content') : null;
  }

  /**
   * Get meta property content (for Open Graph)
   */
  getMetaProperty(document, property) {
    const meta = document.querySelector(`meta[property="${property}"]`);
    return meta ? meta.getAttribute('content') : null;
  }

  /**
   * Get canonical URL
   */
  getCanonical(document) {
    const canonical = document.querySelector('link[rel="canonical"]');
    return canonical ? canonical.getAttribute('href') : null;
  }

  /**
   * Validate page SEO elements
   */
  validatePageSEO(pageData) {
    const { path } = pageData;

    // Title validation
    if (!pageData.title) {
      this.addError(path, 'Missing title tag');
    } else if (pageData.title.length < 30) {
      this.addWarning(path, `Title too short (${pageData.title.length} chars): "${pageData.title}"`);
    } else if (pageData.title.length > 60) {
      this.addWarning(path, `Title too long (${pageData.title.length} chars): "${pageData.title}"`);
    }

    // Meta description validation
    if (!pageData.metaDescription) {
      this.addError(path, 'Missing meta description');
    } else if (pageData.metaDescription.length < 120) {
      this.addWarning(path, `Meta description too short (${pageData.metaDescription.length} chars)`);
    } else if (pageData.metaDescription.length > 160) {
      this.addWarning(path, `Meta description too long (${pageData.metaDescription.length} chars)`);
    }

    // Canonical URL validation
    if (!pageData.canonical) {
      this.addError(path, 'Missing canonical URL');
    } else if (!pageData.canonical.startsWith('https://')) {
      this.addWarning(path, 'Canonical URL should use HTTPS');
    }

    // Open Graph validation
    if (!pageData.ogTitle) {
      this.addError(path, 'Missing og:title');
    }
    if (!pageData.ogDescription) {
      this.addError(path, 'Missing og:description');
    }
    if (!pageData.ogImage) {
      this.addError(path, 'Missing og:image');
    }

    // Twitter Card validation
    if (!pageData.twitterCard) {
      this.addWarning(path, 'Missing Twitter Card meta tag');
    }

    // Language attribute
    if (!pageData.lang) {
      this.addError(path, 'Missing lang attribute on html element');
    }

    // H1 validation
    if (pageData.h1Count === 0) {
      this.addError(path, 'Missing h1 tag');
    } else if (pageData.h1Count > 1) {
      this.addWarning(path, `Multiple h1 tags found (${pageData.h1Count})`);
    }

    // Image validation
    pageData.images.missingAlt.forEach(img => {
      this.addWarning(path, `Image missing alt attribute: ${img}`);
    });

    // JSON-LD validation
    if (pageData.jsonLd.errors.length > 0) {
      pageData.jsonLd.errors.forEach(error => {
        this.addError(path, `JSON-LD error: ${error}`);
      });
    }
  }

  /**
   * Validate images
   */
  validateImages(document) {
    const images = document.querySelectorAll('img');
    const missingAlt = [];
    const missingDimensions = [];
    
    images.forEach(img => {
      const src = img.getAttribute('src');
      const alt = img.getAttribute('alt');
      const width = img.getAttribute('width');
      const height = img.getAttribute('height');
      
      if (alt === null) {
        missingAlt.push(src || 'unknown');
      }
      
      if (!width || !height) {
        missingDimensions.push(src || 'unknown');
      }
    });
    
    return {
      total: images.length,
      missingAlt,
      missingDimensions
    };
  }

  /**
   * Validate JSON-LD structured data
   */
  validateJsonLd(document, path) {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const errors = [];
    const schemas = [];
    
    scripts.forEach((script, index) => {
      try {
        const content = script.textContent.trim();
        const data = JSON.parse(content);
        schemas.push(data);
        
        // Basic schema validation
        if (!data['@context']) {
          errors.push(`Schema ${index + 1}: Missing @context`);
        }
        if (!data['@type']) {
          errors.push(`Schema ${index + 1}: Missing @type`);
        }
        
        // Validate specific schema types
        if (data['@type'] === 'WebSite') {
          if (!data.name) errors.push(`Schema ${index + 1}: WebSite missing name`);
          if (!data.url) errors.push(`Schema ${index + 1}: WebSite missing url`);
        }
        
        if (data['@type'] === 'Organization') {
          if (!data.name) errors.push(`Schema ${index + 1}: Organization missing name`);
          if (!data.url) errors.push(`Schema ${index + 1}: Organization missing url`);
        }
        
      } catch (error) {
        errors.push(`Schema ${index + 1}: Invalid JSON - ${error.message}`);
      }
    });
    
    return { schemas, errors };
  }

  /**
   * Validate performance-related elements
   */
  validatePerformance(html) {
    const issues = [];
    
    // Check for render-blocking resources
    if (html.includes('<script src=') && !html.includes('defer') && !html.includes('async')) {
      issues.push('Potential render-blocking JavaScript detected');
    }
    
    // Check for inline styles (should be minimal)
    const inlineStyleMatches = html.match(/<style[^>]*>[\s\S]*?<\/style>/gi);
    if (inlineStyleMatches && inlineStyleMatches.some(match => match.length > 1000)) {
      issues.push('Large inline styles detected (>1KB)');
    }
    
    // Check for preload hints
    if (!html.includes('rel="preload"') && html.includes('.woff')) {
      issues.push('Consider preloading critical fonts');
    }
    
    return { issues };
  }

  /**
   * Validate accessibility elements
   */
  validateAccessibility(document) {
    const issues = [];
    
    // Check for skip links
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    const hasSkipToContent = Array.from(skipLinks).some(link => 
      link.textContent.toLowerCase().includes('skip')
    );
    
    if (!hasSkipToContent) {
      issues.push('Consider adding skip to content link');
    }
    
    // Check heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > previousLevel + 1) {
        issues.push(`Heading hierarchy skip: ${heading.tagName} after h${previousLevel}`);
      }
      previousLevel = level;
    });
    
    // Check for ARIA landmarks
    const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], main, nav, header');
    if (landmarks.length === 0) {
      issues.push('No ARIA landmarks or semantic HTML5 elements found');
    }
    
    return { issues };
  }

  /**
   * Add error to results
   */
  addError(path, message) {
    this.errors.push({ path, message, type: 'error' });
  }

  /**
   * Add warning to results
   */
  addWarning(path, message) {
    this.warnings.push({ path, message, type: 'warning' });
  }

  /**
   * Print validation results
   */
  printResults() {
    console.log('\n📊 SEO Validation Results');
    console.log('========================\n');
    
    console.log(`📄 Pages validated: ${this.validatedPages.length}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}\n`);
    
    if (this.errors.length > 0) {
      console.log('🚨 ERRORS (Must Fix):');
      this.errors.forEach(error => {
        console.log(`   ${error.path}: ${error.message}`);
      });
      console.log('');
    }
    
    if (this.warnings.length > 0) {
      console.log('⚠️  WARNINGS (Should Fix):');
      this.warnings.forEach(warning => {
        console.log(`   ${warning.path}: ${warning.message}`);
      });
      console.log('');
    }
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All SEO validation checks passed!');
    }
    
    // Generate summary report
    this.generateReport();
  }

  /**
   * Generate detailed report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        pagesValidated: this.validatedPages.length,
        errors: this.errors.length,
        warnings: this.warnings.length,
        passed: this.errors.length === 0
      },
      pages: this.validatedPages,
      errors: this.errors,
      warnings: this.warnings
    };
    
    fs.writeFileSync('seo-validation-report.json', JSON.stringify(report, null, 2));
    console.log('📋 Detailed report saved to: seo-validation-report.json\n');
  }
}

// Run validation if called directly
if (require.main === module) {
  const buildDir = process.argv[2] || 'build';
  
  if (!fs.existsSync(buildDir)) {
    console.error(`❌ Build directory '${buildDir}' not found`);
    process.exit(1);
  }
  
  const validator = new SEOValidator(buildDir);
  validator.validateAll().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  });
}

module.exports = SEOValidator;