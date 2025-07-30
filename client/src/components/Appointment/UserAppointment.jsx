import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserHeader from '../Header/UserHeader';
// import UserHeader from './Header/UserHeader';


const UserAppointment = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const navigate = useNavigate();

    // Mock data - replace with API calls
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            requestId: 1024,
            type: 'Organ',
            organ: 'Kidney',
            hospital: 'City General Hospital',
            doctor: 'Dr. Sarah Johnson',
            date: '2023-11-15',
            time: '09:30 AM',
            status: 'Confirmed',
            address: '123 Medical Center Blvd, Suite 400',
            contact: '(555) 123-4567',
            instructions: 'Fast for 8 hours prior. Bring insurance documents and a companion.'
        },
        {
            id: 2,
            requestId: 1025,
            type: 'Blood',
            bloodType: 'A+',
            hospital: 'Regional Blood Center',
            doctor: 'Dr. Michael Chen',
            date: '2023-11-10',
            time: '02:15 PM',
            status: 'Completed',
            address: '456 Transfusion Way',
            contact: '(555) 987-6543',
            instructions: 'Hydrate well before donation. Eat iron-rich foods 2 days prior.'
        }
    ]);

    // Filter appointments based on tab
    const filteredAppointments = appointments.filter(app =>
        activeTab === 'upcoming' ? app.status !== 'Completed' : app.status === 'Completed'
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <UserHeader />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`px-4 py-2 rounded-md ${activeTab === 'upcoming' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                        >
                            Upcoming
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-4 py-2 rounded-md ${activeTab === 'history' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                        >
                            History
                        </button>
                    </div>
                </div>

                {/* Appointment Cards */}
                <div className="space-y-6">
                    {filteredAppointments.length === 0 ? (
                        <div className="bg-white p-6 rounded-lg shadow text-center">
                            <p className="text-gray-500">No {activeTab === 'upcoming' ? 'upcoming' : 'past'} appointments found</p>
                        </div>
                    ) : (
                        filteredAppointments.map(appointment => (
                            <div key={appointment.id} className="bg-white shadow overflow-hidden rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {appointment.type} Transplant - {appointment.organ || appointment.bloodType}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Request ID: #{appointment.requestId}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                            appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Hospital Details</h4>
                                        <p className="mt-1 text-sm text-gray-900 font-medium">{appointment.hospital}</p>
                                        <p className="mt-1 text-sm text-gray-500">{appointment.address}</p>
                                        <p className="mt-1 text-sm text-gray-500">Contact: {appointment.contact}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Appointment</h4>
                                        <p className="mt-1 text-sm text-gray-900 font-medium">
                                            {new Date(appointment.date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-900">{appointment.time}</p>
                                        <p className="mt-1 text-sm text-gray-500">Doctor: {appointment.doctor}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Instructions</h4>
                                        <p className="mt-1 text-sm text-gray-500">{appointment.instructions}</p>
                                        {appointment.status === 'Confirmed' && (
                                            <button
                                                className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                onClick={() => alert('Reschedule functionality would go here')}
                                            >
                                                Reschedule
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {appointment.status === 'Confirmed' && (
                                    <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                                        <button
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                                            onClick={() => alert('Directions functionality would go here')}
                                        >
                                            Get Directions
                                        </button>
                                        <button
                                            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                                            onClick={() => alert('Confirmation functionality would go here')}
                                        >
                                            Confirm Attendance
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserAppointment;