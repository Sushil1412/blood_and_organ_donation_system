import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from '../../components/Header/AdminHeader';
import { useAuth } from '../../context/AuthContext';
const OrganDonor = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrgans, setSelectedOrgans] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState(['active']);
    const [allOrgans, setAllOrgans] = useState([]);
  const { token } = useAuth();
    // Fetch donors from API
    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/hospitalmypledge`, {
                    params: {
                        donationType: 'organ'
                    }
                ,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
                setDonors(response.data.data);

                // Extract all unique organ types
                const organs = [...new Set(response.data.data.flatMap(donor => donor.organTypes || []))];
                setAllOrgans(organs);

                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch donors');
                setLoading(false);
            }
        };
        fetchDonors();
    }, []);

    // Toggle donor status
    const toggleDonorStatus = async (donorId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/auth/updatedonorstatus/${donorId}`,
                { status: newStatus },
                {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
            );

            setDonors(donors.map(donor =>
                donor._id === donorId ? { ...donor, status: newStatus } : donor
            ));
        } catch (err) {
            alert(err.response?.data?.message || err.message || 'Failed to update status');
        }
    };

    // Toggle organ selection
    const toggleOrganSelection = (organ) => {
        setSelectedOrgans(prev =>
            prev.includes(organ)
                ? prev.filter(o => o !== organ)
                : [...prev, organ]
        );
    };

    // Toggle status selection
    const toggleStatusSelection = (status) => {
        setSelectedStatuses(prev =>
            prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
    };

    // Filter donors based on selected filters
    const filteredDonors = donors.filter(donor => {
        // Search filter (name or Aadhaar)
        const matchesSearch = searchTerm === '' ||
            donor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donor.aadharNumber?.includes(searchTerm);

        // Organ filter
        const matchesOrgan = selectedOrgans.length === 0 ||
            (donor.organTypes && selectedOrgans.some(organ => donor.organTypes.includes(organ)));

        // Status filter
        const matchesStatus = selectedStatuses.length === 0 ||
            selectedStatuses.includes(donor.status);

        return matchesSearch && matchesOrgan && matchesStatus;
    });

    if (loading) {
        return (
            <>
                <AdminHeader />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <AdminHeader />
                <div className="bg-white shadow rounded-lg p-8 text-center max-w-2xl mx-auto mt-10">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Error Loading Donors</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <AdminHeader />
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-red-700 mb-2">Organ Donor Registry</h1>
                        <p className="text-gray-600">
                            Manage organ donors registered in the system
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        {/* Combined Search Bar */}
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Search donors by name or Aadhaar number..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filters Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Organ Filter Checkboxes */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Organ:</h3>
                                <div className="flex flex-wrap gap-3">
                                    {allOrgans.map(organ => (
                                        <label key={organ} className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                                checked={selectedOrgans.includes(organ)}
                                                onChange={() => toggleOrganSelection(organ)}
                                            />
                                            <span className="ml-2 text-gray-700">{organ}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Status Filter Checkboxes */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Status:</h3>
                                <div className="flex flex-wrap gap-3">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                            checked={selectedStatuses.includes('active')}
                                            onChange={() => toggleStatusSelection('active')}
                                        />
                                        <span className="ml-2 text-gray-700">Active</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                            checked={selectedStatuses.includes('inactive')}
                                            onChange={() => toggleStatusSelection('inactive')}
                                        />
                                        <span className="ml-2 text-gray-700">Inactive</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-4">
                        <p className="text-gray-600">
                            Showing <span className="font-bold text-red-700">{filteredDonors.length}</span> {filteredDonors.length === 1 ? 'donor' : 'donors'}
                        </p>
                    </div>

                    {/* Donors List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDonors.length > 0 ? (
                            filteredDonors.map(donor => (
                                <div key={donor._id} className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border-l-4 ${donor.status === 'active' ? 'border-green-500' : 'border-gray-400'}`}>
                                    <div className="p-6">
                                        {/* Donor Header */}
                                        <div className="mb-4">
                                            <div className="flex justify-between items-start">
                                                <h2 className="text-xl font-bold text-gray-800">{donor.name}</h2>
                                                <span className={`px-2 py-1 text-xs rounded-full ${donor.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {donor.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center mt-1">
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-2">
                                                    {donor.bloodGroup}
                                                </span>
                                                <span className="text-gray-600 text-sm">{donor.age} years</span>
                                            </div>
                                        </div>

                                        {/* Donor Info */}
                                        <div className="mb-4">
                                            <p className="text-gray-600 mb-2">
                                                <span className="font-medium">Aadhaar:</span> {donor.aadharNumber || 'N/A'}
                                            </p>
                                            <p className="text-gray-600 mb-2">
                                                <span className="font-medium">Location:</span> {donor.city}, {donor.state}
                                            </p>
                                            <p className="text-gray-600 mb-2">
                                                <span className="font-medium">Contact:</span> {donor.phone || 'N/A'}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Registered:</span> {new Date(donor.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {/* Organs */}
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-1">Pledged Organs:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {donor.organTypes?.map(organ => (
                                                    <span key={organ} className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                                                        {organ}
                                                    </span>
                                                )) || 'None specified'}
                                            </div>
                                        </div>

                                        {/* Medical History */}
                                        {donor.medicalHistory && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-1">Medical Notes:</h4>
                                                <p className="text-gray-600 text-sm">{donor.medicalHistory}</p>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex justify-between items-center mt-6">
                                            <button
                                                className="text-blue-600 font-medium hover:text-blue-800 transition-colors text-sm"
                                                onClick={() => toggleDonorStatus(donor._id, donor.status)}
                                            >
                                                {donor.status === 'active' ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <div className="space-x-2">
                                                <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                                                    View
                                                </button>
                                                <button className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm">
                                                    Contact
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-xl font-medium text-gray-700 mb-2">
                                    No donors found matching your criteria
                                </h3>
                                <p className="text-gray-500">Try adjusting your filters</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrganDonor;