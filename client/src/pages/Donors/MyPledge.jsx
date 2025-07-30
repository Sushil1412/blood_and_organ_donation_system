import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DonorHeader from '../../components/Header/DonorHeader';
import Footer from '../../components/Footer/Footer'

import { useAuth } from '../../context/AuthContext';

const MyPledge = () => {
    const [pledges, setPledges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  const { token } = useAuth();
    useEffect(() => {
        const fetchPledges = async () => {
            try {

                const email = localStorage.getItem('email');
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/mypledge`,
                    {
                        params: {
                            email: email
                        }
                    }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
                const pledgesData = Array.isArray(response.data)
                    ? response.data
                    : [response.data];
                setPledges(response.data.data);
                console.log(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch pledges');
                setLoading(false);
            }
        };

        fetchPledges();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <>
                <DonorHeader />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <DonorHeader />
                <div className="bg-white shadow rounded-lg p-8 text-center max-w-2xl mx-auto mt-10">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Error Loading Pledges</h2>
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

    if (pledges.length === 0) {
        return (
            <>
                <DonorHeader />
                <div className="bg-white shadow rounded-lg p-8 text-center max-w-2xl mx-auto mt-10">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">No Pledges Found</h2>
                    <p className="text-gray-600 mb-6">
                        You haven't made any donation pledges yet. Make your first pledge to save lives today!
                    </p>
                    <a
                        href="/donor/pledge"
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 inline-block"
                    >
                        Make a Pledge
                    </a>
                </div>
            </>
        );
    }

    return (
        <>
            <DonorHeader />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">My Donation Pledges</h1>
                    <p className="text-gray-600 mt-2">View and manage your donation pledges</p>
                </div>

                <div className="space-y-6">
                    {pledges.map((pledge) => (
                        <div key={pledge._id} className="bg-white shadow-lg rounded-xl overflow-hidden">
                            <div className={`p-6 ${pledge.donationType === 'blood' ? 'bg-red-50' : 'bg-blue-50'}`}>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 capitalize">
                                            {pledge.donationType === 'blood' ? 'Blood Donation' : 'Organ Donation'} Pledge
                                        </h2>
                                        <p className="text-gray-600">Pledged on: {formatDate(pledge.createdAt)}</p>
                                    </div>
                                    <span className={`mt-2 md:mt-0 px-4 py-1 rounded-full text-sm font-medium ${pledge.donationType === 'blood' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {pledge.donationType === 'blood' ? 'Blood' : 'Organ'} Donation
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Personal Information</h3>
                                        <div className="space-y-3">
                                            <p><span className="font-medium">Name:</span> {pledge.fullName}</p>
                                            <p><span className="font-medium">Email:</span> {pledge.email}</p>
                                            <p><span className="font-medium">Phone:</span> {pledge.phone}</p>
                                            <p><span className="font-medium">Aadhar:</span> {pledge.aadharNumber}</p>
                                        </div>
                                    </div>

                                    {pledge.donationType === 'blood' ? (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Blood Donation Details</h3>
                                            <div className="space-y-3">
                                                <p><span className="font-medium">Blood Type:</span> {pledge.bloodType}</p>
                                                <p><span className="font-medium">Status:</span> <span className="text-green-600">Active</span></p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Organ Donation Details</h3>
                                            <div className="space-y-3">
                                                <p><span className="font-medium">Organs Pledged:</span></p>
                                                <div className="flex flex-wrap gap-2">
                                                    {pledge.organTypes.map((organ) => (
                                                        <span key={organ} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                            {organ}
                                                        </span>
                                                    ))}
                                                </div>
                                                <p className="mt-2"><span className="font-medium">Address:</span> {pledge.address}, {pledge.city}, {pledge.state} - {pledge.pincode}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div className="mb-4 md:mb-0">
                                            <h3 className="text-lg font-semibold text-gray-700">Pledge Status</h3>
                                            <div className="flex items-center mt-2">
                                                <div className={`h-3 w-3 rounded-full mr-2 ${pledge.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                                                    }`}></div>
                                                <span className="capitalize">{pledge.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyPledge;