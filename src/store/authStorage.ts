export const AUTH_STORAGE_KEY = "tailadmin-auth";

export interface StoredAuthSession {
  token: string;
  rememberMe: boolean;
  user: {
    id?: string;
    name: string;
    email: string;
    role: "user" | "admin" | "super admin";
    avatar?: string;
  };
}

const isBrowser = typeof window !== "undefined";

const readStorage = (storage: Storage | undefined) => {
  if (!storage) {
    return null;
  }

  const rawSession = storage.getItem(AUTH_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as StoredAuthSession;
  } catch {
    storage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const loadStoredAuth = () => {
  if (!isBrowser) {
    return null;
  }

  return (
    readStorage(window.localStorage) ?? readStorage(window.sessionStorage)
  );
};

export const persistAuth = (session: StoredAuthSession) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);

  const storage = session.rememberMe
    ? window.localStorage
    : window.sessionStorage;

  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredAuth = () => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
};
