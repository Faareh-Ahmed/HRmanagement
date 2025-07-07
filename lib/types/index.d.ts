
export type CreateUserParams = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string | null; // Clerk can send null for these
  lastName: string | null;  // Clerk can send null for these
  photo: string | null;
};

export type UpdateUserParams = {
  firstName?: string;
  lastName?: string;
  username?: string;
  photo?: string;
};

export interface Employee {
  userName: string;
  profilePicture?: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  phoneNumber: string;
  joiningDate: string; // ISO string
  department: 'Finance' | 'Procurement' | 'Supply Chain' | 'Quality' | 'HR' | 'Sales and Marketing' | 'IT' | 'Web Design';
  designation: string;
  email: string;
  password?: string;
  status?: 'active' | 'inactive';
  // Personal Information
  gender?: string;
  dateOfBirth?: string;
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



export interface Salary {
  _id: string;
  employeeId: string;
  employee: Employee;
  netSalary: number;
  basic: number;
  da: number;
  hra: number;
  conveyance: number;
  allowance: number;
  medicalAllowance: number;
  othersEarnings: number;
  tds: number;
  esi: number;
  pf: number;
  leave: number;
  profTax: number;
  labourWelfare: number;
  othersDeductions: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalaryFormData {
  employeeId: string;
  netSalary: number;
  basic: number;
  da: number;
  hra: number;
  conveyance: number;
  allowance: number;
  medicalAllowance: number;
  othersEarnings: number;
  tds: number;
  esi: number;
  pf: number;
  leave: number;
  profTax: number;
  labourWelfare: number;
  othersDeductions: number;
}
