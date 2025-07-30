import { FaHospital, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-6">
            <div className="container w-[80%] h-auto mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between">
                    {/* Website Info - Left Side */}
                    <div className="mb-8 md:mb-0 md:w-1/2">
                        <h3 className="text-2xl font-bold mb-4 flex items-center">
                            <FaHospital className="mr-2 text-red-500" />
                            LifeShare Connect
                        </h3>
                        <p className="mb-4 text-gray-300">
                            A platform connecting blood and organ donors with recipients in need.
                            Our mission is to save lives by making the donation process seamless
                            and efficient.
                        </p>
                        <div className="flex space-x-4 mb-4">
                            <a href="#" className="text-gray-300 hover:text-white">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white">
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white">
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                        <p className="text-gray-400 text-sm">
                            &copy; {new Date().getFullYear()} LifeShare Connect. All rights reserved.
                        </p>
                    </div>

                    {/* Hospital Address - Right Side */}
                    <div className="md:w-1/3">
                        <h4 className="text-xl font-semibold mb-4 border-b border-red-500 pb-2">
                            Partner Hospital
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <FaMapMarkerAlt className="mt-1 mr-3 text-red-500" />
                                <div>
                                    <p className="font-medium">City Hospital</p>
                                    <p className="text-gray-300">
                                        Odisha bbsr<br />
                                        Bhubaneswar, MA 759001<br />
                                        India
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaPhone className="mr-3 text-red-500" />
                                <span className="text-gray-300">+91 7777 555 89</span>
                            </div>
                            <div className="flex items-center">
                                <FaEnvelope className="mr-3 text-red-500" />
                                <span className="text-gray-300">info@cityhospital.org</span>
                            </div>
                            <div className="flex items-center">
                                <FaClock className="mr-3 text-red-500" />
                                <span className="text-gray-300">Open 24/7</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Links */}
                <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4 md:mb-0">
                        <a href="#" className="text-gray-300 hover:text-white text-sm">Privacy Policy</a>
                        <a href="#" className="text-gray-300 hover:text-white text-sm">Terms of Service</a>
                        <a href="#" className="text-gray-300 hover:text-white text-sm">FAQ</a>
                        <a href="#" className="text-gray-300 hover:text-white text-sm">Contact Us</a>
                        <a href="#" className="text-gray-300 hover:text-white text-sm">About Us</a>
                    </div>
                    <div className="text-gray-500 text-sm">
                        Made with ❤️ for a better healthcare system
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;