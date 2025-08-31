#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * HTML validation using multiple validators
 */
class HTMLValidator {
  constructor(buildDir = 'build') {
    this.buildDir = buildDir;
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validate all HTML files
   */
  async validateAll() {
    console.log('🔍 Starting HTML validation...\n');
    
    const htmlFiles = this.findHtmlFiles(this.buildDir);
    
    for (const filePath of htmlFiles) {
      await this.validateFile(filePath);
    }
    
    this.printResults();
    return this.errors.length === 0;
  }

  /**
   * Find all HTML files
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
   * Validate single HTML file
   */
  async validateFile(filePath) {
    const relativePath = path.relative(this.buildDir, filePath);
    console.log(`📄 Validating HTML: ${relativePath}`);
    
    try {
      // Basic HTML structure validation
      await this.validateBasicStructure(filePath, relativePath);
      
      // W3C HTML validation (if available)
      try {
        await this.validateWithW3C(filePath, relativePath);
      } catch (error) {
        console.log(`   ⚠️  W3C validation skipped: ${error.message}`);
      }
      
      // Custom HTML validation
      await this.validateCustomRules(filePath, relativePath);
      
    } catch (error) {
      this.addError(relativePath, `File validation failed: ${error.message}`);
    }
  }

  /**
   * Validate basic HTML structure
   */
  async validateBasicStructure(filePath, relativePath) {
    const html = fs.readFileSync(filePath, 'utf8');
    
    // Check for basic HTML structure
    if (!html.includes('<!DOCTYPE html>') && !html.includes('<!doctype html>')) {
      this.addError(relativePath, 'Missing DOCTYPE declaration');
    }
    
    if (!html.includes('<html')) {
      this.addError(relativePath, 'Missing html element');
    }
    
    if (!html.includes('<head>')) {
      this.addError(relativePath, 'Missing head element');
    }
    
    if (!html.includes('<body>')) {
      this.addError(relativePath, 'Missing body element');
    }
    
    // Check for required meta tags
    if (!html.includes('<meta charset=')) {
      this.addError(relativePath, 'Missing charset declaration');
    }
    
    if (!html.includes('viewport')) {
      this.addError(relativePath, 'Missing viewport meta tag');
    }
  }

  /**
   * Validate with W3C HTML validator (requires internet connection)
   */
  async validateWithW3C(filePath, relativePath) {
    try {
      // Check if html-validate is available
      execSync('which html-validate', { stdio: 'ignore' });
      
      const result = execSync(`html-validate "${filePath}" --formatter json`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      if (result.trim()) {
        const validation = JSON.parse(result);
        
        validation.forEach(issue => {
          if (issue.severity === 'error') {
            this.addError(relativePath, `Line ${issue.line}: ${issue.message}`);
          } else {
            this.addWarning(relativePath, `Line ${issue.line}: ${issue.message}`);
          }
        });
      }
    } catch (error) {
      // html-validate not available or validation failed
      throw new Error('html-validate not available');
    }
  }

  /**
   * Custom HTML validation rules
   */
  async validateCustomRules(filePath, relativePath) {
    const html = fs.readFileSync(filePath, 'utf8');
    
    // Check for common SEO issues
    const titleMatches = html.match(/<title[^>]*>([^<]*)<\/title>/gi);
    if (!titleMatches || titleMatches.length === 0) {
      this.addError(relativePath, 'Missing title tag');
    } else if (titleMatches.length > 1) {
      this.addError(relativePath, 'Multiple title tags found');
    }
    
    // Check for meta description
    if (!html.match(/<meta[^>]*name=['"']description['"'][^>]*>/i)) {
      this.addError(relativePath, 'Missing meta description');
    }
    
    // Check for proper heading hierarchy
    const headings = [];
    const headingRegex = /<(h[1-6])[^>]*>([^<]*)<\/h[1-6]>/gi;
    let match;
    
    while ((match = headingRegex.exec(html)) !== null) {
      headings.push({
        level: parseInt(match[1].charAt(1)),
        text: match[2].trim()
      });
    }
    
    if (headings.length > 0) {
      // Check if first heading is h1
      if (headings[0].level !== 1) {
        this.addWarning(relativePath, 'First heading should be h1');
      }
      
      // Check heading hierarchy
      for (let i = 1; i < headings.length; i++) {
        const prev = headings[i - 1];
        const current = headings[i];
        
        if (current.level > prev.level + 1) {
          this.addWarning(relativePath, `Heading hierarchy skip: h${current.level} after h${prev.level}`);
        }
      }
    }
    
    // Check for images without alt text
    const imgRegex = /<img[^>]*>/gi;
    const images = html.match(imgRegex) || [];
    
    images.forEach(img => {
      if (!img.includes('alt=')) {
        this.addWarning(relativePath, 'Image missing alt attribute');
      }
    });
    
    // Check for links without text or aria-label
    const linkRegex = /<a[^>]*>([^<]*)<\/a>/gi;
    let linkMatch;
    
    while ((linkMatch = linkRegex.exec(html)) !== null) {
      const linkText = linkMatch[1].trim();
      const linkTag = linkMatch[0];
      
      if (!linkText && !linkTag.includes('aria-label=') && !linkTag.includes('title=')) {
        this.addWarning(relativePath, 'Link without accessible text');
      }
    }
    
    // Check for proper language attribute
    if (!html.match(/<html[^>]*lang=['"'][a-z-]+['"']/i)) {
      this.addError(relativePath, 'Missing or invalid lang attribute on html element');
    }
    
    // Check for duplicate IDs
    const idRegex = /id=['"']([^'"]+)['"']/gi;
    const ids = [];
    let idMatch;
    
    while ((idMatch = idRegex.exec(html)) !== null) {
      const id = idMatch[1];
      if (ids.includes(id)) {
        this.addError(relativePath, `Duplicate ID: ${id}`);
      } else {
        ids.push(id);
      }
    }
    
    // Check for proper form labels
    const inputRegex = /<input[^>]*>/gi;
    const inputs = html.match(inputRegex) || [];
    
    inputs.forEach(input => {
      if (input.includes('type="text"') || input.includes('type="email"') || 
          input.includes('type="password"') || input.includes('type="tel"')) {
        const hasLabel = input.includes('aria-label=') || 
                        input.includes('aria-labelledby=') ||
                        input.includes('title=');
        
        if (!hasLabel) {
          // Check if there's a corresponding label element
          const idMatch = input.match(/id=['"']([^'"]+)['"']/);
          if (idMatch) {
            const id = idMatch[1];
            if (!html.includes(`for="${id}"`)) {
              this.addWarning(relativePath, `Input field missing proper label: ${id}`);
            }
          } else {
            this.addWarning(relativePath, 'Input field without accessible label');
          }
        }
      }
    });
  }

  /**
   * Add error
   */
  addError(path, message) {
    this.errors.push({ path, message, type: 'error' });
  }

  /**
   * Add warning
   */
  addWarning(path, message) {
    this.warnings.push({ path, message, type: 'warning' });
  }

  /**
   * Print results
   */
  printResults() {
    console.log('\n📊 HTML Validation Results');
    console.log('==========================\n');
    
    console.log(`❌ Errors: ${this.errors.length}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}\n`);
    
    if (this.errors.length > 0) {
      console.log('🚨 ERRORS:');
      this.errors.forEach(error => {
        console.log(`   ${error.path}: ${error.message}`);
      });
      console.log('');
    }
    
    if (this.warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      this.warnings.forEach(warning => {
        console.log(`   ${warning.path}: ${warning.message}`);
      });
      console.log('');
    }
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All HTML validation checks passed!');
    }
    
    // Save report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        errors: this.errors.length,
        warnings: this.warnings.length,
        passed: this.errors.length === 0
      },
      errors: this.errors,
      warnings: this.warnings
    };
    
    fs.writeFileSync('html-validation-report.json', JSON.stringify(report, null, 2));
    console.log('📋 Report saved to: html-validation-report.json\n');
  }
}

// Run validation if called directly
if (require.main === module) {
  const buildDir = process.argv[2] || 'build';
  
  if (!fs.existsSync(buildDir)) {
    console.error(`❌ Build directory '${buildDir}' not found`);
    process.exit(1);
  }
  
  const validator = new HTMLValidator(buildDir);
  validator.validateAll().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ HTML validation failed:', error);
    process.exit(1);
  });
}

module.exports = HTMLValidator;