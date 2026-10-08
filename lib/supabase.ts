import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rprmjhzjiuaktkubfuqt.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_75VfJ7bsDZvhM2wAiT-Q0Q_vbwU5K1O';

export const supabase = createClient(supabaseUrl, supabaseKey);
