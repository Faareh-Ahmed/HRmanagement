'use client';
import { useEffect, useState } from 'react';

export function useFetchSalaries() {
  const [salaries, setSalaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSalaries() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/salary/all');
        if (!res.ok) throw new Error('Failed to fetch salaries');
        const data = await res.json();
        setSalaries(data.salaries);
      } catch (err: any) {
        setError(err.message || 'Error fetching salaries');
      } finally {
        setLoading(false);
      }
    }
    fetchSalaries();
  }, []);

  return { salaries, loading, error, setSalaries };
}
