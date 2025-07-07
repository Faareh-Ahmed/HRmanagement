// lib/database/models/attendance.model.ts
import { Schema, Document, model, models, Types } from 'mongoose';

export interface IAttendance extends Document {
  employeeId: Types.ObjectId;
  date: Date;
  checkInTime?: Date;
  checkOutTime?: Date;
  workingHours: number;
  breakTime: number;
  overtimeHours: number;
  status: 'Present' | 'Absent' | 'Late';
  productionHours: number;
  lateMinutes?: number;
  notes?: string;
  // Add these timestamp fields that Mongoose automatically creates
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema: Schema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    workingHours: {
      type: Number,
      default: 0,
    },
    breakTime: {
      type: Number,
      default: 0,
    },
    overtimeHours: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late'],
      default: 'Absent',
    },
    productionHours: {
      type: Number,
      default: 0,
    },
    lateMinutes: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = models.Attendance || model<IAttendance>('Attendance', AttendanceSchema);

export default Attendance;
