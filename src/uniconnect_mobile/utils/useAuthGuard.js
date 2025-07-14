import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { getAuthData } from '@/lib/auth/emailpassword';

export const useAuthGuard = (redirectTo = "/") => {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user, session } = await getAuthData();

        if (user && session) {
          setIsAuthenticated(true);
        } else {
          console.log("User or session not found. Redirecting...");
          router.replace(redirectTo);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        router.replace(redirectTo);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [redirectTo]);

  return { checking, isAuthenticated };
};
