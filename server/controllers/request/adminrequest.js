const express = require('express');
const Donor = require('../../models/Donor');
const Hospital = require('../../models/Hospital');
const UserRequest = require('../../models/UerRequest');
const BloodInventory = require('../../models/BloodInventory')
const HospitalRequest = require('../../models/HospitalRequest');
const OrganInventory = require('../../models/OrganInventory');
const router = express.Router();

// Get all pending requests (both donors and hospitals)
exports.adminrequest = async (req, res) => {
    try {
        // Get pending donor registrations
        const pendingDonors = await Donor.find({ status: 'pending' }).select('-password -__v');
        // Get pending hospital registrations
        const pendingHospitals = await Hospital.find({ status: 'pending' }).select('-password -__v');

        res.json({
            donors: pendingDonors,
            hospitals: pendingHospitals
        });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update request status (handles both donor and hospital)
exports.adminupdate = async (req, res) => {
    try {
        const { type, id } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        let model;
        if (type === 'donor') {
            model = Donor;
        } else if (type === 'hospital') {
            model = Hospital;
        } else {
            return res.status(400).json({ message: 'Invalid type. Must be "donor" or "hospital"' });
        }

        const updatedEntity = await model.findByIdAndUpdate(
            id,
            { status },
            { new: true, select: '-password -__v' }
        );

        if (!updatedEntity) {
            return res.status(404).json({ message: `${type} not found` });
        }

        res.json({
            message: `${type} request ${status} successfully`,
            [type]: updatedEntity
        });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get all pending requests
exports.adminapplication = async (req, res) => {
    try {
        const requests = await UserRequest.find({});
        // console.log(requests);
        res.json(requests);
        // console.log(requests);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.adminapplicationupdate = async (req, res) => {
    try {
        const { requestId, status } = req.body; // Now using requestId instead of email

        // Validate status
        console.log(status);
        const validStatuses = ['Pending', 'Approved', 'Unavailable', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Allowed values: Pending, Approved, unavailable, Rejected'
            });
        }

        // Find and update the request by its unique ID
        if (status == 'Approved') {
            console.log('this is id:', requestId);
        }
        const updatedRequest = await UserRequest.findByIdAndUpdate(
            requestId,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({
                success: false,
                message: 'Request not found with the provided ID'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Request status updated successfully',
            data: updatedRequest
        });

    } catch (err) {
        console.error('Error updating request status:', err);
        res.status(500).json({
            success: false,
            message: 'Server error while updating request status',
            error: err.message
        });
    }
};

exports.adminhistory = async (req, res) => {
    try {
        const users = await UserRequest.find({
            status: { $in: ["approved", "unavailable"] }
        });

        res.json(users);
        console.log(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}

//hospital request

// Controller
exports.hospitalinventory = async (req, res) => {
    try {
        const hospitalEmail = req.query.hospitalEmail; // ✅ use query instead of body
        // console.log("hospital email", hospitalEmail);

        const hospital = await Hospital.findOne({ email: hospitalEmail });
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }
        console.log()
        const inventory = await BloodInventory.find({ hospitalId: hospital.hospitalId });
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Update or insert inventory entry
exports.inventoryupdate = async (req, res) => {
    try {
        const { hospitalEmail, name, bloodType, quantity, neededBy } = req.body;

        if (!hospitalEmail || !bloodType || !name || quantity === undefined) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const parsedQuantity = Number(quantity);
        if (isNaN(parsedQuantity)) {
            return res.status(400).json({ message: "Quantity must be a valid number." });
        }

        const hospital = await Hospital.findOne({ email: hospitalEmail });
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        const filter = {
            hospitalId: hospital.hospitalId,
            bloodType: bloodType
        };

        const total = Number(hospital.units || 0) + parsedQuantity;

        const update = {
            hospitalName: name,
            units: total,
            lastUpdated: new Date()
        };

        const options = {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        };

        const updatedInventory = await BloodInventory.findOneAndUpdate(filter, update, options);

        res.status(200).json({ message: 'Inventory updated successfully.', data: updatedInventory });

    } catch (error) {
        console.error('Error in inventoryUpdate:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};


//hospital request

exports.hospitalrequest = async (req, res) => {

    try {
        const { hospitalEmail, type, hospitalName, bloodType, quantity, neededBy } = req.body;

        // Validate input
        if (!bloodType || !quantity || !neededBy, !type) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create new request
        const newRequest = new HospitalRequest({
            hospitalEmail,
            requestType: type,
            hospitalName,
            bloodType,
            quantity,
            neededBy: new Date(neededBy),
            status: 'pending'
        });

        await newRequest.save();

        res.status(201).json({
            message: 'Blood request submitted successfully',
            request: newRequest
        });
    } catch (error) {
        console.error('Error submitting blood request:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }

}


//admin request for hospital info

exports.adminhospitalrequests = async (req, res) => {
    try {
        const requests = await HospitalRequest.find({});
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch records from hospital' });
    }
}

// In your auth controller file (e.g., authController.js)

// Update hospital request status
exports.updateHospitalRequest = async (req, res) => {
    try {
        const { requestId, status } = req.body;

        // Validate input
        if (!requestId || !status) {
            return res.status(400).json({ message: 'Request ID and status are required' });
        }
        console.log(requestId);
        // Find the hospital request
        const request = await HospitalRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Hospital request not found' });
        }

        // Validate status
        const validStatuses = ['pending', 'approved', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        // Update the request
        request.status = status;
        request.updatedAt = new Date();
        await request.save();

        // If approved, you might want to do additional processing here
        if (status === 'Approved') {
            // For example, notify the hospital or create inventory records
        }

        res.status(200).json({
            message: 'Hospital request updated successfully',
            updatedRequest: request
        });

    } catch (error) {
        console.error('Error updating hospital request:', error);
        res.status(500).json({ message: 'Server error while updating hospital request' });
    }
};


//organ inventory


exports.organinventory = async (req, res) => {
    try {
        const { hospitalEmail } = req.query;

        if (!hospitalEmail) {
            return res.status(400).json({ message: 'Hospital email is required' });
        }

        const inventory = await OrganInventory.find({ hospitalEmail });

        if (!inventory || inventory.length === 0) {
            return res.status(404).json({ message: 'No organ inventory found for this hospital' });
        }

        res.status(200).json(inventory);
    } catch (error) {
        console.error('Error fetching organ inventory:', error);
        res.status(500).json({ message: 'Server error while fetching organ inventory' });
    }
}

exports.organinventoryupdate = async (req, res) => {
    try {
        const { hospitalEmail, hospitalName, organType, quantity } = req.body;

        // Validate input
        if (!hospitalEmail || !organType || quantity === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if units is a valid number
        if (isNaN(quantity) || quantity < 0) {
            return res.status(400).json({ message: 'Invalid units value' });
        }

        // Find and update the organ inventory, or create if it doesn't exist
        const updatedInventory = await OrganInventory.findOneAndUpdate(
            { hospitalEmail, organType },
            {
                hospitalName,
                quantity: parseInt(quantity),
                updatedAt: Date.now()
            },
            {
                upsert: true, // Create if doesn't exist
                new: true // Return the updated document
            }
        );

        res.status(200).json({
            message: 'Organ inventory updated successfully',
            inventory: updatedInventory
        });
    } catch (error) {
        console.error('Error updating organ inventory:', error);
        res.status(500).json({ message: 'Server error updating organ inventory' });
    }
}

exports.hospitalorganrequests = async (req, res) => {
    try {
        const { hospitalEmail, type } = req.query;

        // Validate required parameters
        if (!hospitalEmail || !type) {
            return res.status(400).json({ message: "Missing hospitalEmail or type query parameter" });
        }

        // Normalize requestType (make case-insensitive)
        const requestType = type;

        // Fetch matching records
        const requests = await HospitalRequest.find({
            hospitalEmail,
            requestType
        });

        res.status(200).json(requests);
    } catch (error) {
        console.error("Error fetching hospital requests:", error);
        res.status(500).json({ message: "Server error while fetching hospital requests" });
    }
}

exports.hospitalrequestsubmit = async (req, res) => {
    try {
        const {
            hospitalEmail,
            hospitalName,
            requestType,
            organType,
            quantity,
            neededBy
        } = req.body;

        // Validate required fields
        if (!hospitalEmail || !hospitalName || !requestType || !quantity || !neededBy) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (requestType === 'Organ' && !organType) {
            return res.status(400).json({ message: 'Organ type is required for organ requests' });
        }

        // Create new request
        const newRequest = new HospitalRequest({
            hospitalEmail,
            hospitalName,
            requestType,
            organType: requestType === 'organ' ? organType : undefined,
            quantity,
            neededBy: new Date(neededBy),
            status: 'pending'
        });

        // Save to database
        const savedRequest = await newRequest.save();

        res.status(201).json({
            message: 'Organ request submitted successfully',
            request: savedRequest
        });

    } catch (error) {
        console.error('Error submitting organ request:', error);
        res.status(500).json({ message: 'Server error submitting request' });
    }
}
