const mongoose = require('mongoose');
const OrganRequestSchema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    hospitalEmail: {
        type: String,
        required: true
    },
    hospitalName: {
        type: String,
        required: true
    },
    organType: {
        type: String,
        required: true,
        enum: ['Heart', 'Kidney', 'Liver', 'Lung', 'Pancreas', 'Cornea', 'Skin', 'Bone Marrow']
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    }

}, { timestamps: true });

module.exports = mongoose.model('OrganInventory', OrganRequestSchema);