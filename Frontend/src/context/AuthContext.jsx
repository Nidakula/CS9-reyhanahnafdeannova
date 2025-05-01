import React, { useContext, useState, useEffect, createContext } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  // Memeriksa localStorage ketika aplikasi pertama dijalankan.
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const login = async ({ email, password }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
        }
      );
      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data.payload); // Simpan data user dari backend
        localStorage.setItem("currentUser", JSON.stringify(data.payload));
        return { success: true };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Error during login:", error);
      return { success: false, message: "An error occurred. Please try again." };
    }
  };

  const register = async ({ email, password, name }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/register?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&name=${encodeURIComponent(name)}`,
        {
          method: "POST",
        }
      );
      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data.payload); // Simpan data user dari backend
        localStorage.setItem("currentUser", JSON.stringify(data.payload));
        return { success: true };
      } else {
        return { success: false, message: data.message || "Registration failed" };
      }
    } catch (error) {
      console.error("Error during registration:", error);
      return { success: false, message: "An error occurred. Please try again." };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}