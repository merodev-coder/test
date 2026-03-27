import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

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

function mapProduct(doc: any) {
  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug || '',
    type: doc.type,
    subtype: doc.subtype || '',
    price: doc.price || 0,
    oldPrice: doc.oldPrice,
    description: doc.description,
    images: Array.isArray(doc.images) ? doc.images : [],
    stockCount: doc.stockCount || 0,
    storageCapacity: typeof doc.storageCapacity === 'number' ? doc.storageCapacity : 0,
    gbSize: typeof doc.gbSize === 'number' ? doc.gbSize : 0,
    isSale: !!doc.isSale,
    isBrandActive: !!doc.isBrandActive,
    brands: Array.isArray(doc.brands) ? doc.brands : [],
    tags: [],
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : '',
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : '',
  };
}

export async function GET(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const docs = await Product.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({
    products: docs.map((doc: any) => mapProduct(doc)),
  });
}

export async function POST(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const body = (await req.json().catch(() => null)) as any;

  if (body?.type === 'data' && (typeof body?.gbSize !== 'number' || body.gbSize <= 0)) {
    return NextResponse.json({ error: 'gbSize is required for data products' }, { status: 400 });
  }

  const created = await Product.create({
    name: body?.name,
    slug: body?.slug || undefined, // auto-generated if not provided
    type: body?.type,
    subtype: body?.subtype,
    price: body?.price,
    oldPrice: body?.oldPrice,
    description: body?.description,
    images: Array.isArray(body?.images) ? body.images : [],
    stockCount: body?.stockCount,
    storageCapacity: body?.storageCapacity,
    gbSize: body?.gbSize,
    isSale: !!body?.isSale,
    isBrandActive: !!body?.isBrandActive,
    brands: Array.isArray(body?.brands) ? body.brands : [],
    tags: Array.isArray(body?.tags) ? body.tags : [],
  });

  return NextResponse.json({ product: mapProduct(created) });
}
