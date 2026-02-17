const BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || res.statusText || 'Error en la petición');
  }
  return data;
}

export const authApi = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
};

export const productsApi = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/products${q ? `?${q}` : ''}`);
  },
  getById: (id) => request(`/products/${id}`),
  create: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
};

export const cartApi = {
  get: () => request('/cart'),
  addItem: (body) => request('/cart/items', { method: 'POST', body: JSON.stringify(body) }),
  updateItem: (itemId, body) => request(`/cart/items/${itemId}`, { method: 'PUT', body: JSON.stringify(body) }),
  removeItem: (itemId) => request(`/cart/items/${itemId}`, { method: 'DELETE' }),
  clear: () => request('/cart', { method: 'DELETE' }),
};

export const ordersApi = {
  getAll: () => request('/orders'),
  getById: (id) => request(`/orders/${id}`),
  create: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  updateStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};
