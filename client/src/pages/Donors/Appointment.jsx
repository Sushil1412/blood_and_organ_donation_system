import React, { useState } from 'react';

const DonorAppointment = () => {
    // Sample appointment data with only essential fields
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            hospital: "City General Hospital",
            bloodType: "A+",
            date: "2023-11-15",
            time: "10:00 AM",
            status: "Pending"
        },
        {
            id: 2,
            hospital: "Central Blood Bank",
            bloodType: "A+",
            date: "2023-11-16",
            time: "02:30 PM",
            status: "Pending"
        },
        {
            id: 3,
            hospital: "Regional Medical Center",
            bloodType: "A+",
            date: "2023-11-17",
            time: "09:15 AM",
            status: "Accepted"
        },
        {
            id: 4,
            hospital: "Community Clinic",
            bloodType: "A+",
            date: "2023-11-18",
            time: "11:45 AM",
            status: "Rejected"
        }
    ]);

    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // Handle appointment response
    const handleResponse = (id, response) => {
        setAppointments(appointments.map(appointment =>
            appointment.id === id ? { ...appointment, status: response } : appointment
        ));
    };

    // View appointment details
    const viewDetails = (appointment) => {
        setSelectedAppointment(appointment);
    };

    // Close details modal
    const closeDetails = () => {
        setSelectedAppointment(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-red-700 text-white shadow-md">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold">Blood Donation Appointments</h1>
                    <p className="mt-2 text-red-100">
                        Your donation appointment requests
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Appointment List */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Your Appointment Requests
                        </h2>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Hospital
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Blood Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {appointment.hospital}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${appointment.bloodType === 'O-' ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'
                                                }`}>
                                                {appointment.bloodType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                                appointment.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {appointment.status === 'Pending' ? (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleResponse(appointment.id, 'Accepted')}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleResponse(appointment.id, 'Rejected')}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : appointment.status === 'Accepted' ? (
                                                <button
                                                    onClick={() => viewDetails(appointment)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    View
                                                </button>
                                            ) : (
                                                <span className="text-gray-400">Rejected</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Details Modal - Shows only the essential details */}
            {selectedAppointment && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Appointment Details
                                </h3>
                                <button
                                    onClick={closeDetails}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center">
                                    <div className="w-1/3 text-sm font-medium text-gray-500">Hospital:</div>
                                    <div className="w-2/3 text-sm text-gray-900">{selectedAppointment.hospital}</div>
                                </div>

                                <div className="flex items-center">
                                    <div className="w-1/3 text-sm font-medium text-gray-500">Blood Type:</div>
                                    <div className="w-2/3 text-sm text-gray-900">{selectedAppointment.bloodType}</div>
                                </div>

                                <div className="flex items-center">
                                    <div className="w-1/3 text-sm font-medium text-gray-500">Date:</div>
                                    <div className="w-2/3 text-sm text-gray-900">
                                        {new Date(selectedAppointment.date).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="w-1/3 text-sm font-medium text-gray-500">Time:</div>
                                    <div className="w-2/3 text-sm text-gray-900">{selectedAppointment.time}</div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={closeDetails}
                                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-red-800 text-white py-8 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p>© 2023 Blood Donation System. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default DonorAppointment;