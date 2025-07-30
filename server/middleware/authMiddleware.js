const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Recipient = require('../models/Recipient');
const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const { jwtSecret } = require('../config');

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, jwtSecret);
            console.log(decoded)

            // Attach user to request object based on role in token
            // This allows you to know which type of user it is and query the correct model
            const { id, role } = decoded;
            let user;
            switch (role) {
                case 'admin':
                    user = await Admin.findById(id).select('-password');
                    break;
                case 'recipient':
                    user = await Recipient.findById(id).select('-password');
                    break;
                case 'donor':
                    user = await Donor.findById(id).select('-password');
                    break;
                case 'hospital':
                    user = await Hospital.findById(id).select('-password');
                    break;
                default:
                    return res.status(401).json({ message: 'Not authorized, invalid role in token' });
            }

            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            req.user = user; // req.user will contain the user document
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Optional: Middleware to authorize based on roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `User role ${req.user ? req.user.role : 'unknown'} is not authorized to access this route` });
        }
        next();
    };
};