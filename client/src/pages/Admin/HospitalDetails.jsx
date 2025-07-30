import React, { useState } from 'react';
import AdminHeader from '../../components/Header/AdminHeader';
const HospitalDetails = () => {
    // Sample hospital data
    const hospitals = [
        {
            id: 1,
            name: 'City General Hospital',
            address: '123 Medical Drive, City Center',
            distance: '2.5 km',
            rating: 4.7,
            bloodTypes: ['A+', 'B+', 'O+', 'AB+'],
            organs: ['Kidney', 'Liver', 'Heart'],
            contact: '(123) 456-7890'
        },
        {
            id: 2,
            name: 'Red Cross Medical Center',
            address: '456 Health Avenue, Downtown',
            distance: '5.1 km',
            rating: 4.5,
            bloodTypes: ['A-', 'B-', 'O-', 'AB-'],
            organs: ['Kidney', 'Pancreas', 'Lung'],
            contact: '(234) 567-8901'
        },
        {
            id: 3,
            name: 'LifeCare Hospital',
            address: '789 Wellness Boulevard',
            distance: '7.8 km',
            rating: 4.3,
            bloodTypes: ['A+', 'A-', 'O+', 'O-'],
            organs: ['Liver', 'Heart', 'Cornea'],
            contact: '(345) 678-9012'
        },
        {
            id: 4,
            name: 'Unity Transplant Center',
            address: '101 Harmony Lane',
            distance: '10.2 km',
            rating: 4.8,
            bloodTypes: ['B+', 'B-', 'AB+', 'AB-'],
            organs: ['Kidney', 'Liver', 'Pancreas', 'Lung'],
            contact: '(456) 789-0123'
        }
    ];

    // All possible blood types and organs
    const allBloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    const allOrgans = ['Kidney', 'Liver', 'Heart', 'Pancreas', 'Lung', 'Cornea'];

    // State for filters
    const [selectedBloodTypes, setSelectedBloodTypes] = useState([]);
    const [selectedOrgans, setSelectedOrgans] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Toggle blood type selection
    const toggleBloodType = (type) => {
        setSelectedBloodTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    // Toggle organ selection
    const toggleOrgan = (organ) => {
        setSelectedOrgans(prev =>
            prev.includes(organ)
                ? prev.filter(o => o !== organ)
                : [...prev, organ]
        );
    };

    // Filter hospitals based on selections
    const filteredHospitals = hospitals.filter(hospital => {
        // Search term filter
        const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hospital.address.toLowerCase().includes(searchTerm.toLowerCase());

        // Blood type filter
        const matchesBlood = selectedBloodTypes.length === 0 ||
            selectedBloodTypes.some(type => hospital.bloodTypes.includes(type));

        // Organ filter
        const matchesOrgan = selectedOrgans.length === 0 ||
            selectedOrgans.some(organ => hospital.organs.includes(organ));

        return matchesSearch && matchesBlood && matchesOrgan;
    });

    return (
        <>
            <AdminHeader />
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-red-700 mb-2">Find Hospitals</h1>
                        <p className="text-gray-600">Browse hospitals with available blood types and organs</p>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        {/* Search Bar */}
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Search hospitals by name or location..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Blood Type Filters */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Filter by Blood Type</h3>
                            <div className="flex flex-wrap gap-2">
                                {allBloodTypes.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => toggleBloodType(type)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedBloodTypes.includes(type)
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Organ Filters */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Filter by Available Organs</h3>
                            <div className="flex flex-wrap gap-2">
                                {allOrgans.map(organ => (
                                    <button
                                        key={organ}
                                        onClick={() => toggleOrgan(organ)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedOrgans.includes(organ)
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                            }`}
                                    >
                                        {organ}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-4">
                        <p className="text-gray-600">
                            Showing <span className="font-bold text-red-700">{filteredHospitals.length}</span> {filteredHospitals.length === 1 ? 'hospital' : 'hospitals'}
                        </p>
                    </div>

                    {/* Hospitals List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredHospitals.map(hospital => (
                            <div key={hospital.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    {/* Hospital Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800">{hospital.name}</h2>
                                            <p className="text-red-600 font-medium">{hospital.distance}</p>
                                        </div>
                                        <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                                            ★ {hospital.rating}
                                        </div>
                                    </div>

                                    {/* Hospital Info */}
                                    <div className="mb-4">
                                        <p className="text-gray-600 mb-2">{hospital.address}</p>
                                        <p className="text-gray-600">Contact: {hospital.contact}</p>
                                    </div>

                                    {/* Blood Types */}
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Available Blood Types:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {hospital.bloodTypes.map(type => (
                                                <span key={type} className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs">
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Organs */}
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Available Organs:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {hospital.organs.map(organ => (
                                                <span key={organ} className="bg-pink-50 text-pink-700 px-2 py-1 rounded-full text-xs">
                                                    {organ}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-between mt-6">
                                        <button className="text-red-600 font-medium hover:text-red-800 transition-colors">
                                            View Details
                                        </button>
                                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                                            Book Appointment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredHospitals.length === 0 && (
                        <div className="text-center py-12">
                            <h3 className="text-xl font-medium text-gray-700 mb-2">No hospitals found</h3>
                            <p className="text-gray-500">Try adjusting your filters or search term</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default HospitalDetails;