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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { Edit } from 'lucide-react';
import { Employee } from '@/lib/types';

interface EditEmployeeFormData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    department: "Finance" | "Procurement" | "Supply Chain" | "Quality" | "HR" | "Sales and Marketing" | "IT" | "Web Design" | undefined;
    designation: string;
    gender: string;
    presentAddress: string;
    shift: string;
    dateOfBirth: string;
    profilePicture: string;
}

interface EditEmployeeDialogProps {
    employee: Employee;
    onUpdate: (data: Partial<Employee>) => Promise<void>;
}

export default function EditEmployeeDialog({ employee, onUpdate }: EditEmployeeDialogProps) {
    const [open, setOpen] = React.useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitSuccessful }
    } = useForm<EditEmployeeFormData>({
        defaultValues: {
            firstName: employee.firstName || '',
            lastName: employee.lastName || '',
            phoneNumber: employee.phoneNumber || '',
            email: employee.email || '',
            department: employee.department || '',
            designation: employee.designation || '',
            gender: employee.gender || '',
            presentAddress: employee.presentAddress || '',
            shift: employee.shift || '',
            dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().split('T')[0] : '',
            profilePicture: employee.profilePicture || ''
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
                firstName: employee.firstName || '',
                lastName: employee.lastName || '',
                phoneNumber: employee.phoneNumber || '',
                email: employee.email || '',
                department: employee.department || '',
                designation: employee.designation || '',
                gender: employee.gender || '',
                presentAddress: employee.presentAddress || '',
                shift: employee.shift || '',
                dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().split('T')[0] : '',
                profilePicture: employee.profilePicture || ''
            });
        }
    }, [open, employee, reset]);

    const onSubmit = async (data: EditEmployeeFormData) => {
        await onUpdate(data);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8 rounded-xl shadow-xl border bg-white z-[99]">
                <DialogHeader>
                    <DialogTitle>Edit Employee Profile</DialogTitle>
                    <DialogDescription>
                        Update employee information.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="profilePicture">Profile Picture URL</Label>
                        <Input id="profilePicture" {...register('profilePicture')} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" {...register('firstName', { required: true })} />
                            {errors.firstName && <p className="text-red-500 text-sm">First Name is required</p>}
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" {...register('lastName', { required: true })} />
                            {errors.lastName && <p className="text-red-500 text-sm">Last Name is required</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input id="phoneNumber" {...register('phoneNumber', { required: true })} />
                            {errors.phoneNumber && <p className="text-red-500 text-sm">Phone Number is required</p>}
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register('email', { required: true })} />
                            {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="department"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <div>
                                    <Label>Department</Label>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a department" />
                                        </SelectTrigger>
                                        <SelectContent className='z-[110]'>
                                            <SelectItem value="Finance">Finance</SelectItem>
                                            <SelectItem value="Procurement">Procurement</SelectItem>
                                            <SelectItem value="Supply Chain">Supply Chain</SelectItem>
                                            <SelectItem value="Quality">Quality</SelectItem>
                                            <SelectItem value="HR">HR</SelectItem>
                                            <SelectItem value="Sales and Marketing">Sales and Marketing</SelectItem>
                                            <SelectItem value="IT">IT</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        />
                        <div>
                            <Label htmlFor="designation">Designation</Label>
                            <Input id="designation" {...register('designation', { required: true })} />
                            {errors.designation && <p className="text-red-500 text-sm">Designation is required</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <div>
                                    <Label>Gender</Label>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent className='z-[110]'>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        />
                        <div>
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="presentAddress">Present Address</Label>
                            <Input id="presentAddress" {...register('presentAddress')} />
                        </div>
                        <div>
                            <Label htmlFor="shift">Shift</Label>
                            <Input id="shift" {...register('shift')} />
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button type="submit">Update Profile</Button>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
