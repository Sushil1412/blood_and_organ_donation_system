import { useState, useEffect } from 'react';
import UserHeader from '../../components/Header/UserHeader';
import axios from 'axios';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
   const { token } = useAuth();
    const id = localStorage.getItem('email');

    useEffect(() => {
        fetchRequestsFromBackend();
    }, []);

    const fetchRequestsFromBackend = async () => {

        try {
          

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/userrequest/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
            const sortedRequests = response.data.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt));
            setRequests(sortedRequests);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRequest(null);
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Rejected':
            case 'Unavailable':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <UserHeader />
            <div className="min-h-screen bg-gray-50">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
                    </div>

                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`${activeTab === 'pending' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Pending Requests
                            </button>
                            <button
                                onClick={() => setActiveTab('completed')}
                                className={`${activeTab === 'completed' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Request History
                            </button>
                        </nav>
                    </div>

                    {activeTab === 'pending' ? (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 px-4 py-5 sm:px-6">
                                Pending Requests
                            </h3>
                            {requests.filter(req => req.status === 'Pending').length === 0 ? (
                                <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                                    No pending requests found.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Details
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Needed By
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {requests
                                                .filter(req => req.status === 'Pending')
                                                .map((request) => (
                                                    <tr key={request._id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {request.type}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {request.bloodType || request.organ}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {request.neededBy || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(request.status)}`}>
                                                                {request.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 px-4 py-5 sm:px-6">
                                Request History
                            </h3>
                            {requests.filter(req => req.status !== 'Pending').length === 0 ? (
                                <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                                    No request history found.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Details
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {requests
                                                .filter(req => req.status !== 'Pending')
                                                .map((request) => (
                                                    <tr key={request._id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {request.type}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {request.bloodType || request.organ}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(request.updatedAt).toLocaleDateString() || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(request.status)}`}>
                                                                {request.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <button
                                                                onClick={() => handleViewDetails(request)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                View Details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
            <Footer />

            {/* Modal for showing approval details */}
            {showModal && selectedRequest && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Request Details
                                </h3>
                                <div className="mt-2 space-y-3">
                                    <p className="text-sm">
                                        <strong>Type:</strong> {selectedRequest.type}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Details:</strong> {selectedRequest.bloodType || selectedRequest.organ}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Status:</strong>
                                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(selectedRequest.status)}`}>
                                            {selectedRequest.status}
                                        </span>
                                    </p>
                                    <div className="mt-3 p-3 bg-gray-100 rounded">
                                        <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                                        {selectedRequest.status === 'Unavailable' ? (
                                            <p className="text-sm text-gray-700">
                                                Currently not available. We couldn't find a match for your request at this time.
                                            </p>
                                        ) : selectedRequest.approvalDetails?.message ? (
                                            <p className="text-sm text-gray-700">
                                                {selectedRequest.approvalDetails.message}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-700">
                                                {selectedRequest.status === 'Approved'
                                                    ? 'Your request has been approved.'
                                                    : selectedRequest.status === 'Rejected'
                                                        ? 'Your request has been rejected.'
                                                        : 'No additional details provided.'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6">
                                <button
                                    type="button"
                                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyRequests;