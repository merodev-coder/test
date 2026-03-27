import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import { Tag } from '@/models/Tag';

function isAuthed(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|;\s*)abo_admin_token=([^;]+)/);
  let token = match ? decodeURIComponent(match[1]) : '';

  if (!token) {
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return false;
  try {
    jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const tags = await Tag.find({}).sort({ name: 1 }).lean();
  return NextResponse.json({
    tags: tags.map((t: any) => ({ id: String(t._id), name: t.name, slug: t.slug })),
  });
}

export async function POST(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const body = (await req.json().catch(() => null)) as { name?: string } | null;
  const name = (body?.name || '').trim();
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  const slug = slugify(name);
  const created = await Tag.create({ name, slug });
  return NextResponse.json({
    tag: { id: String(created._id), name: created.name, slug: created.slug },
  });
}
