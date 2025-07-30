const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const RecipientSchema = new mongoose.Schema({
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
        default: 'recipient',
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

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
RecipientSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
RecipientSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Recipient', RecipientSchema, 'recipienttable');