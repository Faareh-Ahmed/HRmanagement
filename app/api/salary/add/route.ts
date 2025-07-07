import { NextRequest, NextResponse } from "next/server";
import Salary from "@/lib/database/models/salary.model";
import Employee from "@/lib/database/models/employee.model";
import { connectToDatabase } from "@/lib/database/mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { employeeId, ...salaryData } = body;

    // Find employee by employeeId
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }

    const salary = new Salary({
      employee: employee._id,
      ...salaryData,
    });

    await salary.save();

    return NextResponse.json({ message: "Salary added successfully", salary }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
