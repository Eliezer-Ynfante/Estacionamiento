import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import  {AuthContext}  from "./AuthContext";
import {
  apiLogin,
  apiRegister,
  apiLogout,
  apiValidateSession,
} from "@api/auth";
import { UserSchema, LoginSchema, RegisterSchema } from "@schema/authSchemas";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // =============================
  // Verificar sesión (al montar)
  // =============================
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const response = await apiValidateSession();
        const validatedUser = UserSchema.parse(response.data);

        if (isMounted) {
          setUser(validatedUser);
          setIsAuthenticated(true);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // =============================
  // Login
  // =============================
  const login = useCallback(async (correo_electronico, contraseña) => {
    try {
      setIsLoading(true);

      LoginSchema.parse({ correo_electronico, contraseña });

      await apiLogin(correo_electronico, contraseña);

      // El backend setea la cookie HttpOnly
      const sessionResponse = await apiValidateSession();
      const validatedUser = UserSchema.parse(sessionResponse.data);

      setUser(validatedUser);
      setIsAuthenticated(true);
      toast.success("¡Bienvenido!");
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      toast.error("Credenciales inválidas");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =============================
  // Register
  // =============================
  const register = useCallback(async (formData) => {
    try {
      setIsLoading(true);

      const validatedData = RegisterSchema.parse(formData);

      await apiRegister(validatedData);

      // Sesión automática tras registro
      const sessionResponse = await apiValidateSession();
      const validatedUser = UserSchema.parse(sessionResponse.data);

      setUser(validatedUser);
      setIsAuthenticated(true);
      toast.success("Cuenta creada correctamente");
    } catch (error) {
      toast.error("Error al registrar");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =============================
  // Logout
  // =============================
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await apiLogout();
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      toast.info("Sesión cerrada");
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    token: null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
