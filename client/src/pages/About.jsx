import UserHeader from "../components/Header/UserHeader";

const About = () => {
    const stats = [
        { value: '10,000+', label: 'Lives Saved' },
        { value: '50+', label: 'Partner Hospitals' },
        { value: '25,000+', label: 'Registered Donors' },
        { value: '100+', label: 'Cities Served' }
    ];

    const team = [
        {
            name: 'Dr. Priya Sharma',
            role: 'Medical Director',
            bio: 'Cardiologist with 15 years experience in transplant medicine',
            img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            name: 'Rahul Kapoor',
            role: 'Founder & CEO',
            bio: 'Tech entrepreneur passionate about healthcare accessibility',
            img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            name: 'Ananya Patel',
            role: 'Donor Relations',
            bio: 'Coordinates with donors and recipient families',
            img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <UserHeader />

            <main>
                {/* Hero Section with background image */}
                <div className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
                    {/* Background image with overlay */}
                    <div className="absolute inset-0 bg-black opacity-30">
                        {/* <img
                            src="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                            alt="Hospital background"
                            className="w-full h-full object-cover"
                        /> */}
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-bold mb-6">Our Mission to Save Lives</h1>
                        <p className="text-xl max-w-3xl mx-auto">
                            Connecting donors with recipients to create a network of hope and healing across India
                        </p>
                    </div>
                </div>

                {/* Story Section
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Founded in 2015, LifeShare began as a small initiative in Bangalore to address the critical shortage of organ and blood donors in India.
                                </p>
                                <p>
                                    After witnessing firsthand the challenges families face when searching for compatible donors, our founder Rahul Kapoor assembled a team of medical professionals and technologists to create a better system.
                                </p>
                                <p>
                                    Today, we've grown into India's most trusted donor-recipient matching platform, facilitating thousands of life-saving connections every year.
                                </p>
                            </div>
                        </div>
                        <div className="rounded-lg overflow-hidden shadow-xl">
                            <img
                                src="https://images.pexels.com/photos/7088525/pexels-photo-7088525.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                                alt="Medical team discussing patient care"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </div> */}

                {/* Stats Section */}
                <div className="bg-gray-100 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">By The Numbers</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <p className="text-4xl font-bold text-red-600">{stat.value}</p>
                                    <p className="mt-2 text-lg font-medium text-gray-700">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Leadership</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                                    <p className="text-red-600 font-medium">{member.role}</p>
                                    <p className="mt-2 text-gray-600">{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Values Section */}
                <div className="bg-red-50 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-red-600 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Compassion</h3>
                                <p className="text-gray-600">
                                    We treat every donor and recipient with the dignity and care we would want for our own families.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-red-600 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Urgency</h3>
                                <p className="text-gray-600">
                                    We move quickly because we understand that every minute counts in life-saving situations.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-red-600 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Integrity</h3>
                                <p className="text-gray-600">
                                    We maintain the highest ethical standards in all our donor-recipient matching processes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Success Stories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center mb-4">
                                <img
                                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                                    alt="Patient testimonial"
                                    className="w-16 h-16 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h4 className="font-bold">Rajesh Mehta</h4>
                                    <p className="text-gray-600 text-sm">Liver recipient, Mumbai</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                "LifeShare connected me with a donor within 48 hours when my condition was critical. I owe my life to their efficient system."
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center mb-4">
                                <img
                                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                                    alt="Donor testimonial"
                                    className="w-16 h-16 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h4 className="font-bold">Sunita Reddy</h4>
                                    <p className="text-gray-600 text-sm">Kidney donor, Hyderabad</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                "The team at LifeShare made the donation process so smooth and supported me at every step. Knowing I helped save a life is priceless."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Partners Section */}
                {/* <div className="bg-gray-100 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Trusted Partners</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
                            <img
                                src="https://via.placeholder.com/150x80?text=Apollo+Hospitals"
                                alt="Apollo Hospitals"
                                className="h-12 object-contain mx-auto"
                            />
                            <img
                                src="https://via.placeholder.com/150x80?text=Fortis+Healthcare"
                                alt="Fortis Healthcare"
                                className="h-12 object-contain mx-auto"
                            />
                            <img
                                src="https://via.placeholder.com/150x80?text=Max+Healthcare"
                                alt="Max Healthcare"
                                className="h-12 object-contain mx-auto"
                            />
                            <img
                                src="https://via.placeholder.com/150x80?text=Manipal+Hospitals"
                                alt="Manipal Hospitals"
                                className="h-12 object-contain mx-auto"
                            />
                        </div>
                    </div>
                </div> */}
            </main>
        </div>
    );
};

export default About;