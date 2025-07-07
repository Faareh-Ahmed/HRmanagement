'use client';
import { useState } from 'react';
import axios from 'axios';
import { SalaryFormData } from '@/lib/types';

export function useAddSalary() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addSalary(data: SalaryFormData) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/salary/add', data);
      setLoading(false);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to add salary');
      setLoading(false);
      throw err;
    }
  }

  return { addSalary, loading, error };
}
