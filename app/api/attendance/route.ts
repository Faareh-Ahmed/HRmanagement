
import {  NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/database/mongoose';
import Attendance from '@/lib/database/models/attendance.model';
import Employee from '@/lib/database/models/employee.model';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get current user from Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find employee by Clerk userId (you'll need to add clerkId field to Employee model)
    const employee = await Employee.findOne({ clerkId: userId });
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get all attendance records for the employee (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const records = await Attendance.find({
      employeeId: employee._id,
      date: { $gte: thirtyDaysAgo }
    })
    .populate('employeeId', 'firstName lastName employeeId')
    .sort({ date: -1 })
    .lean();
    
    // Get today's attendance
    const todayRecord = await Attendance.findOne({
      employeeId: employee._id,
      date: today
    }).lean();

    return NextResponse.json({
      records: records,
      today: todayRecord,
      employee: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        profilePicture: employee.profilePicture
      }
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance data' },
      { status: 500 }
    );
  }
}
