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

interface BankInfoFormData {
    accountNumber: string;
    bankName: string;
    branch: string;
}

interface BankInfoEditDialogProps {
    employee: Employee;
    onUpdate: (data: Partial<Employee>) => Promise<void>;
}

export default function BankInfoEditDialog({ employee, onUpdate }: BankInfoEditDialogProps) {
    const [open, setOpen] = React.useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful }
    } = useForm<BankInfoFormData>({
        defaultValues: {
            accountNumber: employee.accountNumber || '',
            bankName: employee.bankName || '',
            branch: employee.branch || ''
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
                accountNumber: employee.accountNumber || '',
                bankName: employee.bankName || '',
                branch: employee.branch || ''
            });
        }
    }, [open, employee, reset]);

    const onSubmit = async (data: BankInfoFormData) => {
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
                    <DialogTitle>Edit Bank Information</DialogTitle>
                    <DialogDescription>
                        Update bank account details.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input id="accountNumber" {...register('accountNumber', { required: true })} />
                        {errors.accountNumber && <p className="text-red-500 text-sm">Account Number is required</p>}
                    </div>
                    <div>
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input id="bankName" {...register('bankName', { required: true })} />
                        {errors.bankName && <p className="text-red-500 text-sm">Bank Name is required</p>}
                    </div>
                    <div>
                        <Label htmlFor="branch">Branch</Label>
                        <Input id="branch" {...register('branch', { required: true })} />
                        {errors.branch && <p className="text-red-500 text-sm">Branch is required</p>}
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
