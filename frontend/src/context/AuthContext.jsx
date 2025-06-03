import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../hook/useAuth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { login: authLogin, logout: authLogout, getToken } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ username: payload.sub });
    }
  }, []);

  const login = async (email, password) => {
    const result = await authLogin(email, password);
    if (result?.username) {
      setUser({ username: result.username });
      return true;
    }
    return false;
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
