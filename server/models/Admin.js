const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: { // This will store the hashed "secret key"
        type: String,
        required: true,
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

// Note: You will manually add admin records or create a script to add them with hashed passwords.
// If you add a plain text password manually, this pre-save hook won't run automatically on updates unless password field is modified.
// It's best to hash the password before inserting it manually.
// Example script to add an admin (run this once, separately):
/*
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./Admin'); // Adjust path if needed
const { mongoURI } = require('../config'); // Adjust path

const addAdmin = async () => {
  await mongoose.connect(mongoURI);

  const email = 'admin@lifeshare.org'; // Your admin email
  const plainPassword = 'yourSecureAdminSecretKey'; // Your admin secret key

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    console.log('Admin already exists.');
    mongoose.disconnect();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);

  await Admin.create({ email, password: hashedPassword, role: 'admin' });
  console.log('Admin user created successfully!');
  mongoose.disconnect();
};

// addAdmin().catch(console.error); // Uncomment to run
*/


// Method to compare password
AdminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema, 'admintable');