// models/BloodInventory.js
const mongoose = require('mongoose');

const bloodInventorySchema = new mongoose.Schema({
    hospitalId: {
        type: Number,
        ref: 'Hospital',
        required: true
    },
    hospitalName: {
        type: String,
        required: true
    },
    bloodType: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    units: {
        type: Number,
        required: true,
        min: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure each hospital has only one entry per blood type
bloodInventorySchema.index({ hospitalId: 1, bloodType: 1 }, { unique: true });

module.exports = mongoose.model('BloodInventory', bloodInventorySchema);