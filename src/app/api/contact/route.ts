import { NextResponse } from 'next/server';

const SERVICES = new Set(['Meta Ads', 'Branding', 'Creative Production', 'AI Content', 'Multiple']);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? '').trim();
    const company = String(body.company ?? '').trim();
    const email = String(body.email ?? '').trim();
    const phone = String(body.phone ?? '').trim();
    const service = String(body.service ?? '').trim();
    const description = String(body.description ?? '').trim();

    if (!name || !email || !service || !description) {
      return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!SERVICES.has(service)) {
      return NextResponse.json({ error: 'Please select a valid service.' }, { status: 400 });
    }
    if (name.length > 120 || company.length > 160 || email.length > 254 || phone.length > 60 || description.length > 5000) {
      return NextResponse.json({ error: 'One or more fields are too long.' }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Supabase environment variables are missing.');
      return NextResponse.json({ error: 'Contact service is temporarily unavailable.' }, { status: 503 });
    }

    const contact = phone ? `${email} | ${phone}` : email;
    const response = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name,
        company: company || null,
        contact,
        service,
        description,
        status: 'New',
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Supabase lead insert failed:', response.status, await response.text());
      return NextResponse.json({ error: 'We could not send your inquiry. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'We could not send your inquiry. Please try again.' }, { status: 500 });
  }
}
