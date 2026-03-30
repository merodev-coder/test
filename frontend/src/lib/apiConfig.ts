const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

function getApiBase(): string {
  const base = API_BASE_URL.replace(/\/+$/, '');
  // يضمن وجود /api مرة واحدة فقط في نهاية الرابط
  return base.endsWith('/api') ? base : `${base}/api`;
}

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  return `${getApiBase()}/${cleanEndpoint}`;
}

// تعديل حاسم: الـ Admin في الغالب يستخدم نفس الـ routes مع اختلاف الـ Auth
export function getAdminApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  // إذا كان الـ Backend لديك يستخدم /api/admin/orders اتركها كما هي
  // إذا كان يستخدم /api/orders مباشرة، استخدم السطر القادم:
  return `${getApiBase()}/${cleanEndpoint}`;
}

export const API_ENDPOINTS = {
  PRODUCTS: 'products',
  TAGS: 'tags',
  ORDERS: 'orders',
  ADMIN_PRODUCTS: 'products',
  ADMIN_ORDERS: 'orders',
  UPLOADTHING: 'uploadthing',
} as const;