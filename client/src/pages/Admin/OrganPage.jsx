import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/Header/AdminHeader';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
const OrganPage = () => {
    const [organs, setOrgans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrgan, setSelectedOrgan] = useState(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateAmount, setUpdateAmount] = useState(1);
    const [requestDetails, setRequestDetails] = useState({
        quantity: 1,
        neededBy: '',
    });
      const { token } = useAuth();
    const [hospitalEmail, setHospitalEmail] = useState('');
    const [requests, setRequests] = useState([]);
    const [requestsLoading, setRequestsLoading] = useState(true);

    // Get hospital email from local storage
    useEffect(() => {
        const email = localStorage.getItem('email');
        if (email) {
            setHospitalEmail(email);
        }
    }, []);

    // Fetch organ inventory data from API
    useEffect(() => {
        const fetchOrganInventory = async () => {
            if (!hospitalEmail) return;

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/organinventory?hospitalEmail=${hospitalEmail}`,  {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
                setOrgans(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error('Error fetching organ inventory:', err);
            }
        };

        fetchOrganInventory();
    }, [hospitalEmail, showUpdateModal]);

    // Fetch organ requests made by this hospital
    useEffect(() => {
        const fetchOrganRequests = async () => {
            if (!hospitalEmail) return;

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/hospitalorganrequests?hospitalEmail=${hospitalEmail}&type=organ`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
                setRequests(response.data);
                setRequestsLoading(false);
            } catch (err) {
                console.error('Error fetching organ requests:', err);
                setRequestsLoading(false);
            }
        };

        fetchOrganRequests();
    }, [hospitalEmail, showRequestModal]);

    const handleRequest = (organType) => {
        setSelectedOrgan(organType);
        setShowRequestModal(true);
    };

    const handleUpdate = (organType) => {
        setSelectedOrgan(organType);
        const selectedOrganItem = organs.find(organ => organ.organType === organType);
        if (selectedOrganItem) {
            setUpdateAmount(selectedOrganItem.quantity);
        }
        setShowUpdateModal(true);
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        try {
            const hospitalName = localStorage.getItem('name');
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/auth/hospitalrequestsubmit`, {
                hospitalEmail: hospitalEmail,
                requestType: 'organ',
                organType: selectedOrgan,
                quantity: requestDetails.quantity,
                hospitalName: hospitalName,
                neededBy: requestDetails.neededBy
            }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

            setShowRequestModal(false);
            setRequestDetails({
                quantity: 1,
                neededBy: '',
            });
            alert('Your request has been sent to the administrator.');
        } catch (err) {
            console.error('Error submitting organ request:', err);
            alert('Failed to submit request. Please try again.');
        }
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        try {
            const hospitalName = localStorage.getItem('name');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/organinventoryupdate`, {
                hospitalEmail: hospitalEmail,
                hospitalName: hospitalName,
                organType: selectedOrgan,
                quantity: parseInt(updateAmount)
            }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

            const updatedOrgans = organs.map(organ => {
                if (organ.organType === selectedOrgan) {
                    return {
                        ...organ,
                        units: parseInt(updateAmount)
                    };
                }
                return organ;
            });

            setOrgans(updatedOrgans);
            setShowUpdateModal(false);
            setUpdateAmount(1);
            alert('Organ inventory updated successfully!');
        } catch (err) {
            console.error('Error updating organ inventory:', err);
            alert('Failed to update inventory. Please try again.');
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <>
            <AdminHeader />
            <div className="min-h-screen bg-gray-100 p-4">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Organ Inventory</h1>

                    {/* Organ Availability Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                        {organs.map((organ, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm p-4 flex flex-col">
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xl font-semibold text-gray-700">{organ.organType}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${organ.quantity > 3 ? 'bg-green-100 text-green-800' :
                                            organ.units > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {organ.quantity} available
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <button
                                        onClick={() => handleUpdate(organ.organType)}
                                        className="hover:bg-blue-100 text-blue-600 rounded-full p-2 transition-colors duration-200"
                                        aria-label={`Update ${organ.organType} stock`}
                                        title="Update stock"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleRequest(organ.organType)}
                                        className="hover:bg-red-100 text-red-600 rounded-full p-2 transition-colors duration-200"
                                        aria-label={`Request ${organ.organType}`}
                                        title="Request from admin"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Organ Request History Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Organ Requests</h2>

                        {requestsLoading ? (
                            <p>Loading requests...</p>
                        ) : requests.length === 0 ? (
                            <p className="text-gray-500">No organ requests made yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {requests.map((request, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-800">
                                                    {request.organType} - {request.quantity} units
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Requested on: {formatDate(request.createdAt)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Needed by: {formatDate(request.neededBy)}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </div>
                                        {request.adminComment && (
                                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                                                <strong>Admin Note:</strong> {request.adminComment}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Request Modal */}
                {showRequestModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Request Organ ({selectedOrgan})</h2>

                            <form onSubmit={handleSubmitRequest}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2" htmlFor="quantity">
                                        Units Needed
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        value={requestDetails.quantity}
                                        onChange={(e) => setRequestDetails({ ...requestDetails, quantity: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 mb-2" htmlFor="neededBy">
                                        Needed By
                                    </label>
                                    <input
                                        type="date"
                                        id="neededBy"
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        value={requestDetails.neededBy}
                                        onChange={(e) => setRequestDetails({ ...requestDetails, neededBy: e.target.value })}
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowRequestModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Send Request
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Update Modal */}
                {showUpdateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Organ Stock ({selectedOrgan})</h2>
                            <p className="text-gray-600 mb-4">Current available units: {organs.find(o => o.organType === selectedOrgan)?.quantity || 0}</p>

                            <form onSubmit={handleSubmitUpdate}>
                                <div className="mb-6">
                                    <label className="block text-gray-700 mb-2" htmlFor="updateAmount">
                                        New Total Units
                                    </label>
                                    <div className="flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setUpdateAmount(prev => Math.max(0, prev - 1))}
                                            className="px-3 py-1 border border-gray-300 rounded-l bg-gray-100 hover:bg-gray-200"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            id="updateAmount"
                                            className="w-full px-3 py-2 border-t border-b border-gray-300 text-center"
                                            value={updateAmount}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value) || 0;
                                                setUpdateAmount(Math.max(0, value));
                                            }}
                                            min="1"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setUpdateAmount(prev => prev + 1)}
                                            className="px-3 py-1 border border-gray-300 rounded-r bg-gray-100 hover:bg-gray-200"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowUpdateModal(false);
                                            setUpdateAmount(1);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Update Stock
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default OrganPage;