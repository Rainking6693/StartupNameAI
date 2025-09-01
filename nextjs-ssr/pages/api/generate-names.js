import namingService from '../../services/namingService';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported'
    });
  }

  try {
    const { formData } = req.body;

    // Validate input
    if (!formData || !formData.keywords || !formData.industry || !formData.style) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'formData with keywords, industry, and style are required'
      });
    }

    // Validate keywords array
    if (!Array.isArray(formData.keywords) || formData.keywords.length === 0) {
      return res.status(400).json({
        error: 'Invalid keywords',
        message: 'Keywords must be a non-empty array'
      });
    }

    // Rate limiting check (simple implementation)
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Name generation request from IP: ${userIP}`);

    // Generate names
    console.log('🎯 API: Starting name generation with:', formData);
    const generatedNames = await namingService.generateStartupNames(formData);

    // Validate results
    if (!generatedNames || generatedNames.length === 0) {
      throw new Error('No names were generated');
    }

    // Return successful response
    return res.status(200).json({
      success: true,
      data: {
        names: generatedNames,
        metadata: {
          total: generatedNames.length,
          generatedAt: new Date().toISOString(),
          formData: formData,
          source: 'api'
        }
      }
    });

  } catch (error) {
    console.error('❌ API Error in name generation:', error);
    
    // Return error response
    return res.status(500).json({
      error: 'Name generation failed',
      message: error.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    });
  }
}

// Export config for API route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}