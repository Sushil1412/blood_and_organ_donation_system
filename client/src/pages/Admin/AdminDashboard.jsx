import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../components/Header/AdminHeader';

const AdminDashboard = () => {
    const navigate = useNavigate();



    const cards = [
        {
            title: 'Hospital Inventory',
            description: 'Manage blood stock levels',
            path: '/Admin/inventory',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2zM12 6v4m0 4v2" />
                </svg>
            )
        },
        {
            title: 'Blood Donors',
            count: 156,
            description: 'View and manage blood donors',
            path: '/Admin/blood',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
            )
        },
        {
            title: 'Organ Donors',
            count: 42,
            description: 'View and manage organ donors',
            path: '/admin/organ',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            )
        }
    ];

    return (
        <>
            <AdminHeader />
            <div className="min-h-screen bg-gray-50 p-6 md:p-10">
                {/* Cards Section */}
                <div className="ml-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {cards.map((card) => (
                            <div
                                key={card.title}
                                onClick={() => navigate(card.path)}
                                className="bg-white rounded-lg shadow-sm p-4 transition-all duration-200 cursor-pointer 
                                           hover:shadow-md hover:-translate-y-1 active:translate-y-0
                                           group w-64"
                            >
                                <div className="flex flex-col items-center text-center h-full">
                                    <div className="mb-2 text-red-600 group-hover:text-red-700">
                                        {card.icon}
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-800 group-hover:text-red-700">
                                        {card.title}
                                    </h2>
                                    {/* <p className="text-2xl font-bold text-red-700 my-1">
                                        {card.count}
                                    </p> */}
                                    <p className="text-sm text-gray-600 mt-auto">
                                        {card.description}
                                    </p>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>

                {/* Recent Activity Section */}

            </div>
        </>
    );
};

export default AdminDashboard;