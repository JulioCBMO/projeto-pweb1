// src/app/config/supabase.config.ts
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://ztqmcmjflonmdymypdst.supabase.co';
const supabaseKey = 'sb_publishable_I1LNRjbT2_Vitu-SnQBFKg_IGBD9mDZ';

export const supabase = createClient(supabaseUrl, supabaseKey);