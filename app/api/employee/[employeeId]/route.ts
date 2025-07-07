import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/mongoose';
import Employee from '@/lib/database/models/employee.model';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  try {
    await connectToDatabase();
    
    // Await the params object before accessing its properties
    const { employeeId } = await params;
    
    const employee = await Employee.findOne({ employeeId: employeeId });
    
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    
    return NextResponse.json({ employee });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  try {
    await connectToDatabase();
    
    // Await the params object before accessing its properties
    const { employeeId } = await params;
    const body = await request.json();
    
    const updatedEmployee = await Employee.findOneAndUpdate(
      { employeeId: employeeId },
      body,
      { new: true }
    );
    
    if (!updatedEmployee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    
    return NextResponse.json({ employee: updatedEmployee });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
