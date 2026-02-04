import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente deprecado - Redirige a /login
 * Usar LoginView o RegisterView directamente
 */
export default function AuthView() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login', { replace: true });
  }, [navigate]);

  return null;
}
