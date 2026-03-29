const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

function getApiBase(): string {
  const base = API_BASE_URL.replace(/\/+$/, '');
  return base.endsWith('/api') ? base : `${base}/api`;
}

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  return `${getApiBase()}/${cleanEndpoint}`;
}

export function getAdminApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  return `${getApiBase()}/admin/${cleanEndpoint}`;
}

export const API_ENDPOINTS = {
  PRODUCTS: 'products',
  TAGS: 'tags',
  ORDERS: 'orders',
  ADMIN_PRODUCTS: 'products',
  ADMIN_ORDERS: 'orders',
  ADMIN_MONTHLY_PERFORMANCE: 'monthly-performance',
} as const;
