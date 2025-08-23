import React, { useState, useEffect } from 'react';
import { Search, Edit2, Save, X, Users, Stethoscope, Filter, Trash2, Plus, RefreshCw, AlertCircle } from 'lucide-react';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Filter states
  const [searchFilter, setSearchFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch doctors from API
const fetchDoctors = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/doctor/get-doctors');
    console.log("Raw response:", response.status);

    const data = await response.json();
    console.log("Response data:", data);

    if (response.ok && data.success) {
      setDoctors(data.data);
      setFilteredDoctors(data.data);
    } else {
      setError(data.message || `Failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching doctors:', error);
    setError('Network error: Unable to fetch doctors');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchDoctors();
  }, []);

  // Filter effect
  useEffect(() => {
    let filtered = doctors;

    // Search by ID or Name
    if (searchFilter.trim()) {
      filtered = filtered.filter(doctor => 
        doctor.user_id?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        doctor.name?.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    // Filter by Department
    if (departmentFilter.trim()) {
      filtered = filtered.filter(doctor => 
        doctor.profile?.department?.toLowerCase().includes(departmentFilter.toLowerCase())
      );
    }

    // Filter by Status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doctor => 
        statusFilter === 'active' ? doctor.status : !doctor.status
      );
    }

    setFilteredDoctors(filtered);
  }, [searchFilter, departmentFilter, statusFilter, doctors]);

  const handleEdit = (doctor) => {
    setEditingId(doctor._id);
    setEditData({
      name: doctor.name || '',
      email: doctor.email || '',
      contact_number: doctor.contact_number || '',
      department: doctor.profile?.department || '',
      qualification: doctor.profile?.qualification || '',
      status: doctor.status
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async (doctorId) => {
    if (!editData.name.trim() || !editData.email.trim()) {
      setError('Name and email are required');
      return;
    }

    try {
      const response = await fetch(`/api/doctor/update-doctor/${doctorId}`, {
        method: 'POST', // Using POST as per your route definition
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Doctor updated successfully');
        await fetchDoctors();
        setEditingId(null);
        setEditData({});
        setError('');
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update doctor');
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
      setError('Network error: Unable to update doctor');
    }
  };

  const handleDelete = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor? This will set their status to inactive.')) {
      try {
        const response = await fetch(`/api/doctor/delete-doctor/${doctorId}`, {
          method: 'DELETE'
        });

        const data = await response.json();
        
        if (data.success) {
          setSuccess('Doctor deleted successfully');
          await fetchDoctors();
          setError('');
          // Clear success message after 3 seconds
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError(data.message || 'Failed to delete doctor');
        }
      } catch (error) {
        console.error('Error deleting doctor:', error);
        setError('Network error: Unable to delete doctor');
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
    setError('');
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setSearchFilter('');
    setDepartmentFilter('');
    setStatusFilter('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-lg text-gray-600 font-medium">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Doctor Management</h1>
              <p className="text-gray-600 mt-1">Manage and monitor healthcare professionals</p>
            </div>
            <div className="ml-auto flex gap-3">
              <button
                onClick={fetchDoctors}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
          
          {/* Alert Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-400 rounded-full mr-2 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-green-700">{success}</p>
              </div>
            </div>
          )}
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Doctor
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="ID or name..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Department..."
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-600">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-medium">
                Showing {filteredDoctors.length} of {doctors.length} doctors
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Doctor Information
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Contact Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Qualification
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredDoctors.map((doctor, index) => (
                  <tr key={doctor._id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        {editingId === doctor._id ? (
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Doctor name"
                          />
                        ) : (
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{doctor.name}</div>
                            <div className="text-sm text-gray-500 font-mono">{doctor.user_id}</div>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === doctor._id ? (
                        <div className="space-y-2">
                          <input
                            type="email"
                            value={editData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Email address"
                          />
                          <input
                            type="text"
                            value={editData.contact_number}
                            onChange={(e) => handleInputChange('contact_number', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Phone number"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm text-gray-900">{doctor.email || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{doctor.contact_number || 'N/A'}</div>
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === doctor._id ? (
                        <input
                          type="text"
                          value={editData.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Department"
                        />
                      ) : (
                        <span className="text-sm text-gray-900 bg-blue-50 px-3 py-1 rounded-full">
                          {doctor.profile?.department || 'Not assigned'}
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 max-w-xs">
                      {editingId === doctor._id ? (
                        <textarea
                          value={editData.qualification}
                          onChange={(e) => handleInputChange('qualification', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                          rows={2}
                          placeholder="Qualifications"
                        />
                      ) : (
                        <span className="text-sm text-gray-900 break-words">
                          {doctor.profile?.qualification || 'Not specified'}
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === doctor._id ? (
                        <select
                          value={editData.status.toString()}
                          onChange={(e) => handleInputChange('status', e.target.value === 'true')}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          doctor.status 
                            ? 'bg-green-100 text-green-800 ring-1 ring-green-600/20' 
                            : 'bg-red-100 text-red-800 ring-1 ring-red-600/20'
                        }`}>
                          {doctor.status ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingId === doctor._id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(doctor._id)}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
                          >
                            <Save className="w-3 h-3" />
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-xs font-medium"
                          >
                            <X className="w-3 h-3" />
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(doctor)}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(doctor._id)}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredDoctors.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-500 mb-4">
                {searchFilter || departmentFilter || statusFilter !== 'all' 
                  ? 'Try adjusting your search criteria or filters'
                  : 'No doctors have been registered yet'
                }
              </p>
              {(searchFilter || departmentFilter || statusFilter !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorManagement;