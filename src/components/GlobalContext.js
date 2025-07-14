import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUser } from '../api/supabase';

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    getUser().then(({ data }) => {
      setUser(data?.user || null);
      setLoading(false);
    });
  }, []);

  return (
    <GlobalContext.Provider value={{ user, setUser, loading, alert, setAlert }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
} 