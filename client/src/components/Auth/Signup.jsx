import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Remove default icon method if needed (this step is optional and rarely required now)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});


// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const LocationMarker = ({ position, setPosition }) => {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>Your location</Popup>
        </Marker>
    );
};

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        bloodGroup: '',
        aadhar: '',
        address: '',
        latitude: '',
        longitude: ''
    });
    const [position, setPosition] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [showMap, setShowMap] = useState(false);
    const navigate = useNavigate();
    // Example state:
    const [formType, setFormType] = useState("donor"); // or "recipient"


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleLocationClick = async () => {
        setIsLocating(true);
        setLocationError('');

        try {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const { latitude, longitude } = pos.coords;
                        setFormData(prev => ({
                            ...prev,
                            latitude: latitude.toString(),
                            longitude: longitude.toString()
                        }));
                        setPosition({ lat: latitude, lng: longitude });
                        setIsLocating(false);
                    },
                    (error) => {
                        setLocationError('Unable to retrieve your location. Please select on map or enter manually.');
                        setIsLocating(false);
                    },
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
            } else {
                setLocationError('Geolocation is not supported by your browser. Please select on map or enter manually.');
                setIsLocating(false);
            }
        } catch (err) {
            setLocationError('Error getting location. Please try again or enter manually.');
            setIsLocating(false);
        }
    };

    const handleMapSelect = () => {
        setShowMap(true);
    };

    const handleMapConfirm = () => {
        if (position) {
            setFormData(prev => ({
                ...prev,
                latitude: position.lat.toString(),
                longitude: position.lng.toString()
            }));
            setShowMap(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        console.log("submit");
        // Validate required fields
        const newErrors = {};
        if (!formData.role) newErrors.role = 'Please select a role';
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.latitude || !formData.longitude) newErrors.location = 'Location is required';

        // Only validate donor-specific fields if role is donor
        if (formData.role === 'donor') {
            if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
            if (!formData.aadhar || formData.aadhar.length !== 12) newErrors.aadhar = 'Valid Aadhar number is required (12 digits)';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            console.log("eeee");
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                role: formData.role,
                address: formData.address,
                location: {
                    type: 'Point',
                    coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)]
                }
            };

            // Add donor-specific fields if role is donor
            if (formData.role === 'donor') {
                payload.bloodGroup = formData.bloodGroup;
                payload.aadhar = formData.aadhar;
            }

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
            console.log(res);
            navigate('/', { state: { successMessage: 'Registration successful! Please login.' } });
        } catch (err) {
            console.log("hiiiii");
            if (err.response && err.response.data && err.response.data.errors) {
                // Validation errors from backend

                setErrors(err.response.data.errors);
            } else {
                // Other errors
                setErrors({ general: err.response?.data?.message || 'Registration failed. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderError = (field) => {
        return errors[field] && (
            <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm sticky top-0 z-50 bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="text-xl font-bold text-red-600">LifeShare</Link>
                        <Link to="/" className="text-sm font-medium text-red-600 hover:text-red-700">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
                        <p className="mt-2 text-sm text-gray-600">Join LifeShare as a recipient or donor</p>
                    </div>

                    {errors.general && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">{errors.general}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    {showMap ? (
                        <div className="space-y-4">
                            <MapContainer
                                center={position || [20.5937, 78.9629]}
                                zoom={5}
                                style={{ height: '300px', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <LocationMarker position={position} setPosition={setPosition} />
                            </MapContainer>
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setShowMap(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleMapConfirm}
                                    disabled={!position}
                                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!position ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                                >
                                    Confirm Location
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="rounded-md shadow-sm space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {['recipient', 'donor'].map((role) => (
                                        <div key={role} className="col-span-1">
                                            <input
                                                id={`role-${role}`}
                                                name="role"
                                                type="radio"
                                                checked={formData.role === role}

                                                onChange={() => {
                                                    setFormData({ ...formData, role })
                                                    setFormType(role);
                                                    // 

                                                }}
                                                className="sr-only"
                                            />
                                            <label
                                                htmlFor={`role-${role}`}
                                                className={`w-full flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium ${formData.role === role
                                                    ? 'bg-red-100 border-red-300 text-red-700'
                                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {renderError('role')}

                                <div>
                                    <label htmlFor="name" className="sr-only">
                                        {formType === "donor" ? "Full Name" : "Hospital Name"}
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`appearance-none relative block w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'
                                            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm`}
                                        placeholder={formType === "donor" ? "Full Name" : "Hospital Name"}
                                    />
                                    {renderError('name')}
                                </div>

                                <div>
                                    <label htmlFor="email" className="sr-only">Email address</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`appearance-none relative block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'
                                            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm`}
                                        placeholder="Email address"
                                    />
                                    {renderError('email')}
                                </div>

                                {formType === "donor" && (
                                    <div>
                                        <label htmlFor="bloodGroup" className="sr-only">Blood Group</label>
                                        <select
                                            id="bloodGroup"
                                            name="bloodGroup"
                                            value={formData.bloodGroup}
                                            onChange={handleChange}
                                            className={`appearance-none relative block w-full px-3 py-2 border ${errors.bloodGroup ? 'border-red-300' : 'border-gray-300'
                                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm`}
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
                                        {renderError('bloodGroup')}
                                    </div>
                                )}


                                {formType === "donor" && (<div>
                                    <label htmlFor="aadhar" className="sr-only">Aadhar Number</label>
                                    <input
                                        id="aadhar"
                                        name="aadhar"
                                        type="text"
                                        value={formData.aadhar}
                                        onChange={handleChange}
                                        maxLength="12"
                                        className={`appearance-none relative block w-full px-3 py-2 border ${errors.aadhar ? 'border-red-300' : 'border-gray-300'
                                            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm`}
                                        placeholder="Aadhar Number (12 digits)"
                                    />
                                    {renderError('aadhar')}
                                </div>)}

                                <div>
                                    <label htmlFor="address" className="sr-only">Address</label>
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={`appearance-none relative block w-full px-3 py-2 border ${errors.address ? 'border-red-300' : 'border-gray-300'
                                            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm`}
                                        placeholder="Full Address"
                                    />
                                    {renderError('address')}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <div className="space-y-2">
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={handleLocationClick}
                                                disabled={isLocating}
                                                className={`flex-1 py-2 px-3 border border-gray-300 rounded-md text-sm font-medium ${isLocating ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'
                                                    } text-gray-700`}
                                            >
                                                {isLocating ? 'Detecting...' : 'Use Current Location'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleMapSelect}
                                                className="flex-1 py-2 px-3 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 text-gray-700"
                                            >
                                                Select on Map
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                name="latitude"
                                                value={formData.latitude}
                                                onChange={handleChange}
                                                placeholder="Latitude"
                                                className="appearance-none block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                            />
                                            <input
                                                type="text"
                                                name="longitude"
                                                value={formData.longitude}
                                                onChange={handleChange}
                                                placeholder="Longitude"
                                                className="appearance-none block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                    {locationError && <p className="mt-1 text-sm text-red-600">{locationError}</p>}
                                    {renderError('location')}
                                    <p className="mt-1 text-xs text-gray-500">
                                        {formData.role === 'donor'
                                            ? "As a donor, your location helps recipients find you when they need blood."
                                            : "Your location helps us find nearby donors when you need blood."}
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`appearance-none relative block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'
                                            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm`}
                                        placeholder="Password (min 8 characters)"
                                    />
                                    {renderError('password')}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`appearance-none relative block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm`}
                                        placeholder="Confirm Password"
                                    />
                                    {renderError('confirmPassword')}
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                                    I agree to the <Link to="/terms" className="text-red-600 hover:text-red-500">Terms</Link> and <Link to="/privacy" className="text-red-600 hover:text-red-500">Privacy Policy</Link>
                                </label>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isLoading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating account...
                                        </>
                                    ) : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main >

            <footer className="bg-white py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} LifeShare. All rights reserved.
                </div>
            </footer>
        </div >
    );
};

export default Signup;