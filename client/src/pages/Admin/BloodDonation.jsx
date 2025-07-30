import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from '../../components/Header/AdminHeader';
import { useAuth } from "../../context/AuthContext";
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function BloodDonationCard() {
    const [selectedGroup, setSelectedGroup] = useState("");
    const [donors, setDonors] = useState([]);
    const [filteredDonors, setFilteredDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [requestForm, setRequestForm] = useState({
        needByDate: "",
        needByTime: "",
        purpose: ""
    });
      const { token } = useAuth();
    // Get hospital info from localStorage
    const hospitalInfo = {
        name: localStorage.getItem('name') || 'Unknown Hospital',
        email: localStorage.getItem('email') || 'unknown@hospital.com'
    };

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/hospitalmypledge`, {
                    params: {
                        donationType: 'blood'
                    }
                ,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
                console.log(response.data.data);
                setDonors(response.data.data);
                setFilteredDonors(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch donors');
                setLoading(false);
            }
        };

        fetchDonors();
    }, []);

    useEffect(() => {
        if (selectedGroup === "") {
            setFilteredDonors(donors);
        } else {
            setFilteredDonors(
                donors.filter((donor) => donor.bloodType === selectedGroup)
            );
        }
    }, [selectedGroup, donors]);

    const handleBookAppointment = (donor) => {
        setSelectedDonor(donor);
        setShowRequestForm(true);
        // Pre-fill form with current date/time as default
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().substring(0, 5);

        setRequestForm({
            needByDate: currentDate,
            needByTime: currentTime,
            purpose: ""
        });
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!selectedDonor) {
                throw new Error("No donor selected");
            }

            const requestData = {
                donorEmail: selectedDonor.email, // Donor's email (as per your schema)
                hospitalEmail: hospitalInfo.email, // Hospital's email from localStorage
                hospitalName: hospitalInfo.name, // Hospital's name from localStorage
                needByDate: requestForm.needByDate,
                needByTime: requestForm.needByTime,
                purpose: requestForm.purpose,
                bloodGroup: selectedDonor.bloodType,
                donorName: selectedDonor.fullName,
                donorPhone: selectedDonor.phone,
                address: 'City Hospital',
                status: "pending" // Adding status field
            };
            console.log(requestData);

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/bloodRequestDonor`,
                requestData
            , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

            alert(`Blood request submitted successfully!`);
            setShowRequestForm(false);
            setRequestForm({
                needByDate: "",
                needByTime: "",
                purpose: ""
            });
        } catch (err) {
            alert(err.response?.data?.message || err.message || 'Failed to submit request');
            console.error("Request submission error:", err);
        }
    };

    const toggleDonorStatus = async (donorId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/auth/updatedonorstatus/${donorId}`,
                { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

            );

            // Update the local state to reflect the change
            setDonors(donors.map(donor =>
                donor._id === donorId ? { ...donor, status: newStatus } : donor
            ));

            alert(`Donor status updated to ${newStatus}`);
        } catch (err) {
            alert(err.response?.data?.message || err.message || 'Failed to update status');
            console.error("Status update error:", err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not available";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

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
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-red-600">Blood Donor List</h1>
                <p className="text-sm text-gray-600 mb-4">Hospital: {hospitalInfo.name}</p>

                <div className="mb-4">
                    <select
                        className="border border-gray-300 rounded px-4 py-2"
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                    >
                        <option value="">Filter by Blood Group</option>
                        {bloodGroups.map((group) => (
                            <option key={group} value={group}>
                                {group}
                            </option>
                        ))}
                    </select>
                </div>

                <ul className="space-y-4">
                    {filteredDonors.length === 0 ? (
                        <p className="text-gray-500">No donors available for selected group.</p>
                    ) : (
                        filteredDonors.map((donor) => (
                            <li
                                key={donor._id}
                                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center">
                                            <h3 className="font-medium text-lg">{donor.fullName}</h3>
                                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${donor.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {donor.status || 'active'}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            <p>Blood Type: <span className="font-semibold">{donor.bloodType}</span></p>
                                            <p>Last Donation: <span className="font-semibold">{formatDate(donor.lastDonationDate)}</span></p>
                                            <p>Contact: <span className="font-semibold">{donor.phone}</span></p>
                                            <p>Address: <span className="font-semibold">{donor.address}, {donor.city}, {donor.state} - {donor.pincode}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <button
                                            onClick={() => handleBookAppointment(donor)}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                        >
                                            Request Blood
                                        </button>
                                        <button
                                            onClick={() => toggleDonorStatus(donor._id, donor.status || 'active')}
                                            className={`px-4 py-2 rounded-lg transition ${donor.status === 'active' || !donor.status
                                                ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                }`}
                                        >
                                            {donor.status === 'active' || !donor.status ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>

                {/* Request Blood Form Modal */}
                {showRequestForm && selectedDonor && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">Request Blood from {selectedDonor.fullName}</h2>
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm"><span className="font-semibold">Hospital:</span> {hospitalInfo.name}</p>
                                <p className="text-sm"><span className="font-semibold">Donor Blood Group:</span> {selectedDonor.bloodType}</p>
                                <p className="text-sm"><span className="font-semibold">Donor Contact:</span> {selectedDonor.phone}</p>
                                <p className="text-sm"><span className="font-semibold">Status:</span>
                                    <span className={`ml-1 px-2 py-1 text-xs rounded-full ${selectedDonor.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {selectedDonor.status || 'active'}
                                    </span>
                                </p>
                            </div>
                            <form onSubmit={handleRequestSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Needed By Date*</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            value={requestForm.needByDate}
                                            onChange={(e) => setRequestForm({ ...requestForm, needByDate: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]} // Disable past dates
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Needed By Time*</label>
                                        <input
                                            type="time"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            value={requestForm.needByTime}
                                            onChange={(e) => setRequestForm({ ...requestForm, needByTime: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Purpose*</label>
                                        <textarea
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            rows={3}
                                            value={requestForm.purpose}
                                            onChange={(e) => setRequestForm({ ...requestForm, purpose: e.target.value })}
                                            placeholder="Explain why you need the blood (e.g., surgery, treatment)"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowRequestForm(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Submit Request
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}