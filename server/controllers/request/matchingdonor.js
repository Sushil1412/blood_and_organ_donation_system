
const Pledge = require('../../models/Pledge');
const Donor = require('../../models/Donor');
const BloodRequestDonor = require('../../models/BloodRequestDonor');
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    // console.log("thisss", lat1, lon1, lat2, lon2);
    // console.log("hiii");
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

exports.findDonors = async (req, res) => {
    try {
        const { bloodType, longitude, latitude, radius } = req.body;

        if (!latitude || !longitude || !bloodType) {
            return res.status(400).json({ message: 'Invalid location or blood type' });
        }

        // Fetch all active blood donors with the matching blood type
        const allDonors = await Pledge.find({
            donationType: 'blood',
            bloodType,
            status: 'active',
            latitude: { $ne: null },
            longitude: { $ne: null }
        });
        console.log(allDonors);
        // Filter donors within the radius
        const matchedDonors = allDonors
            .map(donor => {
                const distance = getDistanceFromLatLonInKm(
                    latitude,
                    longitude,
                    donor.latitude,
                    donor.longitude
                );
                return { ...donor.toObject(), distance };
            })
            .filter(d => d.distance <= radius);

        res.json(matchedDonors);
    } catch (err) {
        console.error('Error in /findDonors:', err);
        res.status(500).json({ message: 'Server error while finding donors' });
    }
}


exports.sendDonorRequest = async (req, res) => {
    try {
        const { email } = req.params;
        const {
            recipientName,
            recipientAddress,
            bloodType,
            neededBy,
            hospitalDetails
        } = req.body;

        // 1. Verify the donor exists and get their email
        // const donor = await Donor.findById(email);
        // if (!donor) {
        //     return res.status(404).json({ message: 'Donor not found' });
        // }

        // 2. Create a new blood request record
        console.log(email);
        const newBloodRequest = new BloodRequestDonor({
            email: email, // Using donor's email from Donor model
            needByDate: new Date(neededBy),
            needByTime: new Date(neededBy).toLocaleTimeString(), // Or extract time from neededBy
            purpose: `Blood donation request for ${recipientName}`,
            bloodGroup: bloodType,
            status: 'pending',
            address: recipientAddress
        });

        await newBloodRequest.save();

        // 3. Here you would typically:
        // - Send notification to donor (email, push notification, etc.)
        // - Log the request
        // - Any other business logic

        res.status(201).json({
            message: 'Blood request sent successfully',
            requestId: newBloodRequest._id,
            donorEmail: email
        });

    } catch (error) {
        console.error('Error sending blood request:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}