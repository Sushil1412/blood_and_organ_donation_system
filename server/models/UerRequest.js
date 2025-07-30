const mongoose = require('mongoose');

const UserRequestSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['Blood', 'Organ'],
        required: true
    },
    bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', null],
        required: function () { return this.type === 'Blood'; }
    },
    organType: {  // Changed from 'organ' to 'organType' for consistency
        type: String,
        enum: ['Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', null],
        required: function () { return this.type === 'Organ'; }
    },
    additionalInfo: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Unavailable', 'Rejected'],
        default: 'Pending'
    },
    neededBy: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        default: null,
    },
    longitude: {
        type: Number
    },
    latitude: {
        type: Number
    },

    approvalDetails: {
        approvedDate: {
            type: Date,
            required: function () { return this.status === 'Approved'; }
        },
        approvedTime: {
            type: String,
            required: function () { return this.status === 'Approved'; }
        },
        message: {
            type: String,
            trim: true
        },

        hospital: {
            name: {
                type: String,
                required: function () { return this.status === 'Approved'; }
            },
            address: {
                type: String,
                required: function () { return this.status === 'Approved'; }
            },
            contact: {
                type: String,
                required: function () { return this.status === 'Approved'; }
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Add a pre-save hook to update the updatedAt field
UserRequestSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('UserRequest', UserRequestSchema);