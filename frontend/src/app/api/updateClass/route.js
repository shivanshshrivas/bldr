import {supabase} from "../../lib/supabaseClient";

export async function POST(req) {
    try {
        const body = await req.json();
        const { scheduleid, oldClassid, newClassid, oldUuid, newUuid } = body;
        if (!scheduleid || !oldClassid || !newClassid || !oldUuid || !newUuid) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }
        // Update class in the database
        const { data, error } = await supabase
            .from('scheduleclasses')
            .update({ classid: newClassid, uuid: newUuid })
            .match({ scheduleid, classid: oldClassid, uuid: oldUuid })
            .select()
            .single();
        if (error) {
            console.error('Error updating class:', error);
            return Response.json({ error: 'Failed to update class' }, { status: 500 });
        }
        // Return success response
        return Response.json({ 
            success: true, 
            message: 'Class updated successfully',
            class: data
        }, { status: 200 });
    }
    catch (err) {
        console.error('Update class error:', err);
        return Response.json({ error: 'Server error', details: err.message }, { status: 500 });
    }
}