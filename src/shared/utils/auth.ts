export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
  return null;
}

export function setCookie(
  name: string,
  value: string,
  days?: number,
  path: string = '/',
) {
  let expires = '';

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }

  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}${expires}; path=${path}`;
}

export function deleteCookie(name: string, path: string = '/') {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
}

export function decodeJwt(token: string) {
  try {
    const payload = token.split('.')[1]; // the middle part
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function generateRandomPassword(length = 12) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export function extractUserConditions() {
  const token = decodeJwt(String(getCookie('token')));
  console.log('token', token);
  const id = token.id;
  const isOwnerManager = token.type === 'owner' || token.type === 'manager';
  const isOwner = token.type === 'owner';
  const isEmployee = token.type === 'employee';

  return { id, isOwner, isOwnerManager, isEmployee };
}

