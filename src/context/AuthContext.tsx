// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

type UserType = "admin" | "user" | null;

interface AuthContextType {
  user: any;
  userType: UserType;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<UserType>(null);

  const login = (userData: any) => {
    setUser(userData);
    setUserType(userData?.type || "user"); // مثلاً userData.type = 'admin'
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setUserType(parsed.type || "user");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
