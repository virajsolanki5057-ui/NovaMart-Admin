const AUTH_KEY = "auth_data";

export const saveStoredAuth = (data: {
  token: string;
  user: unknown;
}) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
};

export const loadStoredAuth = () => {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_KEY);
};