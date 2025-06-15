import { supabase } from '../../lib/supabaseClient';

export async function POST(req) {
  const { onlineID } = await req.json();

  // Fetch all schedules for the user
const { data: schedules, error } = await supabase
    .from('allschedules')
    .select('*')
    .in(
        'scheduleid',
        (
            await supabase
                .from('userschedule')
                .select('scheduleid')
                .eq('onlineid', onlineID)
                .eq('isactive', true)
        ).data?.map(row => row.scheduleid) || []
    )
    .order('lastedited', { ascending: false });

    if (error) {
    console.error('Error fetching schedules:', error);
    return Response.json({ error: 'Failed to fetch schedules' }, { status: 500 });
    }

    // Return the schedules
    console.log('Fetched schedules:', schedules);
    return Response.json(schedules || [], { status: 200 });
}
