const jwt = require('jsonwebtoken');
const Recipient = require('../models/Recipient');
const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const Admin = require('../models/Admin');
const { jwtSecret } = require('../config');
const UserRequest = require('../models/UerRequest');
// Utility to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, jwtSecret, {
    expiresIn: '24h', // Token expiry
  });
};

// @desc    Register a new user (recipient, donor, hospital)
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  const { name, email, password, role, bloodGroup, aadhar, address, location } = req.body;

  if (!role) {
    return res.status(400).json({ message: 'Role is required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  try {
    let user;
    let existingUser;

    switch (role.toLowerCase()) {
      case 'recipient':
        if (!name || !email || !password || !address || !location) {
          return res.status(400).json({ message: 'Please provide all required fields for recipient: name, email, password, address, location' });
        }

        existingUser = await Recipient.findOne({ $or: [{ email }] });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already exists' });
        }
        console.log(email);
        user = await Recipient.create({
          name,
          email,
          password,
          role,
          address,
          location: {
            type: 'Point',
            coordinates: location.coordinates
          }
        });
        break;

      case 'donor':
        if (!name || !email || !password || !bloodGroup || !aadhar || !address || !location) {
          return res.status(400).json({ message: 'Please provide all required fields for donor: name, email, password, bloodGroup, aadhar, address, location' });
        }
        existingUser = await Donor.findOne({ $or: [{ email }, { aadhar }] });
        if (existingUser) {
          const field = existingUser.email === email ? 'Email' : 'Aadhar';
          return res.status(400).json({ message: `${field} already exists` });
        }
        user = await Donor.create({
          name,
          email,
          password,
          role,
          bloodGroup,
          aadhar,
          address,
          location: {
            type: 'Point',
            coordinates: location.coordinates
          }
        });
        break;

      default:
        return res.status(400).json({ message: 'Invalid role specified' });
    }

    if (user) {
      res.status(201).json({
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
        userId: user._id,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Signup Error:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.` });
    }
    res.status(500).json({ message: 'Server error during signup', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password, portal } = req.body;

  if (!email || !password || !portal) {
    return res.status(400).json({ message: 'Please provide email, password, and portal type' });
  }

  try {
    let user;
    let UserModel;
    console.log(portal);

    switch (portal.toLowerCase()) {
      // case 'admin':
      //   UserModel = Admin;
      //   break;
      case 'recipient':
        UserModel = Recipient;
        break;
      case 'donor':
        UserModel = Donor;
        break;
      case 'hospital':
        UserModel = Hospital;
        break;
      default:
        return res.status(400).json({ message: 'Invalid portal type' });
    }

    user = await UserModel.findOne({ email });



    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    // Add null check for password comparison
    if (portal == 'hospital') {

      if (user.password != password) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      res.json({
        _id: user._id,
        name: user.name || '',
        email: user.email,
        // bloodGroup: user.bloodGroup || '',
        // aadhar: user.aadhar || '',
        // address: user.address || '',
        mobile: user.mobile || '',
        status: user.status || 'approved',
        // longitude: user.location.coordinates[1] || 12,
        // latitude: user.location.coordinates[0] || 12,
        role: portal.toLowerCase(),
        token: generateToken(user._id, user.role),
      });

    } else {

      if (!password || !user.password) {
        return res.status(401).json({ message: 'Invalid  password' });
      }

      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid  password' });
      }


      // if(portal == 'donor'){
      //   res.json({
      //     _id: user._id,
      //     name: user.name || '',
      //     email: user.email,
      //     status: 'approved',
      //     role: portal.toLowerCase(),
      //     token: generateToken(user._id, user.role),
      //   });
      // }
      // console.log("this name is", user.name);

      res.json({
        _id: user._id,
        name: user.name || '',
        email: user.email,
        bloodGroup: user.bloodGroup || '',
        aadhar: user.aadhar || '',
        address: user.address || '',
        mobile: user.mobile || '',
        status: user.status || 'approved',
        longitude: user.location.coordinates[1] || 12,
        latitude: user.location.coordinates[0] || 12,
        role: portal.toLowerCase(),
        token: generateToken(user._id, user.role),
      });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      message: 'Server error during login',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
exports.userrequest = async (req, res) => {
  const { name, neededBy, type, bloodType, organ, additionalInfo, email, address, longitude, latitude } = req.body;

  // console.log('Request body:', req.body); // Log incoming request

  try {
    // Validate required fields
    if (!type) {
      return res.status(400).json({ error: 'Type is required (Blood/Organ)' });
    }
    if (type === 'Blood' && !bloodType) {
      return res.status(400).json({ error: 'Blood type is required for blood requests' });
    }
    if (type === 'Organ' && !organ) {
      return res.status(400).json({ error: 'Organ type is required for organ requests' });
    }
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!neededBy) {
      return res.status(400).json({ error: 'neededBy is required' });
    }

    const newRequest = new UserRequest({

      email,
      name,
      type,
      bloodType: type === 'Blood' ? bloodType : undefined,
      organType: type === 'Organ' ? organ : undefined,
      additionalInfo,
      status: 'Pending',
      longitude: longitude,
      latitude: latitude,
      neededBy,
      address,
      createdAt: new Date()
    });

    console.log('Saving request:', newRequest); // Log before save

    const savedRequest = await newRequest.save();
    console.log('Saved successfully:', savedRequest); // Log after save

    res.status(201).json(savedRequest);
  } catch (err) {
    console.error('Full error:', err); // Log complete error
    res.status(500).json({
      error: 'Failed to create request',
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

//to get fetch adta from userrequest table 


exports.getUserRequests = async (req, res) => {
  try {
    const email = req.params.id;
    const requests = await UserRequest.find({ email });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user requests' });
  }
};
