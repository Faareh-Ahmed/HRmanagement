'use client';
import { useState } from 'react';
import axios from 'axios';
import { Employee } from '@/lib/types';

export function useAddEmployee() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addEmployee(data: Employee) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/employee/add', data);
      setLoading(false);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to add employee');
      setLoading(false);
      throw err;
    }
  }

  return { addEmployee, loading, error };
}
