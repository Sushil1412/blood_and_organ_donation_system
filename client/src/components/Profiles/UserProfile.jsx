import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserHeader from '../Header/UserHeader';
import DonorHeader from '../Header/DonorHeader';
import axios from 'axios';

const UserProfile = () => {
    const { currentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bloodGroup: '',
        address: '',
        mobile: '',
        aadhar: '',
        role: ''
    });
    const [userRole, setUserRole] = useState('');

    // Function to fetch user details manually
    const fetchUserDetails = async (email) => {
        const role = localStorage.getItem('userRole');

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/getuser?email`, {
                params: {
                    email: email,
                    role: role
                }
            }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
            return response.data;
        } catch (error) {
            console.error('Error fetching user details:', error);
            throw error;
        }
    };

    // Initialize form data and refresh on currentUser change
    useEffect(() => {
        const initializeData = async () => {
            if (currentUser) {
                const role = localStorage.getItem('userRole');
                setUserRole(role);

                // First try to get fresh data from server
                try {
                    const freshUserData = await fetchUserDetails(currentUser.email);
                    setFormData({
                        name: freshUserData.name || '',
                        email: freshUserData.email || '',
                        bloodGroup: freshUserData.bloodGroup || '',
                        address: freshUserData.address || '',
                        mobile: freshUserData.mobile || '',
                        aadhar: freshUserData.aadhar || '',
                        role: freshUserData.role || 'recipient'
                    });
                } catch (error) {
                    // Fallback to currentUser if API fails
                    setFormData({
                        name: currentUser.name || '',
                        email: currentUser.email || '',
                        bloodGroup: currentUser.bloodGroup || '',
                        address: currentUser.address || '',
                        mobile: currentUser.mobile || '',
                        aadhar: currentUser.aadhar || '',
                        role: currentUser.role || 'recipient'
                    });
                }
            }
        };
        initializeData();
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare update data
            const role = localStorage.getItem('userRole');
            console.log(role);
            const updateData = {
                email: currentUser.email,
                address: formData.address,
                mobile: formData.mobile,
                role: role
            };

            // For donors, also update blood group if allowed
            if (role === 'donor') {
                updateData.bloodGroup = formData.bloodGroup;
            }

            // Step 1: Update user data
            await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/updateuserprofile`, updateData);

            // Step 2: Manually fetch updated user details
            const updatedUser = await fetchUserDetails(currentUser.email);

            // Step 3: Update localStorage manually
            const userData = JSON.parse(localStorage.getItem('userData')) || {};
            const updatedUserData = {
                ...userData,
                address: updatedUser.address,
                mobile: updatedUser.mobile
            };

            if (role === 'donor') {
                updatedUserData.bloodGroup = updatedUser.bloodGroup;
            }

            localStorage.setItem('userData', JSON.stringify(updatedUserData));

            // Step 4: Update form state with fresh data
            setFormData(prev => ({
                ...prev,
                address: updatedUser.address,
                mobile: updatedUser.mobile,
                ...(role === 'donor' && { bloodGroup: updatedUser.bloodGroup })
            }));

            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Update error:', error);
            alert(error.response?.data?.msg || error.message || 'Error updating profile');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {userRole === 'recipient' ? <UserHeader /> : <DonorHeader />}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-red-600 to-red-800 px-6 py-8 text-white">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg flex items-center justify-center">
                                    <span className="text-4xl text-red-600 font-bold">
                                        {formData.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 md:ml-8 text-center md:text-left">
                                <h1 className="text-2xl font-bold">{formData.name}</h1>
                                <p className="mt-1">{formData.email}</p>
                                <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-white bg-opacity-20">
                                    <span className="h-2 w-2 rounded-full bg-white mr-2"></span>
                                    <span className="text-sm font-medium capitalize">
                                        {formData.role} {userRole === 'donor' && `| Blood Group: ${formData.bloodGroup || 'Not specified'}`}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 md:ml-auto">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-white text-red-600 rounded-md font-medium hover:bg-gray-100 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            className="px-4 py-2 bg-white text-red-600 rounded-md font-medium hover:bg-gray-100 transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="px-6 py-8">
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <p className="text-gray-900">{formData.name}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <p className="text-gray-900">{formData.email}</p>
                                </div>

                                {userRole === 'donor' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                        {isEditing ? (
                                            <select
                                                name="bloodGroup"
                                                value={formData.bloodGroup}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                            >
                                                <option value="">Select Blood Group</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </select>
                                        ) : (
                                            <p className="text-gray-900">{formData.bloodGroup || 'Not specified'}</p>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                            pattern="[0-9]{10}"
                                            title="Please enter a 10-digit mobile number"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{formData.mobile || 'Not specified'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                {userRole === 'donor' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Card Number</label>
                                        <p className="text-gray-900">{formData.aadhar || 'Not specified'}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    {isEditing ? (
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                        />
                                    ) : (
                                        <p className="text-gray-900 whitespace-pre-line">{formData.address || 'Not specified'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <p className="text-gray-900 capitalize">{formData.role}</p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;