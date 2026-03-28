import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import sql from '@/lib/db';

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

const HASH_SALT = process.env.MEMOBOARD_HASH_SALT ?? 'memoboard-salt';

function hashIp(ip: string): string {
  return createHash('sha256').update(ip + HASH_SALT).digest('hex').slice(0, 32);
}

// Sanitize user input — & must come first to avoid double-encoding
function sanitize(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// ── GET — fetch all notes ──────────────────────────────────────────
export async function GET() {
  const data = await sql`
    SELECT id, name, role, message, color, rotate, pos_top, pos_left, created_at
    FROM memoboard_notes
    ORDER BY created_at DESC
    LIMIT 40
  `;

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

  // Validate and sanitize fields
  const name = sanitize((body.name ?? '').toString().trim()).slice(0, 40);
  const role = sanitize((body.role ?? '').toString().trim()).slice(0, 60);
  const message = sanitize((body.message ?? '').toString().trim()).slice(0, 250);

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

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const [{ count }] = await sql`
    SELECT COUNT(*)::int AS count
    FROM memoboard_notes
    WHERE ip_hash = ${ipHash} AND created_at >= ${since}
  `;

  if (count >= 2) {
    return NextResponse.json(
      { error: 'Kamu sudah submit 2 kali hari ini. Coba lagi besok!' },
      { status: 429 }
    );
  }

  // Pick random visual properties
  const pos = pick(POSITIONS);
  const color = pick(COLORS);
  const rotate = pick(ROTATES);

  const [data] = await sql`
    INSERT INTO memoboard_notes (name, role, message, ip_hash, color, rotate, pos_top, pos_left)
    VALUES (${name}, ${role}, ${message}, ${ipHash}, ${color}, ${rotate}, ${pos.pos_top}, ${pos.pos_left})
    RETURNING id, name, role, message, color, rotate, pos_top, pos_left, created_at
  `;

  return NextResponse.json(data, { status: 201 });
}
