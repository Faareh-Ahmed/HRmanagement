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
import { Employee } from '@/lib/types';

interface EmployeeFormData extends Omit<Employee, 'confirmPassword'> {
  confirmPassword: string;
}

export default function AddEmployeeDialog({ onAdd }: { onAdd: (data: Employee) => Promise<void> }) {
    const [open, setOpen] = React.useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitSuccessful }
    } = useForm<EmployeeFormData>({
        defaultValues: {
            userName: '',
            profilePicture: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            joiningDate: '',
            department: undefined,
            designation: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    // Reset form and close dialog after successful submit
    React.useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
            setOpen(false);
        }
    }, [isSubmitSuccessful, reset]);

    const onSubmit = async (data: EmployeeFormData) => {
        if (data.password !== data.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        await onAdd(data);
        // Form will reset and dialog will close via useEffect above
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Add Employee</Button>
            </DialogTrigger>
            <DialogContent
                className="
      sm:max-w-lg w-full max-h-[90vh] overflow-y-auto my-8
      rounded-xl shadow-xl border bg-white z-[99] backdrop-blur-md
    "
                style={{
                    background: 'rgba(255,255,255,0.85)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
                }}
            >
                <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a new employee.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="userName">User Name</Label>
                        <Input id="userName" {...register('userName', { required: true })} />
                        {errors.userName && <p className="text-red-500 text-sm">User Name is required</p>}
                    </div>
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
                    <div>
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input id="phoneNumber" {...register('phoneNumber', { required: true })} />
                        {errors.phoneNumber && <p className="text-red-500 text-sm">Phone Number is required</p>}
                    </div>
                    <div>
                        <Label htmlFor="joiningDate">Joining Date</Label>
                        <Input id="joiningDate" type="date" {...register('joiningDate', { required: true })} />
                        {errors.joiningDate && <p className="text-red-500 text-sm">Joining Date is required</p>}
                    </div>
                    <Controller
                        name="department"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="department">
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
                        )}
                    />
                    {errors.department && (
                        <p className="text-red-500 text-sm">Department is required</p>
                    )}

                    <div>
                        <Label htmlFor="designation">Designation</Label>
                        <Input id="designation" {...register('designation', { required: true })} />
                        {errors.designation && <p className="text-red-500 text-sm">Designation is required</p>}
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register('email', { required: true })} />
                        {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" {...register('password', { required: true })} />
                        {errors.password && <p className="text-red-500 text-sm">Password is required</p>}
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" {...register('confirmPassword', { required: true })} />
                        {errors.confirmPassword && <p className="text-red-500 text-sm">Confirm Password is required</p>}
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button type="submit">Add Employee</Button>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
