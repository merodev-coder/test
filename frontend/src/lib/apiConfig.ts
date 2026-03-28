const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}${cleanEndpoint}`;
}

export function getAdminApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}admin/${cleanEndpoint}`;
}

export const API_ENDPOINTS = {
  PRODUCTS: 'products',
  TAGS: 'tags',
  ORDERS: 'orders',
  ADMIN_PRODUCTS: 'products',
  ADMIN_ORDERS: 'orders',
  ADMIN_MONTHLY_PERFORMANCE: 'monthly-performance',
} as const;
