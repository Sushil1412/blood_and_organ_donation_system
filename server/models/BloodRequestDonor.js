// models/BloodRequestDonor.js
const mongoose = require('mongoose');

const bloodRequestDonorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  needByDate: {
    type: Date,
    required: true
  },
  needByTime: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  status: {
    type: String,
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  address: {
    type: String,
    default: null
  },
  lastDonationDate: {
    type: Date,
    default: null // Will be set when status changes to 'approved'
  }
});

// Middleware to update lastDonationDate when status changes to 'approved'
bloodRequestDonorSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'accepted') {
    this.lastDonationDate = new Date();
  }
  next();
});

module.exports = mongoose.model('BloodRequestDonor', bloodRequestDonorSchema);