import { useState, useEffect } from 'react';
import AdminHeader from '../../components/Header/AdminHeader';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
const Inventory = () => {
    const [bloodSummary, setBloodSummary] = useState({ criticalTypes: 0, totalUnits: 0 });
    const [organSummary, setOrganSummary] = useState({ available: 0, waitlist: 0 });
  const { token } = useAuth();
    useEffect(() => {
        const fetchSummaries = async () => {
            try {
                const [bloodRes, organRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/auth/bloodsummary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/auth/organsummary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
                ]);

                setBloodSummary(bloodRes.data);
                setOrganSummary(organRes.data);
            } catch (error) {
                console.error("Error fetching inventory data:", error);
            }
        };

        fetchSummaries();
    }, []);

    return (
        <>
            <AdminHeader />
            <div className="p-4 max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-red-700 mb-6">Hospital Inventory</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Blood Summary Card */}
                    <Link to="/Admin/bloodinventory" className="block">
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-red-700">Blood Stock</h2>
                                <span className="text-sm text-blue-600">View all →</span>
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <span className="text-3xl font-bold text-red-700">
                                        {bloodSummary.criticalTypes}
                                    </span>
                                    <span className="text-sm text-gray-600 ml-1">critical types</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-bold text-gray-700">
                                        {bloodSummary.totalUnits}
                                    </span>
                                    <span className="text-sm text-gray-600 ml-1">total units</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Organ Summary Card */}
                    <Link to="/Admin/organinventory" className="block">
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-red-700">Organ Availability</h2>
                                <span className="text-sm text-blue-600">View all →</span>
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <span className="text-3xl font-bold text-green-600">
                                        {organSummary.available}
                                    </span>
                                    <span className="text-sm text-gray-600 ml-1">available</span>
                                </div>
                                {/* <div className="text-right">
                                    <span className="text-3xl font-bold text-gray-700">
                                        {organSummary.waitlist}
                                    </span>
                                    <span className="text-sm text-gray-600 ml-1">waiting</span>
                                </div> */}
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Inventory;
