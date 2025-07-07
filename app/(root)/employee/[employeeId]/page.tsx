'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Employee } from '@/lib/types';
import {
    ArrowLeft,
} from 'lucide-react';

// Use Font Awesome icons for better social media icon support
import {
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
    FaWhatsapp,
    FaYoutube
} from "react-icons/fa";



import { useRouter } from 'next/navigation';
import AboutMeEditDialog from '@/components/AboutMeEditDialog';
import BankInfoEditDialog from '@/components/BankInfoEditDialog';
import EducationEditDialog from '@/components/EducationEditDialog';
import EditEmployeeDialog from '@/components/EditEmployeeDialog';
import SocialMediaEditDialog from '@/components/SocialMediaEditDialog';
import Image from 'next/image';

export const dynamicParams = true;

export default function EmployeeProfilePage() {
    const params = useParams();
    const router = useRouter();
    const employeeId = params.employeeId as string;
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEmployee() {
            try {
                const res = await fetch(`/api/employee/${employeeId}`);
                if (!res.ok) throw new Error('Failed to fetch employee');
                const data = await res.json();
                setEmployee(data.employee);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Error fetching employee';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        }

        if (employeeId) {
            fetchEmployee();
        }
    }, [employeeId]);

    const handleUpdateEmployee = async (updatedData: Partial<Employee>) => {
        try {
            const res = await fetch(`/api/employee/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) throw new Error('Failed to update employee');

            const data = await res.json();
            setEmployee(data.employee);
            alert('Employee updated successfully');
        } catch (err) {
            console.error('Failed to Update employee:', err);
            alert('Failed to update employee');
        }
    };

    // Helper function to display field value or dash
    const displayValue = (value: string | undefined | null) => {
        return value && value.trim() !== '' ? value : '-';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (error || !employee) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">{error || 'Employee not found'}</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 flex">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-gray-900 "
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile Info */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="text-center">
                            <div className="mx-auto h-32 w-32 rounded-full overflow-hidden mb-4">
                                {employee.profilePicture ? (
                                    <Image
                                        src={employee.profilePicture}
                                        alt={`${employee.firstName} ${employee.lastName}`}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-3xl font-medium text-blue-600">
                                            {`${employee.firstName[0] || ''}${employee.lastName[0] || ''}`}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {`${employee.firstName} ${employee.lastName}`}
                            </h2>
                            <p className="text-gray-600">{employee.designation}</p>
                            <p className="text-sm text-gray-500 mt-1">{employee.department}</p>
                        </div>

                        {/* Social Media */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Social Media</h3>
                                <SocialMediaEditDialog employee={employee} onUpdate={handleUpdateEmployee} />
                            </div>
                            <div className="space-y-3">
                                {employee.facebook && employee.facebook.trim() !== '' && (
                                    <div className="flex items-center">
                                        <FaFacebookF className="h-5 w-5 text-blue-600 mr-3" />
                                        <span className="text-sm text-gray-600">{employee.facebook}</span>
                                    </div>
                                )}
                                {employee.twitter && employee.twitter.trim() !== '' && (
                                    <div className="flex items-center">
                                        <FaTwitter className="h-5 w-5 text-blue-400 mr-3" />
                                        <span className="text-sm text-gray-600">{employee.twitter}</span>
                                    </div>
                                )}
                                {employee.linkedin && employee.linkedin.trim() !== '' && (
                                    <div className="flex items-center">
                                        <FaLinkedinIn className="h-5 w-5 text-blue-700 mr-3" />
                                        <span className="text-sm text-gray-600">{employee.linkedin}</span>
                                    </div>
                                )}
                                {employee.whatsapp && employee.whatsapp.trim() !== '' && (
                                    <div className="flex items-center">
                                        <FaWhatsapp className="h-5 w-5 text-green-600 mr-3" />
                                        <span className="text-sm text-gray-600">{employee.whatsapp}</span>
                                    </div>
                                )}
                                {employee.youtube && employee.youtube.trim() !== '' && (
                                    <div className="flex items-center">
                                        <FaYoutube className="h-5 w-5 text-red-600 mr-3" />
                                        <span className="text-sm text-gray-600">{employee.youtube}</span>
                                    </div>
                                )}

                                {/* Show message if no social media links */}
                                {!employee.facebook && !employee.twitter && !employee.linkedin &&
                                    !employee.whatsapp && !employee.youtube && (
                                        <p className="text-gray-400 text-sm italic">No social media links provided</p>
                                    )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Column - Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About Me Section - Moved above Personal Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">About Me</h3>
                            <AboutMeEditDialog employee={employee} onUpdate={handleUpdateEmployee} />
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {employee.aboutMe && employee.aboutMe.trim() !== ''
                                ? employee.aboutMe
                                : <span className="text-gray-400 italic">No information provided</span>
                            }
                        </p>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                            <EditEmployeeDialog employee={employee} onUpdate={handleUpdateEmployee} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                                <p className="text-gray-900">{`${employee.firstName} ${employee.lastName}`}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Employee ID</label>
                                <p className="text-gray-900">{employee.employeeId}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                                <p className="text-gray-900">{displayValue(employee.gender)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Present Address</label>
                                <p className="text-gray-900">{displayValue(employee.presentAddress)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                                <p className="text-gray-900">
                                    {employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : '-'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Shift</label>
                                <p className="text-gray-900">{displayValue(employee.shift)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bank Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-medium text-gray-900">Bank Information</h3>
                            <BankInfoEditDialog employee={employee} onUpdate={handleUpdateEmployee} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Account Number</label>
                                <p className="text-gray-900">{displayValue(employee.accountNumber)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Bank Name</label>
                                <p className="text-gray-900">{displayValue(employee.bankName)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Branch</label>
                                <p className="text-gray-900">{displayValue(employee.branch)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Education */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-medium text-gray-900">Education</h3>
                            <EducationEditDialog employee={employee} onUpdate={handleUpdateEmployee} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">University</label>
                                <p className="text-gray-900">{displayValue(employee.university)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
                                <p className="text-gray-900">{displayValue(employee.department_education)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Year</label>
                                <p className="text-gray-900">{displayValue(employee.year)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
