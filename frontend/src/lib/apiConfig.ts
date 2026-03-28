const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${baseUrl}${cleanEndpoint}`;
}

export function getAdminApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${baseUrl}admin/${cleanEndpoint}`;
}

export const API_ENDPOINTS = {
  PRODUCTS: 'products',
  TAGS: 'tags',
  ORDERS: 'orders',
  ADMIN_PRODUCTS: 'products',
  ADMIN_ORDERS: 'orders',
  ADMIN_MONTHLY_PERFORMANCE: 'monthly-performance',
} as const;
