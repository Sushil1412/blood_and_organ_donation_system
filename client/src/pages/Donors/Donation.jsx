import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from '../../components/Header/AdminHeader';
import DonorHeader from '../../components/Header/DonorHeader';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
const AdminHospitalRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'
    const email = localStorage.getItem('email');
       const { token } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const email = localStorage.getItem('email');
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/bloodrequestfordonor?email=${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
                const sortedRequests = response.data.data.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                console.log(sortedRequests);
                setRequests(sortedRequests);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch requests');
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleStatusChange = async (requestId, newStatus) => {
        try {
            setUpdatingId(requestId);

            // Optimistic update
            setRequests(prevRequests =>
                prevRequests.map(request =>
                    request._id === requestId
                        ? { ...request, status: newStatus }
                        : request
                ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            );

            // Find the current request to get bloodGroup
            const currentRequest = requests.find(req => req._id === requestId);
            const bloodGroup = currentRequest?.bloodGroup || ""; // Use bloodType or whatever field contains the blood group
            console.log("this is", bloodGroup);
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/auth/upadateBloodrequestdonor`,
                {
                    requestId,
                    status: newStatus,
                    bloodGroup: bloodGroup,
                    email: email
                },
                {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
            );
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update request status');
            console.error('Update error:', err);

            // Revert on error by refetching
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/bloodrequestfordonor?email=${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
            const sortedRequests = response.data.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setRequests(sortedRequests);
        } finally {
            setUpdatingId(null);
        }
    };
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Filter requests based on active tab
    const pendingRequests = requests.filter(request => request.status === 'pending');
    const historyRequests = requests.filter(request => request.status !== 'pending');

    return (
        <>
            <DonorHeader />
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Hospital Blood Requests</h1>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pending'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Pending Requests
                                {pendingRequests.length > 0 && (
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        {pendingRequests.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'history'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Request History
                            </button>
                        </nav>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {activeTab === 'pending' ? (
                                pendingRequests.length === 0 ? (
                                    <div className="col-span-full bg-white p-8 rounded-lg shadow text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="mt-2 text-lg font-medium text-gray-900">No pending requests</h3>
                                        <p className="mt-1 text-sm text-gray-500">There are currently no new hospital requests.</p>
                                    </div>
                                ) : (
                                    pendingRequests.map(request => (
                                        <RequestCard
                                            key={request._id}
                                            request={request}
                                            updatingId={updatingId}
                                            onApprove={() => handleStatusChange(request._id, 'accepted')}
                                            onReject={() => handleStatusChange(request._id, 'rejected')}
                                            formatDate={formatDate}
                                        />
                                    ))
                                )
                            ) : (
                                historyRequests.length === 0 ? (
                                    <div className="col-span-full bg-white p-8 rounded-lg shadow text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="mt-2 text-lg font-medium text-gray-900">No request history</h3>
                                        <p className="mt-1 text-sm text-gray-500">There are no historical requests to display.</p>
                                    </div>
                                ) : (
                                    historyRequests.map(request => (
                                        <RequestCard
                                            key={request._id}
                                            request={request}
                                            isHistory={true}
                                            formatDate={formatDate}
                                        />
                                    ))
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

const RequestCard = ({ request, updatingId, onApprove, onReject, isHistory = false, formatDate }) => {
    const statusColors = {
        approved: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        rejected: 'bg-red-100 text-red-800'
    };

    return (
        <div className={`bg-white rounded-lg shadow overflow-hidden ${request.status === 'approved' ? 'border-l-4 border-green-500' :
            request.status === 'rejected' ? 'border-l-4 border-red-500' :
                'border-l-4 border-yellow-500'
            }`}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                        {formatDate(request.createdAt)}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">{request.hospitalName}</h3>
                <p className="text-gray-600 mb-2">
                    <span className="font-medium">Blood Type:</span> {request.bloodGroup}
                </p>
                <p className="text-gray-600 mb-4">
                    <span className="font-medium">Needed by:</span> {formatDate(request.needByDate)}<span> Time: {(request.needByTime)}</span>
                </p>
                <p className="text-gray-600 mb-4">
                    <span className="font-medium">Address:{request.address} </span>
                </p>
                <p className="text-gray-600 mb-4">
                    <span className="font-medium">Purpose:</span> {request.purpose}
                </p>
                {/* <p className="text-gray-600 mb-4">
                    <span className="font-medium">Hospital Name:{request.name}</span>
                </p> */}

                {request.notes && (
                    <div className="bg-gray-50 p-3 rounded-md mb-4">
                        <p className="text-sm text-gray-700">{request.notes}</p>
                    </div>
                )}

                {!isHistory && (
                    <div className="flex space-x-2">
                        <button
                            onClick={onApprove}
                            disabled={updatingId === request._id}
                            className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${updatingId === request._id ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                                }`}
                        >
                            {updatingId === request._id ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                            onClick={onReject}
                            disabled={updatingId === request._id}
                            className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${updatingId === request._id ? 'bg-gray-400' : 'bg-gray-600 hover:bg-gray-700'
                                }`}
                        >
                            {updatingId === request._id ? 'Rejecting...' : 'Reject'}
                        </button>
                    </div>
                )}
            </div>
        </div>

    );
};

export default AdminHospitalRequests;