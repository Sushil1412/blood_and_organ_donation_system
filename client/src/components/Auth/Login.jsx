import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [activeTab, setActiveTab] = useState('user'); // 'user' or 'admin'
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'recipient'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const portal = activeTab === 'admin' ? 'hospital' : formData.role;

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    portal
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed. Please check your credentials.');
            }

            if (!data.token) {
                throw new Error('Authentication token not received');
            }

            // Check verification status for donor
            if (data.role === 'donor') {
                if (!data.status) {
                    throw new Error('Your application is not verified yet. You cannot login at this time.');
                }
                if (data.status === 'pending') {
                    throw new Error('Your application is pending approval. You cannot login right now.');
                }
                if (data.status === 'rejected') {
                    throw new Error('Your application has been rejected. You cannot login.');
                }
                if (data.status !== 'approved') {
                    throw new Error('Your account is not approved for login.');
                }
            }

            // Store authentication data
            localStorage.setItem('userToken', data.token);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userId', data._id);
            localStorage.setItem('email', data.email);
            localStorage.setItem('name', data.name);
            localStorage.setItem('address', data.address);
            localStorage.setItem('longitude', data.longitude);
            localStorage.setItem('latitude', data.latitude);


            login({
                token: data.token,
                role: data.role,
                _id: data._id,
                email: data.email,
                name: data.name,
                aadhar: data.aadhar,
                bloodGroup: data.bloodGroup,
                address: data.address,
                mobile: data.mobile
            });

            // Redirect based on role
            console.log(data.role);
            switch (data.role) {
                case 'hospital':
                    navigate('/admin');
                    break;
                case 'recipient':
                    navigate('/Recipiant-dashboard');
                    break;
                case 'donor':
                    navigate('/donor');
                    break;
                default:
                    navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="text-xl font-bold text-red-600">
                            LifeShare
                        </Link>
                        <Link to="/signup" className="text-sm font-medium text-red-600 hover:text-red-700">
                            Don't have an account? Sign up
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            {activeTab === 'admin' ? 'Admin/Hospital Login' : 'Sign in to your account'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {activeTab === 'admin' ? 'Enter your administrator or hospital credentials' : 'Select your role to continue'}
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-200">
                        <button
                            type="button"
                            className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'user' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            onClick={() => setActiveTab('user')}
                        >
                            User Login
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'admin' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            onClick={() => setActiveTab('admin')}
                        >
                            Admin/Hospital Login
                        </button>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm space-y-4">
                            {/* Role Selection (only shown for user login) */}
                            {activeTab === 'user' && (
                                <div className="grid grid-cols-2 gap-3">
                                    {['recipient', 'donor'].map((role) => (
                                        <div key={role} className="col-span-1">
                                            <input
                                                id={`role-${role}`}
                                                name="role"
                                                type="radio"
                                                checked={formData.role === role}
                                                onChange={() => setFormData({ ...formData, role })}
                                                className="sr-only"
                                            />
                                            <label
                                                htmlFor={`role-${role}`}
                                                className={`w-full flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium ${formData.role === role
                                                    ? 'bg-red-100 border-red-300 text-red-700'
                                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    {activeTab === 'admin' ? 'Email' : 'Email address'}
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                    placeholder={activeTab === 'admin' ? 'admin@lifeshare.org' : 'your@email.com'}
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {activeTab === 'user' && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <Link to="/forgot-password" className="font-medium text-red-600 hover:text-red-500">
                                        Forgot your password?
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {activeTab === 'admin' ? 'Verifying...' : 'Signing in...'}
                                    </>
                                ) : (
                                    activeTab === 'admin' ? 'Login as Admin/Hospital' : 'Sign in'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} LifeShare. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Login;