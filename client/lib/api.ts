const API_BASE = '/api';

async function fetchApi(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

// Auth
export const api = {
  // Auth
  login: (phone: string, password: string, role: 'admin' | 'owner') =>
    fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password, role }),
    }),

  // Apartments
  getApartments: () => fetchApi('/apartments'),
  updateApartment: (id: number, data: any) =>
    fetchApi(`/apartments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  saveApartments: (apartments: any[]) =>
    fetchApi('/apartments', {
      method: 'POST',
      body: JSON.stringify(apartments),
    }),

  // Transactions
  getTransactions: () => fetchApi('/transactions'),
  addTransaction: (transaction: any) =>
    fetchApi('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    }),
  saveTransactions: (transactions: any[]) =>
    fetchApi('/transactions', {
      method: 'PUT',
      body: JSON.stringify(transactions),
    }),

  // Notifications
  getNotifications: (flatId?: number) =>
    fetchApi(`/notifications${flatId ? `?flatId=${flatId}` : ''}`),
  addNotification: (notification: any) =>
    fetchApi('/notifications', {
      method: 'POST',
      body: JSON.stringify(notification),
    }),
  updateNotification: (id: string, data: any) =>
    fetchApi(`/notifications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteNotification: (id: string) =>
    fetchApi(`/notifications/${id}`, {
      method: 'DELETE',
    }),

  // Messages (Chat)
  getMessages: () => fetchApi('/messages'),
  sendMessage: (message: any) =>
    fetchApi('/messages', {
      method: 'POST',
      body: JSON.stringify(message),
    }),

  // Budget
  getBudget: () => fetchApi('/budget'),
  saveBudget: (budget: any) =>
    fetchApi('/budget', {
      method: 'POST',
      body: JSON.stringify(budget),
    }),

  // Payments
  getPayments: (flatId?: number) =>
    fetchApi(`/payments${flatId ? `?flatId=${flatId}` : ''}`),
  addPayment: (payment: any) =>
    fetchApi('/payments', {
      method: 'POST',
      body: JSON.stringify(payment),
    }),

  // Tenants
  getTenants: (flatId?: number) =>
    fetchApi(`/tenants${flatId ? `?flatId=${flatId}` : ''}`),
  addTenant: (tenant: any) =>
    fetchApi('/tenants', {
      method: 'POST',
      body: JSON.stringify(tenant),
    }),
  updateTenant: (id: string, data: any) =>
    fetchApi(`/tenants/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteTenant: (id: string) =>
    fetchApi(`/tenants/${id}`, {
      method: 'DELETE',
    }),

  // Maintenance
  getMaintenanceRequests: () => fetchApi('/maintenance'),
  addMaintenanceRequest: (request: any) =>
    fetchApi('/maintenance', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
  updateMaintenanceRequest: (id: string, data: any) =>
    fetchApi(`/maintenance/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Settings
  getSettings: () => fetchApi('/settings'),
  saveSettings: (settings: any) =>
    fetchApi('/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    }),

  // Bootstrap all data
  getAllData: () => fetchApi('/data'),
};

export default api;
