import { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-f7350c8a`;

export function useInitializeData() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      // Check if we've already initialized (use localStorage to persist)
      const initialized = localStorage.getItem('db_initialized');
      if (initialized === 'true') {
        setIsInitialized(true);
        return;
      }

      setIsInitializing(true);
      console.log('Initializing database with seed data...');

      try {
        const response = await fetch(`${API_BASE_URL}/seed`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          console.log('Database initialized successfully');
          localStorage.setItem('db_initialized', 'true');
          setIsInitialized(true);
        } else {
          console.warn('Database initialization failed:', data.error);
          setError(data.error || 'Failed to initialize database');
          // Don't block the app, just log the error
          setIsInitialized(true);
        }
      } catch (err) {
        console.error('Error initializing database:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Don't block the app, just log the error
        setIsInitialized(true);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeDatabase();
  }, []);

  return { isInitialized, isInitializing, error };
}
