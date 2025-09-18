import React from 'react';
import { Crown } from 'lucide-react';

const TestPremiumButton = () => {
  const togglePremium = () => {
    const currentTier = localStorage.getItem('startupnamer_user_tier');
    
    if (currentTier === 'pro') {
      // Downgrade to free
      localStorage.removeItem('startupnamer_user_tier');
      localStorage.removeItem('startupnamer_premium_activated');
      console.log('🔽 Downgraded to free tier');
    } else {
      // Upgrade to premium
      localStorage.setItem('startupnamer_user_tier', 'pro');
      localStorage.setItem('startupnamer_premium_activated', new Date().toISOString());
      console.log('⬆️ Upgraded to premium tier');
    }
    
    // Refresh page to update UI
    window.location.reload();
  };

  const currentTier = localStorage.getItem('startupnamer_user_tier');
  const isPremium = currentTier === 'pro' || currentTier === 'enterprise';

  return (
    <button
      onClick={togglePremium}
      className={`fixed bottom-4 right-4 z-50 flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-sm shadow-lg transition-all duration-300 ${
        isPremium 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : 'bg-yellow-500 hover:bg-yellow-600 text-white'
      }`}
      title={isPremium ? 'Click to test free tier' : 'Click to test premium tier'}
    >
      <Crown className="w-4 h-4" />
      <span>{isPremium ? 'Test Free' : 'Test Premium'}</span>
    </button>
  );
};

export default TestPremiumButton;
