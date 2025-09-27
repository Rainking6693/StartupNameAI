// Domain Checking and Guidance Service
// Provides honest domain recommendations without false availability claims

class DomainService {
  constructor() {
    this.apiEndpoint = process.env.REACT_APP_DOMAIN_API || 'https://api.startupnamer.org';
    this.reservationEndpoint = process.env.REACT_APP_RESERVATION_API || 'https://reservations.startupnamer.org';
  }

  // Check domain availability for a startup name
  async checkDomainAvailability(name) {
    try {
      // Generate domain options and provide guidance
      const domains = this.generateDomainOptions(name);
      const results = await Promise.all(
        domains.map(domain => this.provideDomainGuidance(domain))
      );
      
      return {
        success: true,
        name: name,
        domains: results,
        recommendations: this.getDomainRecommendations(results),
        disclaimer: 'Domain availability must be verified with a domain registrar. We provide guidance only.'
      };
    } catch (error) {
      console.error('Domain guidance generation failed:', error);
      return {
        success: false,
        error: 'Failed to generate domain guidance',
        name: name,
        domains: []
      };
    }
  }

  // Generate domain options for a name
  generateDomainOptions(name) {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const extensions = ['.com', '.io', '.co', '.net', '.org', '.ai', '.app', '.tech'];
    
    return extensions.map(ext => ({
      domain: cleanName + ext,
      extension: ext,
      priority: this.getExtensionPriority(ext)
    }));
  }

  // Provide honest domain guidance (no false availability claims)
  async provideDomainGuidance(domainInfo) {
    // Add realistic delay for UX
    await this.delay(200 + Math.random() * 300);
    
    // HONEST: We provide guidance, not availability checks
    const registrar = this.getRecommendedRegistrar(domainInfo.extension);
    const estimatedPrice = this.getDomainPrice(domainInfo.extension);
    const registrarUrl = this.getRegistrarUrl(domainInfo.domain, registrar);
    
    return {
      ...domainInfo,
      status: 'check-required',
      message: `Check availability at ${registrar}`,
      estimatedPrice: estimatedPrice,
      registrar: registrar,
      registrarUrl: registrarUrl,
      checkNowButton: true,
      disclaimer: 'Click to check real-time availability',
      alternatives: this.generateAlternatives(domainInfo.domain),
      guidance: this.getDomainGuidance(domainInfo.extension)
    };
  }

  // Get domain price estimates
  getDomainPrice(extension) {
    const basePrices = {
      '.com': '~$12-15/year',
      '.io': '~$35-50/year',
      '.co': '~$20-30/year',
      '.net': '~$12-18/year',
      '.org': '~$12-15/year',
      '.ai': '~$80-120/year',
      '.app': '~$15-25/year',
      '.tech': '~$25-40/year'
    };
    
    return basePrices[extension] || '~$15-30/year';
  }

  // Get extension priority for sorting
  getExtensionPriority(extension) {
    const priorities = {
      '.com': 1,
      '.io': 2,
      '.co': 3,
      '.ai': 4,
      '.app': 5,
      '.tech': 6,
      '.net': 7,
      '.org': 8
    };
    
    return priorities[extension] || 9;
  }

  // Get recommended registrar for extension
  getRecommendedRegistrar(extension) {
    const registrars = {
      '.com': 'Namecheap',
      '.io': 'Porkbun',
      '.co': 'GoDaddy',
      '.ai': 'Name.com',
      '.app': 'Google Domains',
      '.tech': 'Radix',
      '.net': 'Namecheap',
      '.org': 'Namecheap'
    };
    
    return registrars[extension] || 'Namecheap';
  }

  // Get registrar URL for checking domain
  getRegistrarUrl(domain, registrar) {
    const domainName = domain.split('.')[0];
    
    const registrarUrls = {
      'Namecheap': `https://www.namecheap.com/domains/registration/results/?domain=${domainName}`,
      'Porkbun': `https://porkbun.com/checkout/search?q=${domainName}`,
      'GoDaddy': `https://www.godaddy.com/domainsearch/find?domainToCheck=${domainName}`,
      'Name.com': `https://www.name.com/domain/search/${domainName}`,
      'Google Domains': `https://domains.google.com/registrar/search?searchTerm=${domainName}`,
      'Radix': `https://radix.website/search/?domain=${domainName}`
    };
    
    return registrarUrls[registrar] || `https://www.namecheap.com/domains/registration/results/?domain=${domainName}`;
  }

  // Generate alternative domain suggestions
  generateAlternatives(domain) {
    const baseName = domain.split('.')[0];
    const extension = '.' + domain.split('.')[1];
    
    const alternatives = [
      `get${baseName}${extension}`,
      `${baseName}app${extension}`,
      `${baseName}hq${extension}`,
      `${baseName}pro${extension}`,
      `try${baseName}${extension}`
    ];
    
    return alternatives.slice(0, 3).map(alt => ({
      domain: alt,
      action: 'Check availability',
      registrarUrl: this.getRegistrarUrl(alt, 'Namecheap')
    }));
  }

  // Get domain-specific guidance
  getDomainGuidance(extension) {
    const guidance = {
      '.com': 'Most trusted and memorable. Check this first.',
      '.io': 'Popular with tech startups. Premium pricing.',
      '.co': 'Good .com alternative. Growing acceptance.',
      '.ai': 'Perfect for AI companies. Premium pricing (~$100/year).',
      '.app': 'Great for applications. HTTPS required.',
      '.tech': 'Clear tech branding. Moderate pricing.',
      '.net': 'Classic alternative. Wide acceptance.',
      '.org': 'Best for non-profits and communities.'
    };
    
    return guidance[extension] || 'Check availability and pricing.';
  }

  // Get honest domain recommendations
  getDomainRecommendations(results) {
    const recommendations = [];
    
    // Always recommend checking .com first
    const comDomain = results.find(r => r.extension === '.com');
    if (comDomain) {
      recommendations.push({
        type: 'primary',
        domain: comDomain.domain,
        reason: '.com is the most trusted and memorable extension',
        priority: 'high',
        action: 'Check Availability Now',
        registrarUrl: comDomain.registrarUrl,
        disclaimer: 'Most valuable if available'
      });
    }
    
    // Tech company recommendations
    const techExtensions = ['.io', '.ai', '.app', '.tech'];
    const techDomains = results.filter(r => techExtensions.includes(r.extension));
    
    techDomains.forEach(domain => {
      recommendations.push({
        type: 'alternative',
        domain: domain.domain,
        reason: domain.guidance,
        priority: 'medium',
        action: 'Check Availability',
        registrarUrl: domain.registrarUrl,
        estimatedPrice: domain.estimatedPrice
      });
    });
    
    // Add helpful guidance
    recommendations.push({
      type: 'tips',
      title: 'Domain Registration Tips',
      tips: [
        'Check multiple registrars for best pricing',
        'Consider registering multiple extensions',
        'Enable privacy protection',
        'Set up auto-renewal to avoid losing your domain',
        'Register for 2+ years for better SEO'
      ]
    });
    
    return recommendations;
  }

  // Get domain registration tips
  getDomainTips() {
    return {
      choosing: [
        'Keep it short and memorable (under 15 characters)',
        'Avoid hyphens and numbers when possible',
        'Choose .com if available for maximum trust',
        'Consider your target audience and industry',
        'Make sure it\'s easy to spell and pronounce'
      ],
      registration: [
        'Compare prices across multiple registrars',
        'Enable domain privacy protection',
        'Set up auto-renewal to avoid losing your domain',
        'Consider registering common variations',
        'Keep your contact information up to date'
      ],
      alternatives: [
        'If .com is taken, consider .io for tech companies',
        '.ai domains work well for AI/tech startups (~$100/year)',
        '.co is a good alternative to .com',
        '.app requires HTTPS (built-in security)',
        'New extensions can be more brandable and available'
      ],
      disclaimer: 'All domain availability and pricing must be verified with registrars. Prices and availability change in real-time.'
    };
  }

  // Utility function for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Validate domain name format
  isValidDomainName(domain) {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  }
}

// Export the domain service
export default DomainService;

// Example usage:
// const domainService = new DomainService();
// const guidance = await domainService.checkDomainAvailability('MyStartup');
// User clicks registrar links to check actual availability