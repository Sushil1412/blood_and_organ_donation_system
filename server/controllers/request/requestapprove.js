
// const UserRequest = require('../../models/User'); // Make sure to import User model
const UserRequest = require('../../models/UerRequest'); // Fixed model name
const { Resend } = require('resend');
const { MailSlurp } = require('mailslurp-client');
const Recipient = require('../../models/Recipient')
const Donor = require('../../models/Donor');
const BloodInventory = require('../../models/BloodInventory');
const OrganInventory = require('../../models/OrganInventory');
// Initialize MailSlurp with your API key
const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY });

exports.requestapprove = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time, message, type, val, byDonor } = req.body;

        // Validate required fields
        if (!id || !date || !time || !type || !val) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Hospital info
        const hospitalInfo = {
            name: "City Hospital",
            address: "123 Medical Center Drive, Healthville, HV 12345",
            contact: "91+ 1111 2525 89"
        };

        const readableDate = new Date(date).toDateString();
        const confirmationMessage =
            `Your donation will be available on ${readableDate} at ${time}. ` +
            `Please visit ${hospitalInfo.name}, ${hospitalInfo.address}. ` +
            `For queries: ${hospitalInfo.contact}`;

        let inventoryUpdate = null;

        // Only update inventory if not by donor
        if (!byDonor) {
            // Update inventory based on type and value
            const normalizedType = type.toLowerCase();
            const normalizedVal = val.toUpperCase();

            if (normalizedType === 'blood') {
                // Update blood inventory
                inventoryUpdate = await BloodInventory.findOneAndUpdate(
                    { bloodType: normalizedVal },
                    { $inc: { units: -1 }, lastUpdated: new Date() },
                    { new: true }
                );

                if (!inventoryUpdate) {
                    return res.status(404).json({
                        success: false,
                        message: `Blood type ${normalizedVal} not found in inventory`
                    });
                }
            }
            else if (normalizedType === 'organ') {
                // Update organ inventory
                inventoryUpdate = await OrganInventory.findOneAndUpdate(
                    { organType: val }, // Organs are case-sensitive as defined in enum
                    { $inc: { quantity: -1 } },
                    { new: true }
                );

                if (!inventoryUpdate) {
                    return res.status(404).json({
                        success: false,
                        message: `Organ type ${val} not found in inventory`
                    });
                }
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid type - must be "blood" or "organ"'
                });
            }

            // Check if quantity went negative
            if ((inventoryUpdate.units !== undefined && inventoryUpdate.units < 0) ||
                (inventoryUpdate.quantity !== undefined && inventoryUpdate.quantity < 0)) {
                // Rollback the update
                if (normalizedType === 'blood') {
                    await BloodInventory.findOneAndUpdate(
                        { bloodType: normalizedVal },
                        { $inc: { units: 1 } }
                    );
                } else {
                    await OrganInventory.findOneAndUpdate(
                        { organType: val },
                        { $inc: { quantity: 1 } }
                    );
                }
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient inventory quantity'
                });
            }
        }

        // Update the request status
        const updatedRequest = await UserRequest.findByIdAndUpdate(
            id,
            {
                status: 'Approved',
                approvalDetails: {
                    date,
                    time,
                    message: byDonor ? message : confirmationMessage,
                    hospital: hospitalInfo
                }
            },
            { new: true }
        );

        if (!updatedRequest) {
            // Rollback inventory update if request not found and not by donor
            if (!byDonor) {
                if (type.toLowerCase() === 'blood') {
                    await BloodInventory.findOneAndUpdate(
                        { bloodType: val.toUpperCase() },
                        { $inc: { units: 1 } }
                    );
                } else {
                    await OrganInventory.findOneAndUpdate(
                        { organType: val },
                        { $inc: { quantity: 1 } }
                    );
                }
            }
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Send email (your existing MailSlurp code here)
        // ...

        res.status(200).json({
            success: true,
            data: {
                request: updatedRequest,
                inventory: inventoryUpdate
            }
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// exports.updateuserprofile = async (req, res) => {
//     try {
//         // const { email } = req.params; // Get email from URL params
//         const { email, address, mobile } = req.body;

//         // Validate required fields
//         if (!email) {
//             return res.status(400).json({
//                 success: false,
//                 msg: 'Email is required'
//             });
//         }

//         // Validate mobile number format if provided
//         if (mobile && !/^[0-9]{10}$/.test(mobile)) {
//             return res.status(400).json({
//                 success: false,
//                 msg: 'Please provide a valid 10-digit mobile number'
//             });
//         }
//         // console.log('work till', email);
//         // console.log('work till', mobile);
//         // console.log('work till', address);

//         // Find and update user by email
//         const updatedUser = await Recipient.findOneAndUpdate(
//             { email: email },
//             {
//                 $set: {
//                     address: address,
//                     mobile: mobile
//                 }
//             },
//             {
//                 new: true,         // Return the updated document
//                 runValidators: true  // Run schema validators on update
//             }
//         ).select('-password'); // Exclude password field

//         if (!updatedUser) {
//             console.log('update erro');
//             return res.status(404).json({
//                 success: false,
//                 msg: 'User not found with the provided email'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             msg: 'Profile updated successfully'
//         });


//     } catch (e) {

//         res.status(500).json({
//             success: false,
//             msg: 'Server error while updating profile'
//         });

//     }
// }//delet this


exports.getuser = async (req, res) => {
    try {
        const { email, role } = req.query;

        if (!email || !role) {
            return res.status(400).json({ msg: 'Email and role parameters are required' });
        }

        let user;
        if (role === 'recipient') {
            user = await Recipient.findOne({ email: email }).select('-password -__v');
        } else if (role === 'donor') {
            user = await Donor.findOne({ email: email }).select('-password -__v');
        } else {
            return res.status(400).json({ msg: 'Invalid role specified' });
        }

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// @desc    Update user profile
// @route   PUT /api/auth/updateuserprofile
// @access  Private
exports.updateuserprofile = async (req, res) => {
    try {
        const { email, address, mobile, role } = req.body;

        if (!email || !role) {
            return res.status(400).json({ msg: 'Email and role are required' });
        }

        let user;
        if (role === 'recipient') {
            user = await Recipient.findOne({ email: email });
        } else if (role === 'donor') {
            user = await Donor.findOne({ email: email });
        } else {
            return res.status(400).json({ msg: 'Invalid role specified' });
        }

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update only allowed fields
        if (address !== undefined) {
            user.address = address;
        }

        if (mobile !== undefined) {
            if (!/^\d{10}$/.test(mobile)) {
                return res.status(400).json({ msg: 'Mobile number must be 10 digits' });
            }
            user.mobile = mobile;
        }
        console.log('be');
        await user.save();
        console.log('af');
        // Return the updated user (excluding sensitive data)
        const userData = user.toObject();
        delete userData.password;
        delete userData.__v;

        res.json({
            msg: 'Profile updated successfully',
            user: userData
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}