
import { NextResponse } from "next/server";
import Employee from "@/lib/database/models/employee.model";
import { connectToDatabase } from "@/lib/database/mongoose"; // if needed

export async function GET() {
  try {
    await connectToDatabase(); // Uncomment if you need manual connection
    const employees = await Employee.find().sort({ joiningDate: -1 });
    return NextResponse.json({ employees }, { status: 200 });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { message: "Failed to fetch employees", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
