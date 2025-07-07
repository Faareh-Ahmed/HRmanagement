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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Edit } from 'lucide-react';
import { Employee } from '@/lib/types';

interface AboutMeFormData {
    aboutMe: string;
}

interface AboutMeEditDialogProps {
    employee: Employee;
    onUpdate: (data: Partial<Employee>) => Promise<void>;
}

export default function AboutMeEditDialog({ employee, onUpdate }: AboutMeEditDialogProps) {
    const [open, setOpen] = React.useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful }
    } = useForm<AboutMeFormData>({
        defaultValues: {
            aboutMe: employee.aboutMe || ''
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
                aboutMe: employee.aboutMe || ''
            });
        }
    }, [open, employee, reset]);

    const onSubmit = async (data: AboutMeFormData) => {
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
                    <DialogTitle>Edit About Me</DialogTitle>
                    <DialogDescription>
                        Update your about me information.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="aboutMe">About Me</Label>
                        <Textarea 
                            id="aboutMe" 
                            rows={6}
                            {...register('aboutMe', { required: true })} 
                        />
                        {errors.aboutMe && <p className="text-red-500 text-sm">About Me is required</p>}
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
