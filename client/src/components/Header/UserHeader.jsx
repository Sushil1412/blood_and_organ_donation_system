import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserHeader = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    // Mock notifications
    const notifications = [
        { id: 1, text: 'Your blood request was approved', read: false },
        { id: 2, text: 'New donor available in your area', read: true }
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/recipiant-dashboard" className="text-xl font-bold text-red-600">
                            LifeShare
                        </Link>
                    </div>

                    {/* Main Navigation */}
                    <nav className="hidden md:flex space-x-8">

                        <Link
                            to="/Recipiant-dashboard"
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600"
                        >
                            Home
                        </Link>

                        <Link
                            to="/Recipiant-dashboard/myrequests"
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600"
                        >
                            My request
                        </Link>
                        <Link
                            to="/Contact"
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600"
                        >
                            Contact
                        </Link>
                        <Link
                            to="/About"
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600"
                        >
                            About
                        </Link>
                    </nav>

                    {/* Right-side icons */}
                    <div className="flex items-center space-x-4">


                        {/* Profile dropdown */}
                        <div className="relative ml-3">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <span className="sr-only">Open user menu</span>
                                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium">
                                    {currentUser?.name?.charAt(0) || 'U'}
                                </div>
                            </button>

                            {isProfileOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <Link
                                        to="/userprofile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Your Profile
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default UserHeader;