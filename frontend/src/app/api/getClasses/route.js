import { supabase } from '../../lib/supabaseClient';

export async function POST(req) {
  const { scheduleid } = await req.json();
  
    // Fetch all classes for the schedule
    const { data: classes, error } = await supabase
        