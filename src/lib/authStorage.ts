const STORAGE_KEY = "user";

export type UserType = "admin" | "user";

export interface AuthUser {
  type?: UserType;
  username?: string;
  [key: string]: unknown;
}

export const getStoredAuthUser = (): AuthUser | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const setStoredAuthUser = (user: AuthUser): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const clearStoredAuthUser = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const resolveUserType = (user: AuthUser | null): UserType | null => {
  if (!user) return null;
  return user.type ?? "user";
};
