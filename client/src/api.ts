const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data as T;
}

export const api = {
  getConfig: () => request<{ config: any; presets: any[]; database: string }>('/config'),
  getChalets: () => request<any[]>('/chalets'),
  getPublicTraders: () => request<any[]>('/traders'),
  submitApplication: (payload: Record<string, unknown>) =>
    request<{ message: string; referenceCode: string; application: any }>('/traders/apply', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  adminLogin: (email: string, password: string) =>
    request<{ token: string; admin: { email: string; role: string } }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  getAdminTraders: (token: string) =>
    request<any[]>('/admin/traders', {
      headers: { Authorization: `Bearer ${token}` }
    }),
  updateTraderStatus: (token: string, id: string, status: 'approved' | 'rejected' | 'pending') =>
    request<{ message: string; trader: any }>(`/admin/traders/${id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    }),
  deleteTrader: (token: string, id: string) =>
    request<{ message: string }>(`/admin/traders/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }),
  updateSiteConfig: (token: string, payload: Record<string, unknown>) =>
    request<{ message: string; config: any }>('/admin/config', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    }),
  gdprExport: (email: string, referenceCode: string) =>
    request<{ gdprNotice: string; exportedAt: string; personalData: any }>('/gdpr/export', {
      method: 'POST',
      body: JSON.stringify({ email, referenceCode })
    }),
  gdprErase: (email: string, referenceCode: string) =>
    request<{ message: string }>('/gdpr/erase', {
      method: 'DELETE',
      body: JSON.stringify({ email, referenceCode })
    })
};
