'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useTimer } from '@/hooks/useTimer';
import { useAttendance } from '@/hooks/UseAttendance';
import AttendanceStats from '@/components/AttendanceStats';
import AttendanceTable from '@/components/AttendanceTable';
import { formatTime } from '@/utils/timeUtils';
import Image from 'next/image';

export default function AttendancePage() {
  const { user, isLoaded } = useUser();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  
  const { timer, startTimer, stopTimer, resetTimer } = useTimer();
  const { 
    attendanceData, 
    todayAttendance, 
    employeeData,
    punchIn, 
    punchOut, 
    loading 
  } = useAttendance();

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if user is already checked in today
  useEffect(() => {
    if (todayAttendance && todayAttendance.checkInTime && !todayAttendance.checkOutTime) {
      setIsCheckedIn(true);
      setCheckInTime(new Date(todayAttendance.checkInTime));
      // Calculate elapsed time and start timer
      const elapsed = Math.floor((Date.now() - new Date(todayAttendance.checkInTime).getTime()) / 1000);
      startTimer(elapsed);
    }
  }, [todayAttendance]);

  const handlePunchIn = async () => {
    try {
      const now = new Date();
      await punchIn(now);
      setIsCheckedIn(true);
      setCheckInTime(now);
      startTimer();
    } catch (error) {
      console.error('Error punching in:', error);
    }
  };

  const handlePunchOut = async () => {
    try {
      const now = new Date();
      const workingHours = timer / 3600; // Convert seconds to hours
      const status = workingHours >= 8 ? 'Present' : 'Absent';
      
      await punchOut(now, workingHours, status);
      setIsCheckedIn(false);
      setCheckInTime(null);
      stopTimer();
      resetTimer();
    } catch (error) {
      console.error('Error punching out:', error);
    }
  };

  const formatTimer = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Please sign in to continue</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <Image 
                  src={employeeData?.profilePicture || user.imageUrl || "/api/placeholder/64/64"} 
                  alt="Profile" 
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {getGreeting()}, {employeeData?.firstName || user.firstName || 'User'}
                </h1>
                <p className="text-gray-600">
                  {formatTime(currentTime)} • {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            {/* Timer Display */}
            {isCheckedIn && (
              <div className="text-right">
                <div className="text-sm text-gray-500">Working Time</div>
                <div className="text-2xl font-mono font-bold text-blue-600">
                  {formatTimer(timer)}
                </div>
                <div className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded">
                  Production: {Math.max(0, (timer / 3600) - 0.75).toFixed(2)} hrs
                </div>
              </div>
            )}
          </div>

          {/* Punch In/Out Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={isCheckedIn ? handlePunchOut : handlePunchIn}
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                isCheckedIn 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : (isCheckedIn ? 'Punch Out' : 'Punch In')}
            </button>
          </div>

          {checkInTime && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Punched in at {formatTime(checkInTime)}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <AttendanceStats attendanceData={attendanceData} />

        {/* Attendance Table */}
        <AttendanceTable attendanceData={attendanceData} />
      </div>
    </div>
  );
}
