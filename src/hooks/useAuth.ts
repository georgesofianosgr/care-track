import { useState, useEffect } from 'react';
import { DatabaseService, User } from '../db';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedUserId = localStorage.getItem('caretrack_current_user_id');
      
      if (storedUserId) {
        try {
          const user = await DatabaseService.users.findById(storedUserId);
          setCurrentUser(user);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('caretrack_current_user_id');
        }
      }
      
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const loginWithEmail = async (email: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    
    try {
      let user = await DatabaseService.users.findByEmail(email);
      
      if (!user) {
        user = await DatabaseService.users.create({
          email,
          firstName,
          lastName,
        });
      }
      
      setCurrentUser(user);
      localStorage.setItem('caretrack_current_user_id', user.id);
      
      return user;
    } catch (error) {
      console.error('Failed to login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('caretrack_current_user_id');
  };

  return {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    loginWithEmail,
    logout
  };
}