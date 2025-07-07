'use client';

import * as React from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Edit } from 'lucide-react';
import { Employee } from '@/lib/types';

interface EducationFormData {
    university: string;
    department_education: string;
    year: string;
}

interface EducationEditDialogProps {
    employee: Employee;
    onUpdate: (data: Partial<Employee>) => Promise<void>;
}

export default function EducationEditDialog({ employee, onUpdate }: EducationEditDialogProps) {
    const [open, setOpen] = React.useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful }
    } = useForm<EducationFormData>({
        defaultValues: {
            university: employee.university || '',
            department_education: employee.department_education || '',
            year: employee.year || ''
        }
    });

    React.useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
            setOpen(false);
        }
    }, [isSubmitSuccessful, reset]);

    React.useEffect(() => {
        if (open) {
            reset({
                university: employee.university || '',
                department_education: employee.department_education || '',
                year: employee.year || ''
            });
        }
    }, [open, employee, reset]);

    const onSubmit = async (data: EducationFormData) => {
        await onUpdate(data);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50">
                    <Edit className="h-4 w-4" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg w-full max-h-[90vh] overflow-y-auto my-8 rounded-xl shadow-xl border bg-white z-[99]">
                <DialogHeader>
                    <DialogTitle>Edit Education</DialogTitle>
                    <DialogDescription>
                        Update education information.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="university">University</Label>
                        <Input id="university" {...register('university', { required: true })} />
                        {errors.university && <p className="text-red-500 text-sm">University is required</p>}
                    </div>
                    <div>
                        <Label htmlFor="department_education">Department</Label>
                        <Input id="department_education" {...register('department_education', { required: true })} />
                        {errors.department_education && <p className="text-red-500 text-sm">Department is required</p>}
                    </div>
                    <div>
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" placeholder="e.g., 2019-2023" {...register('year', { required: true })} />
                        {errors.year && <p className="text-red-500 text-sm">Year is required</p>}
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button type="submit">Save Profile</Button>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
