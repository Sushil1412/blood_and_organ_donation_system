const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DonorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
    },
    role: {
        type: String,
        default: 'donor',
    },
    bloodGroup: {
        type: String,
        required: [true, 'Blood group is required'],
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    mobile: {
        type: String,
        required: [true, 'Please provide your mobile number'],
        default: 'not available'
    },
    address: {
        type: String,
        required: [true, 'Please provide your address'],
        default: 'not available'
    },
    aadhar: {
        type: String,
        required: [true, 'Aadhar number is required'],
        unique: true,
        // Add Aadhar validation if needed
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    status: {
        type: String,
        enum: ['approved', 'inactive', 'pending'], // Customize statuses as needed
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastDonationDate: {
        type: Date,
        default: null // Will be set when status changes to 'approved'
    }
});

// Hash password before saving
DonorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
DonorSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Donor', DonorSchema, 'donortable');