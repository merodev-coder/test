import { Product } from '../models/Product.js';
import { z } from 'zod';

const paginationSchema = z.object({
  page: z.string().default('1').transform(Number).pipe(z.number().min(1)),
  limit: z.string().default('20').transform(Number).pipe(z.number().min(1).max(100)),
  category: z.string().optional(),
  search: z.string().optional(),
  isSale: z.enum(['true', 'false']).optional(),
  tags: z.string().optional(),
  minPrice: z.string().optional().transform(val => val ? Number(val) : undefined),
  maxPrice: z.string().optional().transform(val => val ? Number(val) : undefined),
});

const productSchema = z.object({
  name: z.string().min(2).max(200),
  type: z.enum(['laptops', 'accessories', 'storage', 'data']),
  subtype: z.string().max(100).optional(),
  price: z.number().positive(),
  oldPrice: z.number().positive().optional(),
  description: z.string().max(5000).optional(),
  image: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  specs: z.record(z.any()).optional(),
  stockCount: z.number().int().min(0).default(0),
  storageCapacity: z.number().int().min(0).default(0),
  gbSize: z.number().int().min(0).default(0),
  tags: z.array(z.string()).default([]),
  isBrandActive: z.boolean().default(false),
  brands: z.array(z.string()).default([]),
  isSale: z.boolean().default(false), // Show on dedicated /sale page
});

export async function listProducts(req, res, next) {
  try {
    const { page, limit, category, search, isSale, tags, minPrice, maxPrice } = paginationSchema.parse(req.query);
    
    const filter = {};
    if (category) filter.type = category;
    if (isSale !== undefined) filter.isSale = isSale === 'true';
    
    // Price range filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }
    
    // Tags filtering
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      if (tagArray.length > 0) {
        filter.tags = { $in: tagArray };
      }
    }
    
    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: regex }, { description: regex }];
    }
    
    const skip = (page - 1) * limit;
    
    const [docs, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);
    
    const products = docs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug || '',
      type: doc.type,
      subtype: doc.subtype || '',
      price: doc.price,
      oldPrice: doc.oldPrice,
      description: doc.description || '',
      image: doc.image || '',
      images: doc.images || [],
      specs: doc.specs || {},
      stockCount: doc.stockCount || 0,
      storageCapacity: doc.storageCapacity || 0,
      gbSize: doc.gbSize || 0,
      isSale: !!doc.isSale,
      isBrandActive: !!doc.isBrandActive,
      brands: Array.isArray(doc.brands) ? doc.brands : [],
      tags: Array.isArray(doc.tags) ? doc.tags.map(tag => ({
        id: tag,
        name: tag,
        slug: tag.toLowerCase().replace(/\s+/g, '-')
      })) : [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
    
    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: skip + docs.length < total,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid query parameters', details: err.errors });
    }
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const body = productSchema.parse(req.body);
    
    if (body.type === 'data' && (!body.gbSize || body.gbSize <= 0)) {
      return res.status(400).json({ error: 'gbSize is required for data products' });
    }
    
    const product = await Product.create(body);
    
    const dto = {
      id: product._id.toString(),
      name: product.name,
      slug: product.slug || '',
      type: product.type,
      subtype: product.subtype || '',
      price: product.price,
      oldPrice: product.oldPrice,
      description: product.description || '',
      image: product.image || '',
      images: product.images || [],
      specs: product.specs || {},
      stockCount: product.stockCount || 0,
      storageCapacity: product.storageCapacity || 0,
      gbSize: product.gbSize || 0,
      isSale: !!product.isSale,
      isBrandActive: !!product.isBrandActive,
      brands: Array.isArray(product.brands) ? product.brands : [],
      tags: Array.isArray(product.tags) ? product.tags : [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
    res.status(201).json({ product: dto });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid product data', details: err.errors });
    }
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Product with this name already exists' });
    }
    next(err);
  }
}

const updateProductSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  type: z.enum(['laptops', 'accessories', 'storage', 'data']).optional(),
  subtype: z.string().max(100).optional(),
  price: z.number().positive().optional(),
  oldPrice: z.number().positive().optional(),
  description: z.string().max(5000).optional(),
  image: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  specs: z.record(z.any()).optional(),
  stockCount: z.number().int().min(0).optional(),
  storageCapacity: z.number().int().min(0).optional(),
  gbSize: z.number().int().min(0).optional(),
  tags: z.array(z.string()).optional(),
  isBrandActive: z.coerce.boolean().optional(),
  brands: z.array(z.string()).optional(),
  isSale: z.coerce.boolean().optional(),
});

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const body = updateProductSchema.parse(req.body);
    
    if (body.type === 'data' && body.gbSize !== undefined && body.gbSize <= 0) {
      return res.status(400).json({ error: 'gbSize must be greater than 0 for data products' });
    }
    
    // Build update object only with provided fields
    const updateData = {};
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }
    
    const product = await Product.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const dto = {
      id: product._id.toString(),
      name: product.name,
      slug: product.slug || '',
      type: product.type,
      subtype: product.subtype || '',
      price: product.price,
      oldPrice: product.oldPrice,
      description: product.description || '',
      image: product.image || '',
      images: product.images || [],
      specs: product.specs || {},
      stockCount: product.stockCount || 0,
      storageCapacity: product.storageCapacity || 0,
      gbSize: product.gbSize || 0,
      isSale: !!product.isSale,
      isBrandActive: !!product.isBrandActive,
      brands: Array.isArray(product.brands) ? product.brands : [],
      tags: Array.isArray(product.tags) ? product.tags : [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
    res.json({ product: dto });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid product data', details: err.errors });
    }
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Product with this name already exists' });
    }
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
