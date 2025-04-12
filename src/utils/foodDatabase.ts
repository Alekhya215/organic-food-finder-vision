
import { supabase } from "@/integrations/supabase/client";

export interface FoodItem {
  id: string;
  name: string;
  barcode: string | null;
  brand: string | null;
  variety: string | null;
  is_organic: boolean;
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

export async function getFoodItemByBarcode(barcode: string) {
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
    .select('is_verified, certification_sources(name)')
    .eq('food_id', foodItem.id);

  return {
    ...foodItem,
    nutrients: nutrients || [],
    preservation: preservation || {},
    verifications: verifications?.map(v => ({
      source_name: v.certification_sources?.name,
      is_verified: v.is_verified
    })) || []
  };
}

export async function getFoodItemByName(name: string) {
  const { data: foodItem, error: foodError } = await supabase
    .from('food_items')
    .select('*')
    .ilike('name', `%${name}%`)
    .single();

  // Similar logic as getFoodItemByBarcode
  // (implementation omitted for brevity)
  return foodItem;
}
