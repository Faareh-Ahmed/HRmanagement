'use client';
import { useEffect, useState } from 'react';
import { Employee } from '@/lib/types';

export function useFetchEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmployees() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/employee/all');
        if (!res.ok) throw new Error('Failed to fetch employees');
        const data = await res.json();
        setEmployees(data.employees);
      } catch (err: any) {
        setError(err.message || 'Error fetching employees');
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  return { employees, loading, error, setEmployees };
}
