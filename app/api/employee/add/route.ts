// app/api/employee/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import Employee from "@/lib/database/models/employee.model";
import { clerkClient } from "@clerk/nextjs/server";

// If you need to connect to MongoDB, do it here (if not using Mongoose auto-connect)
import { connectToDatabase } from "@/lib/database/mongoose"; // implement if needed

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body
    const body = await req.json();
    const {
      userName,
      profilePicture,
      firstName,
      lastName,
      phoneNumber,
      joiningDate,
      department,
      designation,
      email,
      password,
    } = body;

    // (Optional) Connect to DB if not already connected
    await connectToDatabase();

    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create Clerk user
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.createUser({

      emailAddress: [email],
      password,
      firstName,
      lastName,
      username: userName,
    });

    console.log("Clerk user created:", clerkUser, " with Clerk ID:", clerkUser.id);

    // Auto-generate employeeId (e.g., FT- + timestamp)
    const employeeId = `FT-${Date.now()}`;

    // Create employee in MongoDB
    const employee = new Employee({
      clerkId: clerkUser.id,
      userName,
      profilePicture,
      firstName,
      lastName,
      employeeId,
      phoneNumber,
      joiningDate: new Date(joiningDate),
      department,
      designation,
      email,
      status: "active",
    });

    await employee.save();

    return NextResponse.json(
      { 
        message: "Employee added successfully", 
        employee: {
          id: employee._id,
          employeeId: employee.employeeId,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          clerkId: employee.clerkId, // Include in response for verification
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in /api/employee/add:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
