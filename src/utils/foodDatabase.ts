
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface FoodItem {
  id: string;
  name: string;
  barcode: string | null;
  brand: string | null;
  variety: string | null;
  is_organic: boolean;
  origin?: string;
  season?: string;
  growth_conditions?: string;
  organic_cultivation?: string;
  ingredients?: string;
  created_at?: string;
  updated_at?: string;
  category_id?: number;
}

export interface Nutrient {
  nutrient_name: string;
  value: string;
  unit: string | null;
  daily_value_percent: number | null;
}

export interface PreservationGuideline {
  refrigerated_duration: string;
  room_temp_duration: string;
  storage_method: string;
  tips: string;
}

export interface OrganicVerification {
  source_name: string;
  is_verified: boolean;
  certification_id?: string;
  certification_date?: string;
  notes?: string;
}

export interface FoodItemWithDetails extends FoodItem {
  nutrients: Nutrient[];
  preservation: PreservationGuideline;
  verifications: OrganicVerification[];
}

export async function getFoodItemByBarcode(barcode: string): Promise<FoodItemWithDetails | null> {
  const { data: foodItem, error: foodError } = await supabase
    .from('food_items')
    .select('*')
    .eq('barcode', barcode)
    .single();

  if (foodError || !foodItem) return null;

  const { data: nutrients, error: nutrientError } = await supabase
    .from('nutrients')
    .select('*')
    .eq('food_id', foodItem.id);

  const { data: preservation, error: preservationError } = await supabase
    .from('preservation_guidelines')
    .select('*')
    .eq('food_id', foodItem.id)
    .single();

  const { data: verifications, error: verificationError } = await supabase
    .from('organic_verifications')
    .select('is_verified, certification_id, certification_date, notes, certification_sources(name)')
    .eq('food_id', foodItem.id);

  return {
    ...foodItem,
    nutrients: nutrients || [],
    preservation: preservation || {},
    verifications: verifications?.map(v => ({
      source_name: v.certification_sources?.name || 'Unknown Source',
      is_verified: v.is_verified,
      certification_id: v.certification_id,
      certification_date: v.certification_date,
      notes: v.notes
    })) || []
  };
}

export async function getFoodItemByName(name: string): Promise<FoodItemWithDetails | null> {
  const { data: foodItems, error: foodError } = await supabase
    .from('food_items')
    .select('*')
    .ilike('name', `%${name}%`)
    .limit(1);

  if (foodError || !foodItems || foodItems.length === 0) return null;
  
  const foodItem = foodItems[0];

  const { data: nutrients, error: nutrientError } = await supabase
    .from('nutrients')
    .select('*')
    .eq('food_id', foodItem.id);

  const { data: preservation, error: preservationError } = await supabase
    .from('preservation_guidelines')
    .select('*')
    .eq('food_id', foodItem.id)
    .maybeSingle();

  const { data: verifications, error: verificationError } = await supabase
    .from('organic_verifications')
    .select('is_verified, certification_id, certification_date, notes, certification_sources(name)')
    .eq('food_id', foodItem.id);

  return {
    ...foodItem,
    nutrients: nutrients || [],
    preservation: preservation || {},
    verifications: verifications?.map(v => ({
      source_name: v.certification_sources?.name || 'Unknown Source',
      is_verified: v.is_verified,
      certification_id: v.certification_id,
      certification_date: v.certification_date,
      notes: v.notes
    })) || []
  };
}

// Subscribe to real-time updates for food items
export function setupFoodItemRealtime(foodId: string, onUpdate: (item: FoodItem) => void) {
  // Enable realtime for the food_items table
  const channel = supabase
    .channel('public:food_items')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'food_items',
        filter: `id=eq.${foodId}`
      },
      (payload) => {
        console.log('Food item updated:', payload);
        onUpdate(payload.new as FoodItem);
      }
    )
    .subscribe();

  // Return a function to unsubscribe
  return () => {
    supabase.removeChannel(channel);
  };
}

// Subscribe to real-time updates for nutrients
export function setupNutrientsRealtime(foodId: string, onUpdate: (nutrients: Nutrient[]) => void) {
  const channel = supabase
    .channel('public:nutrients')
    .on(
      'postgres_changes',
      {
        event: '*', // Listen for all changes (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'nutrients',
        filter: `food_id=eq.${foodId}`
      },
      async (payload) => {
        console.log('Nutrients changed:', payload);
        // Fetch all nutrients for this food item
        const { data } = await supabase
          .from('nutrients')
          .select('*')
          .eq('food_id', foodId);
          
        if (data) {
          onUpdate(data as Nutrient[]);
        }
      }
    )
    .subscribe();

  // Return a function to unsubscribe
  return () => {
    supabase.removeChannel(channel);
  };
}

// Subscribe to real-time updates for preservation guidelines
export function setupPreservationRealtime(foodId: string, onUpdate: (guidelines: PreservationGuideline) => void) {
  const channel = supabase
    .channel('public:preservation')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'preservation_guidelines',
        filter: `food_id=eq.${foodId}`
      },
      async (payload) => {
        console.log('Preservation guidelines changed:', payload);
        const { data } = await supabase
          .from('preservation_guidelines')
          .select('*')
          .eq('food_id', foodId)
          .maybeSingle();
          
        if (data) {
          onUpdate(data as PreservationGuideline);
        }
      }
    )
    .subscribe();

  // Return a function to unsubscribe
  return () => {
    supabase.removeChannel(channel);
  };
}

// Subscribe to real-time updates for organic verifications
export function setupVerificationRealtime(foodId: string, onUpdate: (verifications: OrganicVerification[]) => void) {
  const channel = supabase
    .channel('public:verifications')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'organic_verifications',
        filter: `food_id=eq.${foodId}`
      },
      async (payload) => {
        console.log('Verifications changed:', payload);
        const { data } = await supabase
          .from('organic_verifications')
          .select('is_verified, certification_id, certification_date, notes, certification_sources(name)')
          .eq('food_id', foodId);
          
        if (data) {
          const verifications = data.map(v => ({
            source_name: v.certification_sources?.name || 'Unknown Source',
            is_verified: v.is_verified,
            certification_id: v.certification_id,
            certification_date: v.certification_date,
            notes: v.notes
          }));
          onUpdate(verifications);
        }
      }
    )
    .subscribe();

  // Return a function to unsubscribe
  return () => {
    supabase.removeChannel(channel);
  };
}
