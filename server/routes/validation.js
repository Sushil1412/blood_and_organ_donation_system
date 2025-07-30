const Joi = require('joi');

const validateSignup = (req, res, next) => {
    // Common fields for both donor and recipient
    const commonSchema = {
        name: Joi.string().min(3).max(50).required()
            .messages({
                'string.empty': 'Name is required',
                'string.min': 'Name should be at least 3 characters long',
                'string.max': 'Name should not exceed 50 characters'
            }),
        email: Joi.string().email({ tlds: { allow: false } }).required()
            .messages({
                'string.empty': 'Email is required',
                'string.email': 'Please enter a valid email address'
            }),
        password: Joi.string().min(8)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
            .required()
            .messages({
                'string.pattern.base': 'Password must contain at least one uppercase, one lowercase, one number and one special character',
                'string.min': 'Password must be at least 8 characters long'
            }),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
            .messages({
                'any.only': 'Passwords do not match'
            }),
        role: Joi.string().valid('recipient', 'donor').required()
            .messages({
                'any.only': 'Please select either recipient or donor'
            }),
        address: Joi.string().min(3).required()
            .messages({
                'string.empty': 'Address is required',
                'string.min': 'Address should be at least 10 characters long'
            }),
        location: Joi.object({
            type: Joi.string().valid('Point').required(),
            coordinates: Joi.array().items(Joi.number()).length(2).required()
        }).required()
            .messages({
                'object.base': 'Location is required',
                'any.required': 'Location is required'
            })
    };

    // Donor-specific fields
    const donorSchema = {
        bloodGroup: Joi.string().valid(
            'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
        ).required()
            .messages({
                'any.only': 'Please select a valid blood group',
                'string.empty': 'Blood group is required'
            }),
        aadhar: Joi.string().length(12).pattern(/^[0-9]+$/).required()
            .messages({
                'string.length': 'Aadhar must be exactly 12 digits',
                'string.pattern.base': 'Aadhar must contain only numbers',
                'string.empty': 'Aadhar is required'
            })
    };

    // Recipient-specific fields (none in this case, but structure is here for future additions)
    const recipientSchema = {
        // Currently no additional required fields for recipient
        // Add any recipient-specific fields here if needed
    };

    // Create the base schema
    let schema = Joi.object(commonSchema).with('password', 'confirmPassword');

    // Add role-specific fields
    if (req.body.role === 'donor') {
        schema = schema.append(donorSchema);
    } else if (req.body.role === 'recipient') {
        schema = schema.append(recipientSchema);
    }

    const { error } = schema.validate(req.body, {
        abortEarly: false,
        allowUnknown: false
    });

    if (error) {
        const errors = error.details.reduce((acc, curr) => {
            // Remove array indexes from path (e.g., 'location.coordinates.0' -> 'location.coordinates')
            const path = curr.path.join('.').replace(/\.\d+$/, '');
            acc[path] = curr.message.replace(/"/g, '');
            return acc;
        }, {});
        return res.status(400).json({ errors });
    }

    next();
};

module.exports = { validateSignup };