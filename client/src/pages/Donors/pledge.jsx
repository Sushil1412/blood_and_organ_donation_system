import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DonorHeader from '../../components/Header/DonorHeader';
import { useAuth } from '../../context/AuthContext';
const Pledge = () => {
  const [pledge, setPledge] = useState({
    fullName: '',
    email: '',
    phone: '',
    aadharNumber: '',
    age: '',
    dob: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    donationType: '',
    bloodType: '',
    organTypes: [],
    termsAgreed: false
  });
  const { token } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [existingPledges, setExistingPledges] = useState({ blood: false, organ: false });

  // Check for existing pledges when component mounts
  useEffect(() => {
    const checkExistingPledges = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/mypledgetype`, {
          params: {
            email: localStorage.getItem('email')
          }
        }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
        setExistingPledges(response.data);

        // Set initial donationType based on existing pledges
        if (!response.data.blood && !response.data.organ) {
          setPledge(prev => ({ ...prev, donationType: 'blood' }));
        } else if (!response.data.blood) {
          setPledge(prev => ({ ...prev, donationType: 'blood' }));
        } else if (!response.data.organ) {
          setPledge(prev => ({ ...prev, donationType: 'organ' }));
        }
      } catch (error) {
        console.error('Error checking existing pledges:', error);
      }
    };

    checkExistingPledges();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      if (name === 'termsAgreed') {
        setPledge({ ...pledge, [name]: checked });
      } else {
        // Handle organ type checkboxes
        let updatedOrganTypes = [...pledge.organTypes];
        if (checked) {
          updatedOrganTypes.push(value);
        } else {
          updatedOrganTypes = updatedOrganTypes.filter(type => type !== value);
        }
        setPledge({ ...pledge, organTypes: updatedOrganTypes });
      }
    } else {
      setPledge({ ...pledge, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Check if user already has a pledge for this donation type
    if ((pledge.donationType === 'blood' && existingPledges.blood) ||
      (pledge.donationType === 'organ' && existingPledges.organ)) {
      setError(`You already have an existing pledge for ${pledge.donationType === 'blood' ? 'blood donation' : 'organ donation'}.`);
      setIsLoading(false);
      return;
    }

    try {
      // Prepare the data to send
      const x = localStorage.getItem('longitude');
      const y = localStorage.getItem('latitude');
      const pledgeData = {
        ...pledge,
        // Remove any empty fields that aren't required
        address: pledge.address,
        city: pledge.city,
        state: pledge.state,
        pincode: pledge.pincode,
        longitude: x,
        latitude: y,
        bloodType: pledge.donationType === 'blood' ? pledge.bloodType : undefined,
        organTypes: pledge.donationType === 'organ' ? pledge.organTypes : undefined
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/pledges`, pledgeData,  {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Pledge submitted successfully:', response.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting pledge:', error);
      setError(error.response?.data?.message || error.message || 'An error occurred while submitting your pledge. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (<>
      <DonorHeader />
      <div className="bg-white shadow rounded-lg p-8 text-center max-w-2xl mx-auto mt-10">
        <div className="text-green-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Thank You for Your Pledge!</h2>
        <p className="text-gray-600 mb-6">
          Your commitment to saving lives through {pledge.donationType === 'blood' ? 'blood donation' : 'organ donation'} is truly appreciated.
        </p>
      </div>
    </>
    );
  }

  // If user has both types of pledges, show a message
  if (existingPledges.blood && existingPledges.organ) {
    return (<>
      <DonorHeader />
      <div className="bg-white shadow rounded-lg p-8 text-center max-w-2xl mx-auto mt-10">
        <div className="text-blue-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">You've Already Pledged Both Blood and Organ Donation</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your commitment to saving lives. You've already pledged for both blood and organ donation.
        </p>
      </div>
    </>);
  }

  return (<>
    <DonorHeader />
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Form Header */}
        <div className="bg-red-600 py-4 px-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Make a Donation Pledge</h1>
          <p className="text-red-100 mt-1">Your pledge can save lives. Fill out the form below.</p>

          {/* Existing pledge notifications */}
          {existingPledges.blood && (
            <div className="mt-2 p-2 bg-red-700 rounded text-white text-sm">
              You already have a blood donation pledge.
            </div>
          )}
          {existingPledges.organ && (
            <div className="mt-2 p-2 bg-red-700 rounded text-white text-sm">
              You already have an organ donation pledge.
            </div>
          )}
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                    <input
                      type="text"
                      name="fullName"
                      value={pledge.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={pledge.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                    <input
                      type="tel"
                      name="phone"
                      value={pledge.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number*</label>
                    <input
                      type="text"
                      name="aadharNumber"
                      value={pledge.aadharNumber}
                      onChange={handleInputChange}
                      pattern="[0-9]{12}"
                      title="Please enter a valid 12-digit Aadhar number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age*</label>
                    <input
                      type="number"
                      name="age"
                      value={pledge.age}
                      onChange={handleInputChange}
                      min="18"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth*</label>
                    <input
                      type="date"
                      name="dob"
                      value={pledge.dob}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Address Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address*</label>
                    <textarea
                      name="address"
                      value={pledge.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
                      required={pledge.donationType === 'organ'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                    <input
                      type="text"
                      name="city"
                      value={pledge.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
                      required={pledge.donationType === 'organ'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
                    <input
                      type="text"
                      name="state"
                      value={pledge.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
                      required={pledge.donationType === 'organ'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode*</label>
                    <input
                      type="text"
                      name="pincode"
                      value={pledge.pincode}
                      onChange={handleInputChange}
                      pattern="[0-9]{6}"
                      title="Please enter a valid 6-digit pincode"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
                      required={pledge.donationType === 'organ'}
                    />
                  </div>
                </div>
              </div>

              {/* Donation Type - Only show if there are options available */}
              {(!existingPledges.blood || !existingPledges.organ) && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Donation Type</h2>
                  <div className="space-y-4">
                    {!existingPledges.blood && (
                      <div className="flex items-center">
                        <input
                          id="blood-donation"
                          name="donationType"
                          type="radio"
                          value="blood"
                          checked={pledge.donationType === 'blood'}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <label htmlFor="blood-donation" className="ml-3 block text-sm font-medium text-gray-700">
                          Blood Donation
                        </label>
                      </div>
                    )}

                    {!existingPledges.organ && (
                      <div className="flex items-center">
                        <input
                          id="organ-donation"
                          name="donationType"
                          type="radio"
                          value="organ"
                          checked={pledge.donationType === 'organ'}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <label htmlFor="organ-donation" className="ml-3 block text-sm font-medium text-gray-700">
                          Organ Donation
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Blood Donation Details */}
              {pledge.donationType === 'blood' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Blood Donation Details</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type*</label>
                    <select
                      name="bloodType"
                      value={pledge.bloodType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
                      required
                    >
                      <option value="">Select Your Blood Type</option>
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
                </div>
              )}

              {/* Organ Donation Details */}
              {pledge.donationType === 'organ' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Organ Donation Details</h2>
                  <p className="text-sm text-gray-500 mb-4">Select all organs you're willing to donate:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', 'Intestine', 'Cornea', 'Skin', 'Bone', 'Full Body'].map(organ => (
                      <div key={organ} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={`organ-${organ.toLowerCase().replace(' ', '-')}`}
                            name={`organ-${organ.toLowerCase().replace(' ', '-')}`}
                            type="checkbox"
                            value={organ}
                            checked={pledge.organTypes.includes(organ)}
                            onChange={handleInputChange}
                            className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            // If Full Body is selected, disable other options
                            disabled={organ !== 'Full Body' && pledge.organTypes.includes('Full Body')}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor={`organ-${organ.toLowerCase().replace(' ', '-')}`}
                            className={`font-medium ${organ !== 'Full Body' && pledge.organTypes.includes('Full Body') ? 'text-gray-400' : 'text-gray-700'}`}
                          >
                            {organ}
                            {organ === 'Full Body' && <span className="text-xs text-red-500 ml-1">(All organs and tissues)</span>}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  {pledge.organTypes.includes('Full Body') && (
                    <p className="mt-2 text-sm text-green-600">
                      Full Body selection includes all organs and tissues for donation.
                    </p>
                  )}
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="termsAgreed"
                      type="checkbox"
                      checked={pledge.termsAgreed}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700">
                      I agree to the terms and conditions*
                    </label>
                    <p className="text-gray-500 mt-1">
                      By checking this box, I confirm that I understand the donation process and voluntarily pledge to donate.
                      I also confirm that all information provided is accurate to the best of my knowledge.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || !pledge.donationType}
                  className={`w-full ${isLoading || !pledge.donationType
                    ? 'bg-red-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                    } text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 transform hover:scale-105`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Submit Pledge'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
  );
};

export default Pledge;