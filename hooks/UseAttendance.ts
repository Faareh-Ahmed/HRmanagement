import { useState, useEffect } from 'react';
import { IAttendance } from '@/lib/database/models/attendance.model';

interface EmployeeData {
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

export const useAttendance = () => {
  const [attendanceData, setAttendanceData] = useState<IAttendance[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<IAttendance | null>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch('/api/attendance');
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }
      const data = await response.json();
      setAttendanceData(data.records );
      setTodayAttendance(data.today);
      setEmployeeData(data.employee);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  const punchIn = async (checkInTime: Date) => {
    setLoading(true);
    try {
      const response = await fetch('/api/attendance/punch-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkInTime: checkInTime.toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to punch in');
      }

      await fetchAttendanceData();
    } finally {
      setLoading(false);
    }
  };

  const punchOut = async (checkOutTime: Date, workingHours: number, status: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/attendance/punch-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkOutTime: checkOutTime.toISOString(),
          workingHours,
          status,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to punch out');
      }

      await fetchAttendanceData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  return {
    attendanceData,
    todayAttendance,
    employeeData,
    punchIn,
    punchOut,
    loading,
    refetch: fetchAttendanceData,
  };
};
