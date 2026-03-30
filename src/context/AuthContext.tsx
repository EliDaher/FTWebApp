import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearStoredAuthUser,
  getStoredAuthUser,
  resolveUserType,
  setStoredAuthUser,
  type AuthUser,
  type UserType,
} from "../lib/authStorage";

type ResolvedUserType = UserType | null;

interface AuthState {
  user: AuthUser | null;
  userType: ResolvedUserType;
}

interface AuthContextType extends AuthState {
  login: (userData: AuthUser) => void;
  logout: () => void;
}

const getInitialState = (): AuthState => {
  const user = getStoredAuthUser();
  return {
    user,
    userType: resolveUserType(user),
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(getInitialState);

  const login = useCallback((userData: AuthUser) => {
    setAuthState({
      user: userData,
      userType: resolveUserType(userData),
    });
    setStoredAuthUser(userData);
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      userType: null,
    });
    clearStoredAuthUser();
  }, []);

  const value = useMemo(
    () => ({
      ...authState,
      login,
      logout,
    }),
    [authState, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
