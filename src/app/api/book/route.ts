import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    
    // 1. Save to Supabase for local record persistence
    const { error: dbError } = await supabase.from('appointments').insert({
      user_id: user.id,
      doctor_name: body.doctor_name,
      hospital: body.hospital,
      appointment_date: body.appointment_date,
      status: 'confirmed',
      created_at: new Date().toISOString()
    });

    if (dbError) {
      console.error('Supabase Booking Error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    // 2. Notify external backend (if any)
    const response = await fetch(`${backendUrl}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        doctor_name: body.doctor_name,
        hospital: body.hospital,
        appointment_date: body.appointment_date,
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.warn(`External Backend Sync Warning: ${errorText}`);
        // We don't throw error here because the Supabase record is already saved
    }

    return new Response(JSON.stringify({ success: true, message: 'Appointment booked successfully' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Booking API Route Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
