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

    const { checkOutTime, workingHours } = await request.json();
    const date = new Date(checkOutTime);
    date.setHours(0, 0, 0, 0);
    
    // Find today's attendance record
    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: date
    });
    
    if (!attendance) {
      return NextResponse.json(
        { error: 'No punch-in record found for today' },
        { status: 400 }
      );
    }
    
    // Calculate production hours (working hours - break time)
    const breakTimeHours = 0.75; // 45 minutes break
    const productionHours = Math.max(0, workingHours - breakTimeHours);
    const overtimeHours = Math.max(0, workingHours - 8);
    
    // Update attendance record
    attendance.checkOutTime = new Date(checkOutTime);
    attendance.workingHours = workingHours;
    attendance.productionHours = productionHours;
    attendance.overtimeHours = overtimeHours;
    attendance.breakTime = 45; // 45 minutes in minutes
    attendance.status = workingHours >= 8 ? 'Present' : 'Absent';
    
    await attendance.save();
    
    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    console.error('Error punching out:', error);
    return NextResponse.json(
      { error: 'Failed to punch out' },
      { status: 500 }
    );
  }
}
