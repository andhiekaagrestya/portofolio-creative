import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

// ── DELETE — admin removes a note by ID ───────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; }>; }
) {
  // Auth check — header must carry the admin secret
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  await sql`DELETE FROM memoboard_notes WHERE id = ${id}`;

  return NextResponse.json({ ok: true });
}
