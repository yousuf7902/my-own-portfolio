const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || data.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function login(password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await handleResponse(res);
  localStorage.setItem('admin_token', data.access_token);
  return data;
}

export function logout() {
  localStorage.removeItem('admin_token');
}

export async function checkAuth(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${API_URL}/auth/check`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchAbout() {
  const res = await fetch(`${API_URL}/about`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function updateAbout(data: any) {
  const res = await fetch(`${API_URL}/about`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function fetchSkills() {
  const res = await fetch(`${API_URL}/skills`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function createSkill(data: any) {
  const res = await fetch(`${API_URL}/skills`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateSkill(id: string, data: any) {
  const res = await fetch(`${API_URL}/skills/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteSkill(id: string) {
  const res = await fetch(`${API_URL}/skills/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function fetchProjects() {
  const res = await fetch(`${API_URL}/projects`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function createProject(data: any) {
  const res = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateProject(id: string, data: any) {
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteProject(id: string) {
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function fetchAchievements() {
  const res = await fetch(`${API_URL}/achievements`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function createAchievement(data: any) {
  const res = await fetch(`${API_URL}/achievements`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateAchievement(id: string, data: any) {
  const res = await fetch(`${API_URL}/achievements/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteAchievement(id: string) {
  const res = await fetch(`${API_URL}/achievements/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function fetchExperiences() {
  const res = await fetch(`${API_URL}/experiences`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function createExperience(data: any) {
  const res = await fetch(`${API_URL}/experiences`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateExperience(id: string, data: any) {
  const res = await fetch(`${API_URL}/experiences/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteExperience(id: string) {
  const res = await fetch(`${API_URL}/experiences/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function fetchCertifications() {
  const res = await fetch(`${API_URL}/certifications`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function createCertification(data: any) {
  const res = await fetch(`${API_URL}/certifications`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateCertification(id: string, data: any) {
  const res = await fetch(`${API_URL}/certifications/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteCertification(id: string) {
  const res = await fetch(`${API_URL}/certifications/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function fetchWritings() {
  const res = await fetch(`${API_URL}/writings/admin`, {
    cache: 'no-store',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function createWriting(data: any) {
  const res = await fetch(`${API_URL}/writings`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateWriting(id: string, data: any) {
  const res = await fetch(`${API_URL}/writings/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteWriting(id: string) {
  const res = await fetch(`${API_URL}/writings/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function uploadImage(file: File, folder: string = 'portfolio') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const token = getToken();
  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  return handleResponse(res);
}
