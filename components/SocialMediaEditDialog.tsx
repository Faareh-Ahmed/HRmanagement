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

interface SocialMediaFormData {
    facebook: string;
    twitter: string;
    linkedin: string;
    whatsapp: string;
    youtube: string;
}

interface SocialMediaEditDialogProps {
    employee: Employee;
    onUpdate: (data: Partial<Employee>) => Promise<void>;
}

export default function SocialMediaEditDialog({ employee, onUpdate }: SocialMediaEditDialogProps) {
    const [open, setOpen] = React.useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: {  isSubmitSuccessful }
    } = useForm<SocialMediaFormData>({
        defaultValues: {
            facebook: employee.facebook || '',
            twitter: employee.twitter || '',
            linkedin: employee.linkedin || '',
            whatsapp: employee.whatsapp || '',
            youtube: employee.youtube || ''
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
                facebook: employee.facebook || '',
                twitter: employee.twitter || '',
                linkedin: employee.linkedin || '',
                whatsapp: employee.whatsapp || '',
                youtube: employee.youtube || ''
            });
        }
    }, [open, employee, reset]);

    const onSubmit = async (data: SocialMediaFormData) => {
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
                    <DialogTitle>Edit Social Media</DialogTitle>
                    <DialogDescription>
                        Update your social media links.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input 
                            id="facebook" 
                            placeholder="https://facebook.com/username"
                            {...register('facebook')} 
                        />
                    </div>
                    <div>
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input 
                            id="twitter" 
                            placeholder="https://twitter.com/username"
                            {...register('twitter')} 
                        />
                    </div>
                    <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input 
                            id="linkedin" 
                            placeholder="https://linkedin.com/in/username"
                            {...register('linkedin')} 
                        />
                    </div>
                    <div>
                        <Label htmlFor="whatsapp">WhatsApp</Label>
                        <Input 
                            id="whatsapp" 
                            placeholder="+1234567890"
                            {...register('whatsapp')} 
                        />
                    </div>
                    <div>
                        <Label htmlFor="youtube">YouTube</Label>
                        <Input 
                            id="youtube" 
                            placeholder="https://youtube.com/channel/username"
                            {...register('youtube')} 
                        />
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
