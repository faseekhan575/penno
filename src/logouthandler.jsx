import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        // 🔹 backend logout (optional)
        await fetch('/api/v1/user/logout', {
          method: 'POST',
          credentials: 'include',
        });

        // 🔹 clear frontend data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // 🔹 always redirect
        navigate('/login');
      }
    };

    logout();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600 text-lg">Logging out...</p>
    </div>
  );
}