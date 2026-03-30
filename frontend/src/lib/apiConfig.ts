const API_BASE_URL = 'https://considerate-celebration-production-558b.up.railway.app';

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  // بنضمن إننا بنكلم /api/ وبعدها الـ endpoint مباشرة
  return `${API_BASE_URL}/api/${cleanEndpoint}`;
}

export function getAdminApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  
  // لو الأوردرات بتيجي من orderRoutes مباشرة:
  if (cleanEndpoint.includes('orders')) {
    return getApiUrl(cleanEndpoint); 
  }
  
  // لو حاجات تانية تبع الـ adminRoutes:
  return getApiUrl(`admin/${cleanEndpoint}`);
}

export const API_ENDPOINTS = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  ADMIN_ORDERS: 'orders', // خليتها orders مباشرة عشان تروح لـ /api/orders
} as const;