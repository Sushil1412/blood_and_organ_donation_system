import { useState, useEffect } from 'react';
import { FaUserMd, FaHospital, FaCheck, FaTimes, FaSearch, FaSpinner } from 'react-icons/fa';
import AdminHeader from '../../components/Header/AdminHeader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';
const Registration = () => {
    const [requests, setRequests] = useState({ donors: [], hospitals: [] });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();
    // Fetch requests from API
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('userToken');

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/adminrequests`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 404) {
                    throw new Error('Endpoint not found');
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch requests');
                }

                const data = await response.json();

                // Format data with null checks
                const formattedData = {
                    donors: (data.donors || []).map(donor => ({
                        id: donor?._id || '',
                        type: 'donor',
                        name: `${donor?.firstName || ''} ${donor?.lastName || ''}`.trim(),
                        email: donor?.email || '',
                        bloodType: donor?.bloodType || '',
                        contact: donor?.phone || '',
                        status: donor?.status || 'pending',
                        submittedAt: donor?.createdAt || new Date()
                    })),
                    hospitals: (data.hospitals || []).map(hospital => ({
                        id: hospital?._id || '',
                        type: 'hospital',
                        name: hospital?.hospitalName || '',
                        email: hospital?.email || '',
                        address: hospital?.address || '',
                        contact: hospital?.phone || '',
                        status: hospital?.status || 'pending',
                        submittedAt: hospital?.createdAt || new Date()
                    }))
                };

                setRequests(formattedData);
            } catch (error) {
                console.error('Error fetching requests:', error);
                toast.error(error.message || 'Failed to load requests');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const updateRequestStatus = async (id, type, newStatus) => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/adminrequests/${type}/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update status');
            }

            const updatedData = await response.json();

            setRequests(prev => ({
                ...prev,
                [type + 's']: prev[type + 's'].map(item =>
                    item.id === id ? { ...item, status: newStatus } : item
                )
            }));

            toast.success(`Request ${newStatus} successfully`);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(error.message || `Failed to ${newStatus} request`);
        }
    };

    const handleApprove = (id, type) => {
        updateRequestStatus(id, type, 'approved');
    };

    const handleReject = (id, type) => {
        updateRequestStatus(id, type, 'rejected');
    };

    // Combine and filter requests with null checks
    const combinedRequests = [...requests.donors, ...requests.hospitals];

    const filteredRequests = combinedRequests.filter(request => {
        const matchesFilter = filter === 'all' || request?.status === filter;

        const searchableName = request?.name?.toLowerCase() || '';
        const searchableEmail = request?.email?.toLowerCase() || '';
        const lowerSearchTerm = searchTerm.toLowerCase();

        const matchesSearch =
            searchableName.includes(lowerSearchTerm) ||
            searchableEmail.includes(lowerSearchTerm);

        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <>
            <AdminHeader />
            <div className="min-h-screen bg-gray-50">
                <main className="container mx-auto px-4 py-8">
                    {/* Filters and Search */}
                    <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="relative flex-grow max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <label className="text-gray-700">Filter by status:</label>
                                <select
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                >
                                    <option value="all">All</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Requests Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center items-center p-12">
                                <FaSpinner className="animate-spin text-red-600 text-4xl" />
                            </div>
                        ) : filteredRequests.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No requests found matching your criteria
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-red-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Details</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Contact</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Submitted</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredRequests.map((request) => (
                                            <tr key={`${request.type}-${request.id}`} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {request.type === 'hospital' ? (
                                                            <FaHospital className="h-8 w-8 text-red-600" />
                                                        ) : (
                                                            <FaUserMd className="h-8 w-8 text-red-600" />
                                                        )}
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 capitalize">{request.type}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{request.name || 'N/A'}</div>
                                                    <div className="text-sm text-gray-500">{request.email || 'N/A'}</div>
                                                    {request.type === 'hospital' ? (
                                                        <div className="text-sm text-gray-500">{request.address || 'N/A'}</div>
                                                    ) : (
                                                        <div className="text-sm text-gray-500">Blood Type: {request.bloodType || 'N/A'}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {request.contact || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                                                        {request.status || 'pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {request.submittedAt ? new Date(request.submittedAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {request.status === 'pending' && (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleApprove(request.id, request.type)}
                                                                className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md flex items-center"
                                                            >
                                                                <FaCheck className="mr-1" /> Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(request.id, request.type)}
                                                                className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md flex items-center"
                                                            >
                                                                <FaTimes className="mr-1" /> Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default Registration;
;