const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const HospitalSchema = new mongoose.Schema({
    name: { // Hospital Name
        type: String,
        required: [true, 'Hospital name is required'],
    },
    email: { // Hospital Email
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
        default: 'hospital',
    },
    hospitalId: { // Hospital Registration ID
        type: String,
        required: [true, 'Hospital ID is required'],
        unique: true,
    },
    address: { // Hospital Address
        type: String,
        required: [true, 'Hospital address is required'],
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'], // Customize statuses as needed
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
HospitalSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
HospitalSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Hospital', HospitalSchema, 'hospitaltable');