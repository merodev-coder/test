const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/api/${cleanEndpoint}`;
}

export function getAdminApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/api/admin/${cleanEndpoint}`;
}

export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  TAGS: '/api/tags',
  ORDERS: '/api/orders',
  ADMIN_PRODUCTS: '/api/admin/products',
  ADMIN_ORDERS: '/api/admin/orders',
  ADMIN_MONTHLY_PERFORMANCE: '/api/admin/monthly-performance',
} as const;
