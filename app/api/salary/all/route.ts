import { NextResponse } from "next/server";
import Salary from "@/lib/database/models/salary.model";
import { connectToDatabase } from "@/lib/database/mongoose";

export async function GET() {
  try {
    await connectToDatabase();
    // Populate employee details
    const salaries = await Salary.find().populate('employee');
    return NextResponse.json({ salaries }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch salaries", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
