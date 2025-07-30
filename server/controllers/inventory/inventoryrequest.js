const BloodInventory = require('../../models/BloodInventory');
const OrganInventory = require('../../models/OrganInventory');

exports.bloodsummary = async (req, res) => {
    try {
        const criticalThreshold = 5; // Define what "critical" means
        const criticalTypes = await BloodInventory.countDocuments({ units: { $lt: criticalThreshold } });
        const bloodSummary = await BloodInventory.aggregate([
            { $group: { _id: null, totalUnits: { $sum: "$units" } } }
        ]);
        const totalUnits = bloodSummary[0]?.totalUnits || 0;

        res.json({ criticalTypes, totalUnits });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Get Organ Inventory Summary
exports.organsummary = async (req, res) => {
    try {
        const available = await OrganInventory.aggregate([
            { $group: { _id: null, totalAvailable: { $sum: "$quantity" } } }
        ]);
        const waitlist = await OrganInventory.countDocuments(); // you can refine this

        res.json({
            available: available[0]?.totalAvailable || 0,
            waitlist
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}