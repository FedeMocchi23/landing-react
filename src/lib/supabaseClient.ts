import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://twnjhlnpkjugnhhpxrmz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3bmpobG5wa2p1Z25oaHB4cm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MzQzMzMsImV4cCI6MjA3ODIxMDMzM30.h1S-Qk9TBsqcjvb9yLNX2N6F_M5eKaXgTwqtM742XNw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
