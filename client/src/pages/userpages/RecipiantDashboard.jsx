import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserHeader from '../../components/Header/UserHeader';
import axios from 'axios';
import Footer from '../../components/Footer/Footer';


const RecipientDashboard = () => {
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(0);
    
    const id = localStorage.getItem('email');

    // Banner images and content
    const banners = [
        {
            image: 'https://www.hfmmagazine.com/sites/default/files/hfmmagazine/ext/resources/images/2016/October/1116_upfront_microhospital_BSW.jpg',
            title: 'Save Lives Through Blood Donation',
            text: 'Every blood donation can save up to 3 lives. Register as a donor today!'
        },
        {
            image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            title: 'Organ Donation Gives Second Chances',
            text: 'Over 100,000 people are waiting for organ transplants in the US alone.'
        },
        {
            image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            title: 'Partner Hospitals Across the Country',
            text: 'We work with over 200 certified hospitals nationwide for safe transplants.'
        }
    ];

    useEffect(() => {
        // Banner rotation
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleNewRequest = () => {
        setShowRequestForm(true);
    };

    const handleSubmitRequest = async (newRequest) => {
        try {
            const token = localStorage.getItem('userToken'); // Get JWT from localStorage or auth context
//  const { token } = useAuth();
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/userrequest`,
      newRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
            setShowRequestForm(false);
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Failed to submit the request. Please try again.');
        }
    };

    return (
        <>
            <UserHeader />
            <div className="container mx-auto px-4 py-8">
                {/* Hero Banner with rotating images */}
                <div className="relative h-96 overflow-hidden rounded-lg shadow-lg mb-12">
                    {banners.map((banner, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img
                                src={banner.image}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <div className="text-center text-white px-4">
                                    <h2 className="text-3xl font-bold mb-2">{banner.title}</h2>
                                    <p className="text-xl">{banner.text}</p><br></br>
                                    <button
                                        onClick={handleNewRequest}
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        + New Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
                    {showRequestForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                                <NewRequestForm
                                    onSubmit={handleSubmitRequest}
                                    onCancel={() => setShowRequestForm(false)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Quick Actions Section
                    <div className="mb-8 bg-white p-6 rounded-lg shadow">
                        <div className="flex flex-col sm:flex-row justify-between items-center">
                            <div className="mb-4 sm:mb-0">
                                <h2 className="text-2xl font-bold text-gray-800">Need Help?</h2>
                                <p className="text-gray-600">Create a new request for blood or organ donation</p>
                            </div>
                            <div className="flex space-x-4">

                            </div>
                        </div>
                    </div> */}

                    {/* Information Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-2 text-red-600">Blood Donation Facts</h3>
                            <ul className="text-gray-600 space-y-2">
                                <li>• Every 2 seconds someone needs blood</li>
                                <li>• 1 donation can save up to 3 lives</li>
                                <li>• Only 37% of population is eligible to donate</li>
                            </ul>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-2 text-red-600">Organ Donation Facts</h3>
                            <ul className="text-gray-600 space-y-2">
                                <li>• 1 donor can save 8 lives</li>
                                <li>• Over 100,000 waiting for transplants</li>
                                <li>• Kidneys are the most needed organ</li>
                            </ul>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-2 text-red-600">Our Network</h3>
                            <ul className="text-gray-600 space-y-2">
                                {/* <li>• 200+ partner hospitals</li> */}
                                <li>• 24/7 emergency support</li>
                                <li>• Certified transplant centers</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">How Our System Works</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                {
                                    icon: '📝',
                                    title: 'Create Request',
                                    desc: 'Fill out our simple form with your needs'
                                },
                                {
                                    icon: '🔍',
                                    title: 'Matching',
                                    desc: 'Our system finds compatible donors'
                                },
                                {
                                    icon: '🏥',
                                    title: 'Coordination',
                                    desc: 'We coordinate with hospital and donors'
                                },
                                {
                                    icon: '❤️',
                                    title: 'Transplant',
                                    desc: 'Life-saving procedure is performed'
                                }
                            ].map((step, index) => (
                                <div key={index} className="text-center p-4 border rounded-lg hover:bg-gray-50">
                                    <div className="text-3xl mb-2">{step.icon}</div>
                                    <h4 className="font-semibold mb-1">{step.title}</h4>
                                    <p className="text-sm text-gray-600">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
};

// New Request Form (same as before)
const NewRequestForm = ({ onSubmit, onCancel }) => {
    const [requestType, setRequestType] = useState('Blood');
    const [formData, setFormData] = useState({
        name: '',
        neededBy: '',
        bloodType: '',
        organ: '',
        additionalInfo: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const request = {
            email: localStorage.getItem('email'),
            name: formData.name,
            neededBy: formData.neededBy,
            type: requestType,
            bloodType: requestType === 'Blood' ? formData.bloodType : '',
            organ: requestType === 'Organ' ? formData.organ : '',
            additionalInfo: formData.additionalInfo,
            address: localStorage.getItem('address'),
            latitude: localStorage.getItem('latitude'),
            longitude: localStorage.getItem('longitude'),
            status: 'Pending'
        };
        onSubmit(request);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-medium mb-4">Create New Request</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Needed By</label>
                <input
                    type="date"
                    name="neededBy"
                    value={formData.neededBy}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Request Type</label>
                <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="Blood">Blood</option>
                    <option value="Organ">Organ</option>
                </select>
            </div>

            {requestType === 'Blood' ? (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                    <select
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>
            ) : (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organ Needed</label>
                    <select
                        name="organ"
                        value={formData.organ}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select Organ</option>
                        <option value="Kidney">Kidney</option>
                        <option value="Liver">Liver</option>
                        <option value="Heart">Heart</option>
                        <option value="Lung">Lung</option>
                    </select>
                </div>
            )}

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    rows="3"
                />
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                >
                    Submit Request
                </button>
            </div>
        </form>

    );
};


export default RecipientDashboard;