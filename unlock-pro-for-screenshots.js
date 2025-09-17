// Temporary script to unlock pro features for screenshots
// Run this in the Metro console or add to your app temporarily

import { useHabitStore } from './src/state/habitStore';

// Unlock pro features
const unlockProFeatures = () => {
  const { updateSubscription, updateSettings } = useHabitStore.getState();
  
  // Set to lifetime pro
  updateSubscription('lifetime');
  
  // Update settings to show pro features
  updateSettings({
    subscriptionStatus: 'lifetime',
    subscriptionDate: new Date(),
  });
  
  console.log('✅ Pro features unlocked for screenshots!');
  console.log('You can now see:');
  console.log('- Unlimited habits');
  console.log('- Advanced analytics');
  console.log('- Data export/import');
  console.log('- Premium customization');
  console.log('- Priority support');
};

// Export for use in Metro console
global.unlockProFeatures = unlockProFeatures;

// Auto-unlock when this script runs
unlockProFeatures();

