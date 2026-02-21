import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for public operations (read, insert)
export const supabase = createClient(url, anon);

// Admin client for privileged operations (delete) — server-side only
export const supabaseAdmin = () => createClient(url, service);
