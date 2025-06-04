import { useState, useEffect } from 'react';
import { User } from '../db';
import { useUserById, getUserByEmailQuery } from './queries';
import { useCreateUser } from './mutations';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState<string>('');
  
  const queryClient = useQueryClient();
  const createUserMutation = useCreateUser();
  
  const storedUserId = localStorage.getItem('caretrack_current_user_id');
  const { data: user, isLoading: userLoading, error } = useUserById(storedUserId || '');
  
  // Query for user by email when logging in
  const { data: userByEmail, refetch: refetchUserByEmail } = useQuery({
    ...getUserByEmailQuery(loginEmail),
    enabled: false, // We'll manually trigger this
  });

  useEffect(() => {
    if (storedUserId && error) {
      localStorage.removeItem('caretrack_current_user_id');
    }
    
    if (user) {
      setCurrentUser(user);
    }
    
    setIsLoading(userLoading);
  }, [user, userLoading, error, storedUserId]);

  const loginWithEmail = async (email: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    setLoginEmail(email);
    
    try {
      // Fetch user by email
      const { data: existingUser } = await refetchUserByEmail();
      
      let finalUser = existingUser;
      
      if (!finalUser) {
        finalUser = await createUserMutation.mutateAsync({
          email,
          firstName,
          lastName,
        });
      }
      
      setCurrentUser(finalUser);
      localStorage.setItem('caretrack_current_user_id', finalUser.id);
      
      return finalUser;
    } catch (error) {
      console.error('Failed to login:', error);
      throw error;
    } finally {
      setIsLoading(false);
      setLoginEmail('');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('caretrack_current_user_id');
    queryClient.clear(); // Clear all cached data on logout
  };

  return {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    loginWithEmail,
    logout
  };
}