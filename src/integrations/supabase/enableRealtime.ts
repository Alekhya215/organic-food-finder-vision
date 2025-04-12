
import { supabase } from './client';

// This function can be called once at app startup to enable
// real-time updates for the required tables
export function enableRealtimeForFoodTables() {
  console.log('Enabling real-time for food database tables...');
  
  try {
    // Set up a channel to listen for changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'food_items' },
        (payload) => console.log('Change received for food_items:', payload)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'nutrients' },
        (payload) => console.log('Change received for nutrients:', payload)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'preservation_guidelines' },
        (payload) => console.log('Change received for preservation_guidelines:', payload)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'organic_verifications' },
        (payload) => console.log('Change received for organic_verifications:', payload)
      )
      .subscribe();

    console.log('Real-time functionality enabled for food database tables');
    
    // Return a function to disable real-time when needed
    return () => {
      supabase.removeChannel(channel);
      console.log('Real-time functionality disabled for food database tables');
    };
  } catch (error) {
    console.error('Error enabling real-time functionality:', error);
    return () => {}; // Return empty function in case of error
  }
}
