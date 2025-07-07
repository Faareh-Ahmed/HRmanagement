import { IAttendance } from '@/lib/database/models/attendance.model';

interface AttendanceStatsProps {
  attendanceData: IAttendance[];
}

export default function AttendanceStats({ attendanceData }: AttendanceStatsProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendanceData.find(record => {
    const recordDate = new Date(record.date).toISOString().split('T')[0];
    return recordDate === today;
  });
  
  const currentWeek = attendanceData.filter(record => {
    const recordDate = new Date(record.date);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    return recordDate >= weekStart;
  });

  const currentMonth = attendanceData.filter(record => {
    const recordDate = new Date(record.date);
    const now = new Date();
    return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
  });

  const totalHoursToday = todayRecord?.workingHours || 0;
  const totalHoursWeek = currentWeek.reduce((sum, record) => sum + (record.workingHours || 0), 0);
  const totalHoursMonth = currentMonth.reduce((sum, record) => sum + (record.workingHours || 0), 0);
  const overtimeMonth = currentMonth.reduce((sum, record) => sum + (record.overtimeHours || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {/* Today's Hours */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Hours Today</p>
            <p className="text-2xl font-bold text-orange-600">
              {totalHoursToday.toFixed(1)} <span className="text-sm text-gray-400">/ 9</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-orange-500 rounded"></div>
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-green-600">5% This Week</span>
        </div>
      </div>

      {/* Week Hours */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Hours Week</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalHoursWeek.toFixed(0)} <span className="text-sm text-gray-400">/ 40</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-800 rounded"></div>
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-green-600">7% Last Week</span>
        </div>
      </div>

      {/* Month Hours */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Hours Month</p>
            <p className="text-2xl font-bold text-blue-600">
              {totalHoursMonth.toFixed(0)} <span className="text-sm text-gray-400">/ 98</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-blue-500 rounded"></div>
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-red-600">8% Last Month</span>
        </div>
      </div>

      {/* Overtime */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Overtime this Month</p>
            <p className="text-2xl font-bold text-pink-600">
              {overtimeMonth.toFixed(0)} <span className="text-sm text-gray-400">/ 28</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-pink-500 rounded"></div>
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-red-600">6% Last Month</span>
        </div>
      </div>
    </div>
  );
}
