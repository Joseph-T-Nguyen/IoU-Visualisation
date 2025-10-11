import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
}

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, try to get user ID from localStorage
        let currentUserId = localStorage.getItem('userId');
        
        if (currentUserId) {
          // Verify the user still exists in the database
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          const response = await fetch(`${apiUrl}/api/workspaces?userId=${encodeURIComponent(currentUserId)}`);
          
          if (response.ok) {
            setUserId(currentUserId);
            setLoading(false);
            return;
          } else {
            // User doesn't exist, remove from localStorage
            localStorage.removeItem('userId');
          }
        }

        // No valid user ID found, create a new user
        const newUser = await createNewUser();
        if (newUser) {
          localStorage.setItem('userId', newUser.id);
          setUserId(newUser.id);
        }
      } catch (err) {
        console.error('Failed to initialize user:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize user');
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  return { userId, loading, error };
}

async function createNewUser(): Promise<User | null> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    // Create a new user with a unique name
    const userName = `User_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const response = await fetch(`${apiUrl}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.status}`);
    }

    const user = await response.json();
    console.log('Created new user:', user);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}
