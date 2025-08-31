const { test, expect } = require('@playwright/test');

test.describe('Naming Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/naming-tool');
  });

  test('should load naming tool page', async ({ page }) => {
    // Check that the page loads successfully
    await expect(page).toHaveTitle(/Naming Tool|StartupNamer\.ai/);
    
    // Verify main elements are present
    await expect(page.locator('h1')).toBeVisible();
    
    // Should have input field for business description/industry
    const inputField = page.locator('input[type="text"], textarea').first();
    await expect(inputField).toBeVisible();
    
    // Should have generate/submit button
    const generateButton = page.locator('button').filter({ hasText: /generate|create|get.names/i }).first();
    await expect(generateButton).toBeVisible();
  });

  test('should have proper SEO meta tags', async ({ page }) => {
    // Check title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title).toContain('Naming Tool');
    
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription.length).toBeGreaterThan(120);
    
    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href');
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toContain('naming-tool');
  });

  test('should generate startup names', async ({ page }) => {
    // Fill in the business description
    const inputField = page.locator('input[type="text"], textarea').first();
    await inputField.fill('AI-powered project management software for remote teams');
    
    // Click generate button
    const generateButton = page.locator('button').filter({ hasText: /generate|create|get.names/i }).first();
    await generateButton.click();
    
    // Wait for results (either loading state or actual results)
    const loadingIndicator = page.locator('.loading, [data-testid="loading"], .spinner').first();
    const resultsContainer = page.locator('.results, .names, [data-testid="results"]').first();
    
    // Either loading indicator should appear, or results should appear directly
    try {
      await expect(loadingIndicator).toBeVisible({ timeout: 2000 });
      await expect(loadingIndicator).toBeHidden({ timeout: 15000 });
    } catch {
      // No loading indicator, that's fine
    }
    
    // Results should appear within 15 seconds
    await expect(resultsContainer).toBeVisible({ timeout: 15000 });
    
    // Should have multiple name suggestions
    const nameItems = page.locator('.name-item, .result-item, li').filter({ hasText: /\w+/ });
    const nameCount = await nameItems.count();
    expect(nameCount).toBeGreaterThan(0);
  });

  test('should handle empty input gracefully', async ({ page }) => {
    const generateButton = page.locator('button').filter({ hasText: /generate|create|get.names/i }).first();
    
    // Try to generate without input
    await generateButton.click();
    
    // Should show validation message or prevent submission
    const errorMessage = page.locator('.error, .warning, [data-testid="error"]').first();
    const isDisabled = await generateButton.isDisabled();
    
    // Either button should be disabled or error message should appear
    expect(isDisabled || await errorMessage.count() > 0).toBeTruthy();
  });

  test('should be mobile responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Main elements should still be visible and usable
    const inputField = page.locator('input[type="text"], textarea').first();
    await expect(inputField).toBeVisible();
    
    const generateButton = page.locator('button').filter({ hasText: /generate|create|get.names/i }).first();
    await expect(generateButton).toBeVisible();
    
    // Test functionality on mobile
    await inputField.fill('Mobile app for fitness tracking');
    await generateButton.click();
    
    // Should work the same as desktop
    const resultsContainer = page.locator('.results, .names, [data-testid="results"]').first();
    await expect(resultsContainer).toBeVisible({ timeout: 15000 });
  });

  test('should have working filters and options', async ({ page }) => {
    // Look for filter options (industry, style, length, etc.)
    const industrySelect = page.locator('select').filter({ hasText: /industry|category/i }).first();
    const styleSelect = page.locator('select').filter({ hasText: /style|type/i }).first();
    const lengthOption = page.locator('input[type="radio"], input[type="checkbox"]').first();
    
    // If filters exist, test them
    if (await industrySelect.count() > 0) {
      await industrySelect.selectOption({ index: 1 }); // Select second option
    }
    
    if (await styleSelect.count() > 0) {
      await styleSelect.selectOption({ index: 1 });
    }
    
    if (await lengthOption.count() > 0) {
      await lengthOption.check();
    }
    
    // Test with filters applied
    const inputField = page.locator('input[type="text"], textarea').first();
    await inputField.fill('Blockchain-based supply chain solution');
    
    const generateButton = page.locator('button').filter({ hasText: /generate|create|get.names/i }).first();
    await generateButton.click();
    
    const resultsContainer = page.locator('.results, .names, [data-testid="results"]').first();
    await expect(resultsContainer).toBeVisible({ timeout: 15000 });
  });

  test('should allow saving/favoriting names', async ({ page }) => {
    // First generate some names
    const inputField = page.locator('input[type="text"], textarea').first();
    await inputField.fill('Social media management platform');
    
    const generateButton = page.locator('button').filter({ hasText: /generate|create|get.names/i }).first();
    await generateButton.click();
    
    const resultsContainer = page.locator('.results, .names, [data-testid="results"]').first();
    await expect(resultsContainer).toBeVisible({ timeout: 15000 });
    
    // Look for save/favorite buttons
    const favoriteButton = page.locator('button').filter({ hasText: /save|favorite|heart|star/i }).first();
    
    if (await favoriteButton.count() > 0) {
      await favoriteButton.click();
      
      // Should show some indication that name was saved
      const savedIndicator = page.locator('.saved, .favorited, [data-testid="saved"]').first();
      await expect(savedIndicator).toBeVisible({ timeout: 3000 });
    }
  });

  test('should have working domain availability check', async ({ page }) => {
    // Generate names first
    const inputField = page.locator('input[type="text"], textarea').first();
    await inputField.fill('E-commerce platform for small businesses');
    
    const generateButton = page.locator('button').filter({ hasText: /generate|create|get.names/i }).first();
    await generateButton.click();
    
    const resultsContainer = page.locator('.results, .names, [data-testid="results"]').first();
    await expect(resultsContainer).toBeVisible({ timeout: 15000 });
    
    // Look for domain check buttons/indicators
    const domainCheckButton = page.locator('button').filter({ hasText: /domain|check.availability/i }).first();
    const domainIndicator = page.locator('.domain-available, .domain-taken, [data-testid="domain-status"]').first();
    
    if (await domainCheckButton.count() > 0) {
      await domainCheckButton.click();
      
      // Should show domain status
      await expect(page.locator('.domain-status, [data-testid="domain-check-result"]').first()).toBeVisible({ timeout: 10000 });
    } else if (await domainIndicator.count() > 0) {
      // Domain status might be shown automatically
      await expect(domainIndicator).toBeVisible();
    }
  });

  test('should handle rate limiting gracefully', async ({ page }) => {
    const inputField = page.locator('input[type="text"], textarea').first();
    const generateButton = page.locator('button').filter({ hasText: /generate|create|get.names/i }).first();
    
    // Try to generate multiple times quickly
    for (let i = 0; i < 5; i++) {
      await inputField.fill(`Test business idea ${i}`);
      await generateButton.click();
      await page.waitForTimeout(500); // Small delay between requests
    }
    
    // Should either handle gracefully or show rate limit message
    const rateLimitMessage = page.locator('.rate-limit, .error').filter({ hasText: /rate.limit|too.many|slow.down/i }).first();
    const stillWorking = page.locator('.results, .names, [data-testid="results"]').first();
    
    // Either should show rate limit message or continue working
    const rateLimitCount = await rateLimitMessage.count();
    const resultsCount = await stillWorking.count();
    
    expect(rateLimitCount > 0 || resultsCount > 0).toBeTruthy();
  });

  test('should have breadcrumb navigation', async ({ page }) => {
    // Check for breadcrumb navigation
    const breadcrumb = page.locator('.breadcrumb, [data-testid="breadcrumb"], nav').filter({ hasText: /home|naming.tool/i }).first();
    
    if (await breadcrumb.count() > 0) {
      await expect(breadcrumb).toBeVisible();
      
      // Should be able to navigate back to home
      const homeLink = breadcrumb.locator('a').filter({ hasText: /home/i }).first();
      if (await homeLink.count() > 0) {
        await homeLink.click();
        await expect(page).toHaveURL(/^\//); // Should navigate to home
      }
    }
  });
});