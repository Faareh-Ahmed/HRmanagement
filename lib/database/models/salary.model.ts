import { Schema, Document, model, models, Types } from 'mongoose';

export interface ISalary extends Document {
  employee: Types.ObjectId; // Reference to Employee
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
  createdAt: Date;
}

const SalarySchema: Schema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    netSalary: { type: Number, required: true },
    basic: { type: Number, required: true },
    da: { type: Number, required: true },
    hra: { type: Number, required: true },
    conveyance: { type: Number, default: 0 },
    allowance: { type: Number, default: 0 },
    medicalAllowance: { type: Number, default: 0 },
    othersEarnings: { type: Number, default: 0 },
    tds: { type: Number, default: 0 },
    esi: { type: Number, default: 0 },
    pf: { type: Number, default: 0 },
    leave: { type: Number, default: 0 },
    profTax: { type: Number, default: 0 },
    labourWelfare: { type: Number, default: 0 },
    othersDeductions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Salary = models.Salary || model<ISalary>('Salary', SalarySchema);
export default Salary;
