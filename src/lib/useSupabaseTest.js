/**
 * useSupabaseTest — a quick hook to verify the Supabase connection.
 *
 * Usage: import this hook into any component and it will attempt to
 * query a table. If the table doesn't exist yet you'll see a Supabase
 * error, which still proves the connection to your project is working.
 *
 * Example:
 *   import { useSupabaseTest } from '../lib/useSupabaseTest';
 *   const { status, error } = useSupabaseTest('songs'); // replace 'songs' with your table name
 */
import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export const useSupabaseTest = (tableName = 'songs') => {
  const [status, setStatus] = useState('connecting'); // 'connecting' | 'ok' | 'error'
  const [data, setData]     = useState(null);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const run = async () => {
      const { data, error } = await supabase.from(tableName).select('*').limit(5);

      if (error) {
        console.error('[Supabase] Connection error:', error.message);
        setError(error.message);
        // Note: a "relation does not exist" error still means the
        // connection succeeded — the table just hasn't been created yet.
        setStatus('error');
      } else {
        console.log('[Supabase] Connection OK. Rows returned:', data);
        setData(data);
        setStatus('ok');
      }
    };

    run();
  }, [tableName]);

  return { status, data, error };
};
