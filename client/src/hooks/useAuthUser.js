import { useContext } from 'react';
import { AuthContext } from '@context/AuthContext';

/**
 * Hook para acceder a los datos del usuario autenticado desde el contexto
 * @returns {Object} { usuario, loading: isLoading, error }
 */
export const useAuthUser = () => {
  const { user, isLoading, error, isAuthenticated } = useContext(AuthContext);

  if (!user && isAuthenticated) {
    console.warn('Usuario esperado en contexto pero no encontrado');
  }

  return {
    usuario: user,
    loading: isLoading,
    error,
    isAuthenticated,
  };
};