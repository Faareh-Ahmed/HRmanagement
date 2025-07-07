import { Schema, Document, model, models } from 'mongoose';

export interface IEmployee extends Document {
  clerkId: string;
  userName: string;
  profilePicture?: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  phoneNumber: string;
  joiningDate: Date;
  department: string;
  designation: string;
  email: string;
  status: string;
  // Personal Information
  gender?: string;
  dateOfBirth?: Date;
  presentAddress?: string;
  shift?: string;
  // Bank Information
  accountNumber?: string;
  bankName?: string;
  branch?: string;
  // Education
  university?: string;
  department_education?: string;
  year?: string;
  // About Me
  aboutMe?: string;
  // Social Media
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  whatsapp?: string;
  youtube?: string;
}

const EmployeeSchema: Schema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      default: 'active',
    },
    // Personal Information
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    dateOfBirth: {
      type: Date,
    },
    presentAddress: {
      type: String,
    },
    shift: {
      type: String,
    },
    // Bank Information
    accountNumber: {
      type: String,
    },
    bankName: {
      type: String,
    },
    branch: {
      type: String,
    },
    // Education
    university: {
      type: String,
    },
    department_education: {
      type: String,
    },
    year: {
      type: String,
    },
    // About Me
    aboutMe: {
      type: String,
    },
    // Social Media
    facebook: {
      type: String,
    },
    twitter: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    whatsapp: {
      type: String,
    },
    youtube: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Employee = models.Employee || model<IEmployee>('Employee', EmployeeSchema);

export default Employee;
