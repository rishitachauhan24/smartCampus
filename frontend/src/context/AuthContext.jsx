import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getMe,
  loginUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    localStorage.setItem(
      "smartcampus_token",
      data.token
    );

    setUser(data.user);

    return data.user;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);

    localStorage.setItem(
      "smartcampus_token",
      data.token
    );

    setUser(data.user);

    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("smartcampus_token");
    setUser(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      const token =
        localStorage.getItem("smartcampus_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMe();
        setUser(data.user);
      } catch {
        localStorage.removeItem(
          "smartcampus_token"
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);