'use client';
import { Users, Search, MoreHorizontal, Download } from 'lucide-react';
import { useFetchSalaries } from '@/hooks/UseFetchSalary';
import { useAddSalary } from '@/hooks/UseAddSalary';
import { useFetchEmployees } from '@/hooks/UseFetchEmployee';
import AddEmployeeSalaryDialog from '@/components/AddEmployeeSalaryDialog';
import { useMemo, useState } from 'react';
import { SalaryFormData } from '@/lib/types';

export default function SalaryPage() {
  const { salaries, loading, error, setSalaries } = useFetchSalaries();
  const { addSalary } = useAddSalary();
  const { employees, loading: empLoading } = useFetchEmployees();

  // --- Stats Calculation ---
  const totalEmployees = employees.length;
  const maleCount = 6;
  const femaleCount = 4;
  const newEmployees = useMemo(
    () => employees.filter(e => {
      const joinDate = new Date(e.joiningDate);
      const now = new Date();
      const diffDays = (now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 30;
    }).length,
    [employees]
  );

  // --- Search and Filter State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // --- Filtered Salaries ---
  const filteredSalaries = useMemo(() => {
    return salaries.filter(salary => {
      const emp = salary.employee;
      
      const matchesSearch = searchTerm === '' || (
        emp && (
          `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      const matchesStatus = statusFilter === '' || statusFilter === 'Select Status' || (
        emp && emp.status?.toLowerCase() === statusFilter.toLowerCase()
      );

      const matchesPriority = priorityFilter === '' || priorityFilter === 'Select Priority';

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [salaries, searchTerm, statusFilter, priorityFilter]);

  const handleAddSalary = async (data: SalaryFormData) => {
    try {
      const res = await addSalary(data);
      setSalaries((prev) => [...prev, res.salary]);
      alert('Salary added successfully');
    } catch (err) {
      console.error('Failed to add salary:', err);
      alert('Failed to add salary');
    }
  };

  const handleSearch = () => {
    // Optional: Add additional search logic here if needed
    console.log('Searching for:', searchTerm);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Employee Salary</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage employee salary details
            {searchTerm && (
              <span className="ml-2 text-blue-600">
                ({filteredSalaries.length} of {salaries.length} salary records found)
              </span>
            )}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <AddEmployeeSalaryDialog onAdd={handleAddSalary} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5 flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Employee</dt>
                <dd className="text-2xl font-semibold text-gray-900">{empLoading ? '...' : totalEmployees}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5 flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">New Employee</dt>
                <dd className="text-2xl font-semibold text-gray-900">{empLoading ? '...' : newEmployees}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5 flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Male</dt>
                <dd className="text-2xl font-semibold text-gray-900">{empLoading ? '...' : maleCount}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5 flex items-center">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Female</dt>
                <dd className="text-2xl font-semibold text-gray-900">{empLoading ? '...' : femaleCount}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Employee Name"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <select
              className="block w-40 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select
              className="block w-40 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg"
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleSearch}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </button>
            {(searchTerm || statusFilter || priorityFilter) && (
              <button 
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Salary Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : filteredSalaries.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {searchTerm || statusFilter || priorityFilter 
                ? 'No salary records found matching your search criteria.' 
                : 'No salary records found.'}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payslip</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSalaries.map((salary) => (
                  <tr key={salary._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {salary.employee ? salary.employee.employeeId : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {salary.employee
                        ? `${salary.employee.firstName} ${salary.employee.lastName}`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {salary.employee
                        ? `${salary.employee.email}`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {salary.employee ? salary.employee.designation : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {salary.employee ? salary.employee.department : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{salary.netSalary}</td>
                    <td className="px-6 py-4 whitespace-nowrap">Full-Time</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Pagination (optional, can be added as in employee page) */}
      </div>
    </div>
  );
}
