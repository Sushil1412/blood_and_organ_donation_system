import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DonorHeader from '../../components/Header/DonorHeader';
import Footer from '../../components/Footer/Footer';

const DonorPage = ({ setActiveTab }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            title: 'Save Lives with Blood Donation',
            description: 'Your single donation can save up to 3 lives'
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            title: 'Organ Donation - A Gift of Life',
            description: 'Register as an organ donor and give the gift of life'
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            title: 'Join Our Community of Donors',
            description: 'Thousands of donors making a difference every day'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <>
            <DonorHeader />
            <div className="container mx-auto px-4 py-8">
                {/* Hero Slider */}
                <div className="relative h-96 overflow-hidden rounded-lg shadow-lg mb-12">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <div className="text-center text-white px-4">
                                    <h1 className="text-4xl font-bold mb-4">{slide.title}</h1>
                                    <p className="text-xl mb-6">{slide.description}</p>
                                    <Link
                                        to="/donor/pledge"
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
                                        onClick={() => setActiveTab('')}
                                    >
                                        Make a Pledge
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Slider Dots */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-gray-400'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Donation Awareness Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Donate?</h2>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold mb-4 text-red-600">Blood Donation</h3>
                            <ul className="space-y-4 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    <span>Every 2 seconds someone in the world needs blood</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    <span>A single donation can save up to 3 lives</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    <span>Blood cannot be manufactured - it can only come from donors</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    <span>Donating blood may reduce the risk of heart disease</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    <span>The process takes less than an hour from registration to refreshments</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold mb-4 text-red-600">Organ Donation</h3>
                            <ul className="space-y-4 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    <span>One organ donor can save up to 8 lives</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    <span>Over 100,000 people in  India are waiting for an organ transplant</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    <span>Organs and tissues that can be donated include: heart, kidneys, lungs, pancreas, liver, intestines, corneas, skin, tendons, bone, and heart valves</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    <span>There is no age limit for organ donation</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    <span>All major religions support organ donation as a final act of compassion and generosity</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-red-50 p-8 rounded-lg border border-red-100">
                        <h3 className="text-2xl font-bold mb-4 text-center text-red-600">The Donation Process</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-red-600 text-xl font-bold">1</span>
                                </div>
                                <h4 className="font-bold mb-2">Registration</h4>
                                <p className="text-gray-600">Complete a health history questionnaire and provide identification</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-red-600 text-xl font-bold">2</span>
                                </div>
                                <h4 className="font-bold mb-2">Health Check</h4>
                                <p className="text-gray-600">Quick health screening including blood pressure and hemoglobin check</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-red-600 text-xl font-bold">3</span>
                                </div>
                                <h4 className="font-bold mb-2">Donation</h4>
                                <p className="text-gray-600">The actual donation takes about 8-10 minutes for blood</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Hospital Achievements Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-8">Hospital Achievements</h2>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                            <div className="p-6 text-center">
                                <div className="text-red-600 text-5xl font-bold mb-2">1,200+</div>
                                <h3 className="text-xl font-semibold mb-2">Successful Transplants</h3>
                                <p className="text-gray-600">Completed in the last year across our partner hospitals</p>
                            </div>
                            <div className="p-6 text-center">
                                <div className="text-red-600 text-5xl font-bold mb-2">98%</div>
                                <h3 className="text-xl font-semibold mb-2">Success Rate</h3>
                                <p className="text-gray-600">For organ transplant procedures performed</p>
                            </div>
                            <div className="p-6 text-center">
                                <div className="text-red-600 text-5xl font-bold mb-2">24/7</div>
                                <h3 className="text-xl font-semibold mb-2">Availability</h3>
                                <p className="text-gray-600">Emergency transplant teams ready at all times</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-4 text-red-600">Innovation in Transplant Medicine</h3>
                            <p className="text-gray-700 mb-4">
                                Our partner hospitals have pioneered new techniques in minimally invasive transplant surgeries,
                                reducing recovery times by up to 40% compared to traditional methods.
                            </p>
                            <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                <p className="italic text-gray-600">
                                    "The new laparoscopic kidney transplant procedure allowed me to return to work in half the expected time."
                                </p>
                                <p className="font-semibold mt-2">-  Kidney Recipient</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-4 text-red-600">Community Outreach</h3>
                            <p className="text-gray-700 mb-4">
                                Last year, our hospitals conducted over 500 free screening camps in underserved communities,
                                identifying 2,300 potential donors and providing health education to more than 15,000 people.
                            </p>
                            <div className="flex items-center">
                                <div className="bg-red-100 p-3 rounded-full mr-4">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <p className="text-gray-600">
                                    Over 60% of new donor registrations come from our community programs
                                </p>
                            </div>
                        </div>
                    </div>
                </section>


            </div>
            <Footer />
        </>
    );
};

export default DonorPage;