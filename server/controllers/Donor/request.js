// routes/pledgeRoutes.js
const express = require('express');
const router = express.Router();
const Pledge = require('../../models/Pledge');
const BloodRequestDonor = require('../../models/BloodRequestDonor');
const BloodInventory = require('../../models/BloodInventory')
const Donor = require('../../models/Donor');

// Submit a new pledge
exports.pledges = async (req, res) => {
    try {
        // Validate the request body
        const { donationType, organTypes, termsAgreed } = req.body;

        if (!termsAgreed) {
            return res.status(400).json({ error: 'You must agree to the terms and conditions' });
        }

        if (donationType === 'organ' && (!organTypes || organTypes.length === 0)) {
            return res.status(400).json({ error: 'Please select at least one organ for donation' });
        }

        // Create new pledge
        const pledge = new Pledge(req.body);
        await pledge.save();

        // Send confirmation email (you would implement this separately)
        // await sendConfirmationEmail(pledge.email, pledge.fullName, pledge.donationType);

        res.status(201).json({
            success: true,
            message: 'Pledge submitted successfully',
            data: pledge
        });
    } catch (error) {
        console.error('Error submitting pledge:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting pledge',
            error: error.message
        });
    }
}

// // Get all pledges (for admin dashboard)
exports.hospitalmypledge = async (req, res) => {
    try {
        const dtype = req.query.donationType;
        const pledges = await Pledge.find({ donationType: dtype }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: pledges
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching pledges',
            error: error.message
        });
    }
}
exports.mypledge = async (req, res) => {
    try {
        const email = req.query.email;
        const pledges = await Pledge.find({ email }).sort({ createdAt: -1 });
        res.json({
            success: true,
            data: pledges
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching pledges',
            error: error.message
        });
    }
}




exports.bloodRequestDonor = async (req, res) => {
    try {
        const {
            donorEmail,
            hospitalEmail,
            hospitalName,
            needByDate,
            needByTime,
            purpose,
            bloodGroup,
            donorName,
            donorPhone,
            address,
            status = 'pending'
        } = req.body;
        console.log(donorEmail);
        // Validate required fields
        if (!donorEmail || !needByDate || !needByTime || !purpose || !bloodGroup || !donorName || !donorPhone) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }


        // Create new blood request
        const newRequest = await BloodRequestDonor.create({
            email: donorEmail,
            needByDate: new Date(needByDate),
            needByTime,
            purpose,
            bloodGroup,
            status,
            address
        });

        res.status(201).json({
            success: true,
            message: 'Blood request created successfully',
            data: newRequest
        });

    } catch (error) {
        console.error('Error creating blood request:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
}


//blood request data to send to admin history

exports.bloodrequestforadmin = async (req, res) => {
    try {

        const data = await BloodRequestDonor.find({}).sort({ createdAt: -1 });

        // // Separate into pending and history
        // const pending = requests.filter(req => req.status === 'pending');
        // const history = requests.filter(req => req.status !== 'pending');

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//nlood request by email for donor
exports.bloodrequestfordonor = async (req, res) => {
    try {
        const email = req.query.email;
        const data = await BloodRequestDonor.find({ email }).sort({ createdAt: -1 });

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


exports.upadateBloodrequestdonor = async (req, res) => {
    try {
        const {
            requestId, status, bloodGroup, email
        } = req.body;

        // console.log(requestId);
        if (!['accepted', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        // console.log("thiiii", bloodGroup);
        if (status == 'accepted') {
            const updatedBloodGroup = await BloodInventory.findOneAndUpdate(
                { bloodType: bloodGroup },
                { $inc: { units: 1 } },
                { new: true, upsert: true } // upsert: true creates the record if it doesn't exist
            );
        }

        const updatedRequest = await BloodRequestDonor.findByIdAndUpdate(
            requestId,
            {
                status,
                lastDonationDate: status === 'accepted' || status === 'approved' ? new Date() : undefined
            },
            { new: true }
        );

        const updatedDonor = await Donor.findOneAndUpdate(
            { email: email },  // Find by email
            {
                $set: {
                    lastDonationDate: new Date()  // Update lastDonationDate to current date
                }
            },
            { new: true }  // Return the updated document
        );
        const updatePledge = await Pledge.findOneAndUpdate(
            { email: email },  // Find by email
            {
                $set: {
                    lastDonationDate: status === 'accepted' || status === 'approved' ? new Date() : undefined
                }
            },
            { new: true }  // Return the updated document
        );


        if (!updatedRequest) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        res.json({ success: true, request: updatedRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//donation type check


exports.mypledgetype = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check both blood and organ pledges for the given email
        const pledges = await Pledge.find({ email });

        const result = {
            blood: false,
            organ: false
        };

        pledges.forEach(p => {
            if (p.donationType === 'blood') result.blood = true;
            if (p.donationType === 'organ') result.organ = true;
        });

        return res.status(200).json(result);

    } catch (error) {
        console.error('Error checking pledges:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


exports.updatedonorstatus = async (req, res) => {
    try {
        const { donorId } = req.params;
        const { status } = req.body;

        // Check if pledge exists
        const existingPledge = await Pledge.findById(donorId);
        if (!existingPledge) {
            return res.status(404).json({
                success: false,
                message: "Donor pledge not found"
            });
        }

        // Update the pledge
        const updatedPledge = await Pledge.findByIdAndUpdate(
            donorId,
            { status },
            { new: true, runValidators: true }
        );
        return res.status(200).json({ message: 'success' });

    } catch (e) {

        console.error("Error updating donor status:", error);

        // Handle specific errors
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid donor ID"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });

    }
}