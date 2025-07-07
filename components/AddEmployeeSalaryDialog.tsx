'use client';

import * as React from 'react';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { useFetchEmployees } from '@/hooks/UseFetchEmployee';
import { SalaryFormData } from '@/lib/types/index'; // Import the type


export default function AddEmployeeSalaryDialog({ onAdd }: { onAdd: (data: SalaryFormData) => Promise<void> }) {
  const [open, setOpen] = React.useState(false);
  const { employees } = useFetchEmployees();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitSuccessful }
  } = useForm<SalaryFormData>({
    defaultValues: {
      employeeId: '',
      netSalary: 0,
      basic: 0,
      da: 0,
      hra: 0,
      conveyance: 0,
      allowance: 0,
      medicalAllowance: 0,
      othersEarnings: 0,
      tds: 0,
      esi: 0,
      pf: 0,
      leave: 0,
      profTax: 0,
      labourWelfare: 0,
      othersDeductions: 0,
    }
  });

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setOpen(false);
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit = async (data: SalaryFormData) => {
    await onAdd(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Salary</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg w-full max-h-[90vh] overflow-y-auto my-8 rounded-xl shadow-xl border bg-white z-[99] backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>Add Employee Salary</DialogTitle>
          <DialogDescription>
            Fill in the details below to add salary for an employee.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="employeeId">Employee Name</Label>
            <Controller
              name="employeeId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="employeeId">
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent className='z-[110]'>
                    {employees.map(emp => (
                      <SelectItem key={emp.employeeId} value={emp.employeeId}>
                        {emp.firstName} {emp.lastName} ({emp.employeeId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.employeeId && <p className="text-red-500 text-sm">Employee is required</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Net Salary</Label>
              <Input type="number" {...register('netSalary', { required: true })} />
            </div>
            <div>
              <Label>Basic</Label>
              <Input type="number" {...register('basic', { required: true })} />
            </div>
            <div>
              <Label>DA (40%)</Label>
              <Input type="number" {...register('da', { required: true })} />
            </div>
            <div>
              <Label>HRA (15%)</Label>
              <Input type="number" {...register('hra', { required: true })} />
            </div>
            <div>
              <Label>Conveyance</Label>
              <Input type="number" {...register('conveyance')} />
            </div>
            <div>
              <Label>Allowance</Label>
              <Input type="number" {...register('allowance')} />
            </div>
            <div>
              <Label>Medical Allowance</Label>
              <Input type="number" {...register('medicalAllowance')} />
            </div>
            <div>
              <Label>Others (Earnings)</Label>
              <Input type="number" {...register('othersEarnings')} />
            </div>
          </div>
          <div className="font-semibold mt-2">Deductions</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>TDS</Label>
              <Input type="number" {...register('tds')} />
            </div>
            <div>
              <Label>ESI</Label>
              <Input type="number" {...register('esi')} />
            </div>
            <div>
              <Label>PF</Label>
              <Input type="number" {...register('pf')} />
            </div>
            <div>
              <Label>Leave</Label>
              <Input type="number" {...register('leave')} />
            </div>
            <div>
              <Label>Prof. Tax</Label>
              <Input type="number" {...register('profTax')} />
            </div>
            <div>
              <Label>Labour Welfare</Label>
              <Input type="number" {...register('labourWelfare')} />
            </div>
            <div>
              <Label>Others (Deductions)</Label>
              <Input type="number" {...register('othersDeductions')} />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button type="submit">Add Employee Salary</Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
