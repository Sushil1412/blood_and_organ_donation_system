// models/Pledge.js
const mongoose = require('mongoose');
const pledgeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required: true
    },
    aadharNumber: {
        type: String,
        required: true,
        match: [/^\d{12}$/, 'Aadhar number must be 12 digits']
    },
    dob: {
        type: Date,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: [0, 'Age cannot be negative']
    },
    address: {
        type: String,
        required: function () { return this.donationType === 'organ'; }
    },
    city: {
        type: String,
        required: function () { return this.donationType === 'organ'; }
    },
    state: {
        type: String,
        required: function () { return this.donationType === 'organ'; }
    },
    pincode: {
        type: String,
        required: function () { return this.donationType === 'organ'; },
        match: [/^\d{6}$/, 'Pincode must be 6 digits']
    },
    longitude: {
        type: Number
    },
    latitude: {
        type: Number
    },
    donationType: {
        type: String,
        required: true,
        enum: ['blood', 'organ']
    },
    bloodType: {
        type: String,
        required: function () { return this.donationType === 'blood'; },
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']
    },
    organTypes: {
        type: [String],
        required: function () { return this.donationType === 'organ'; },
        enum: ['Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', 'Intestine', 'Cornea', 'Skin', 'Bone', 'Full Body']
    },
    termsAgreed: {
        type: Boolean,
        required: true,
        validate: {
            validator: function (v) {
                return v === true;
            },
            message: 'You must agree to the terms and conditions'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastDonationDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive', 'deceased', 'donated']
    }
});

module.exports = mongoose.model('Pledge', pledgeSchema);