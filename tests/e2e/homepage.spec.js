const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load and display core elements', async ({ page }) => {
    // Check that the page loads successfully
    await expect(page).toHaveTitle(/StartupNamer\.ai/);
    
    // Verify core elements are present
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for main CTA button
    const ctaButton = page.locator('a[href*="naming-tool"], button').filter({ hasText: /get started|try now|start/i }).first();
    await expect(ctaButton).toBeVisible();
  });

  test('should have proper SEO meta tags', async ({ page }) => {
    // Check title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(60);
    
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription.length).toBeGreaterThan(120);
    expect(metaDescription.length).toBeLessThan(160);
    
    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href');
    
    // Check Open Graph tags
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content');
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content');
    
    // Check Twitter Card tags
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content');
  });

  test('should be mobile responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that navigation is still accessible (might be hamburger menu)
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check that main content is visible and properly sized
    const mainContent = page.locator('main, .main-content, [role="main"]').first();
    await expect(mainContent).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(mainContent).toBeVisible();
  });

  test('should have fast loading performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check for performance metrics
    const perfEntries = await page.evaluate(() => {
      const entries = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: entries.domContentLoadedEventEnd - entries.navigationStart,
        loadComplete: entries.loadEventEnd - entries.navigationStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
      };
    });
    
    // DOM Content Loaded should be under 1.5s
    expect(perfEntries.domContentLoaded).toBeLessThan(1500);
    
    // First Contentful Paint should be under 1.8s
    if (perfEntries.firstContentfulPaint > 0) {
      expect(perfEntries.firstContentfulPaint).toBeLessThan(1800);
    }
  });

  test('should navigate to naming tool', async ({ page }) => {
    // Find and click the main CTA button
    const ctaButton = page.locator('a[href*="naming-tool"], a').filter({ hasText: /naming.tool|get started|try now|start/i }).first();
    await ctaButton.click();
    
    // Should navigate to naming tool page
    await expect(page).toHaveURL(/naming-tool/);
    
    // Verify naming tool page loads
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have working navigation menu', async ({ page }) => {
    // Check main navigation links
    const navLinks = [
      { text: /features/i, url: /features/ },
      { text: /pricing/i, url: /pricing/ },
      { text: /how.it.works/i, url: /how-it-works/ }
    ];
    
    for (const link of navLinks) {
      const navItem = page.locator('nav a, header a').filter({ hasText: link.text }).first();
      if (await navItem.count() > 0) {
        await navItem.click();
        await expect(page).toHaveURL(link.url);
        await page.goBack();
      }
    }
  });

  test('should have accessibility features', async ({ page }) => {
    // Check for skip link (accessibility feature)
    const skipLink = page.locator('a').filter({ hasText: /skip to.*(content|main)/i }).first();
    if (await skipLink.count() > 0) {
      await expect(skipLink).toHaveAttribute('href');
    }
    
    // Check that main content has proper heading structure
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1); // Should have exactly one h1
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // Images should have alt text (can be empty for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Test 404 page
    await page.goto('/non-existent-page');
    
    // Should either redirect to a 404 page or show error message
    const pageContent = await page.textContent('body');
    const hasErrorIndication = pageContent.includes('404') || 
                              pageContent.includes('Not Found') || 
                              pageContent.includes('Page not found');
    
    // If it's a SPA, it might redirect to home page instead
    const isHomePage = await page.url().includes('/#') || 
                      await page.locator('h1').textContent().then(text => text.includes('StartupNamer'));
    
    expect(hasErrorIndication || isHomePage).toBeTruthy();
  });
});