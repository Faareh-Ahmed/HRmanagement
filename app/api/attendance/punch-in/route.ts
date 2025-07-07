import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/database/mongoose';
import Attendance from '@/lib/database/models/attendance.model';
import Employee from '@/lib/database/models/employee.model';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get current user from Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find employee by Clerk userId
    const employee = await Employee.findOne({ clerkId: userId });
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const { checkInTime } = await request.json();
    const date = new Date(checkInTime);
    date.setHours(0, 0, 0, 0);
    
    // Check if already punched in today
    const existing = await Attendance.findOne({
      employeeId: employee._id,
      date: date
    });
    
    if (existing) {
      return NextResponse.json(
        { error: 'Already punched in today' },
        { status: 400 }
      );
    }
    
    // Calculate if late (assuming work starts at 9:00 AM)
    const checkIn = new Date(checkInTime);
    const workStartTime = new Date(date);
    workStartTime.setHours(9, 0, 0, 0);
    
    const lateMinutes = checkIn > workStartTime ? 
      Math.floor((checkIn.getTime() - workStartTime.getTime()) / (1000 * 60)) : 0;
    
    // Create new attendance record
    const attendance = new Attendance({
      employeeId: employee._id,
      date: date,
      checkInTime: checkInTime,
      status: lateMinutes > 0 ? 'Late' : 'Present',
      lateMinutes: lateMinutes
    });
    
    await attendance.save();
    
    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    console.error('Error punching in:', error);
    return NextResponse.json(
      { error: 'Failed to punch in' },
      { status: 500 }
    );
  }
}
