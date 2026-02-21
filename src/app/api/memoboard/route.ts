import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const COLORS = ['white', 'yellow', 'blue', 'pink', 'green'] as const;
const ROTATES = [-8, -6, -4, -2, 2, 4, 6, 8];
// Predefined positions spread across the board
const POSITIONS = [
  { pos_top: '6%', pos_left: '4%' },
  { pos_top: '5%', pos_left: '30%' },
  { pos_top: '4%', pos_left: '58%' },
  { pos_top: '6%', pos_left: '77%' },
  { pos_top: '48%', pos_left: '8%' },
  { pos_top: '46%', pos_left: '35%' },
  { pos_top: '50%', pos_left: '62%' },
  { pos_top: '48%', pos_left: '80%' },
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function hashIp(ip: string): string {
  return createHash('sha256').update(ip + 'memoboard-salt').digest('hex').slice(0, 32);
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ── GET — fetch all notes ──────────────────────────────────────────
export async function GET() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('memoboard_notes')
    .select('id, name, role, message, color, rotate, pos_top, pos_left, created_at')
    .order('created_at', { ascending: false })
    .limit(40);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// ── POST — submit a new note ───────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  // Honeypot — bots fill this hidden field, humans don't
  if (body.website) {
    return NextResponse.json({ ok: true }); // Silently ignore
  }

  // Validate fields
  const name = (body.name ?? '').toString().trim().slice(0, 40);
  const role = (body.role ?? '').toString().trim().slice(0, 60);
  const message = (body.message ?? '').toString().trim().slice(0, 250);

  if (!name || !role || !message) {
    return NextResponse.json({ error: 'Nama, role, dan pesan wajib diisi.' }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ error: 'Pesan terlalu pendek.' }, { status: 400 });
  }

  // Rate limit — max 2 submissions per IP per 24 hours
  const forwarded = req.headers.get('x-forwarded-for') ?? '0.0.0.0';
  const ip = forwarded.split(',')[0].trim();
  const ipHash = hashIp(ip);

  const sb = getSupabase();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await sb
    .from('memoboard_notes')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', since);

  if ((count ?? 0) >= 2) {
    return NextResponse.json(
      { error: 'Kamu sudah submit 2 kali hari ini. Coba lagi besok!' },
      { status: 429 }
    );
  }

  // Pick random visual properties
  const pos = pick(POSITIONS);
  const color = pick(COLORS);
  const rotate = pick(ROTATES);

  const { data, error } = await sb
    .from('memoboard_notes')
    .insert({
      name,
      role,
      message,
      ip_hash: ipHash,
      color,
      rotate,
      pos_top: pos.pos_top,
      pos_left: pos.pos_left,
    })
    .select('id, name, role, message, color, rotate, pos_top, pos_left, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
