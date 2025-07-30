const express = require('express');
const {
  signup,
  login,
  userrequest,
  getUserRequests
} = require('../controllers/authController');

const {
  adminrequest,
  adminupdate,
  adminapplication,
  adminapplicationupdate,
  adminhistory,
  hospitalinventory,
  inventoryupdate,
  adminhospitalrequests,
  hospitalrequest,
  updateHospitalRequest,
  organinventory,
  organinventoryupdate,
  hospitalorganrequests,
  hospitalrequestsubmit
} = require('../controllers/request/adminrequest');

const {
  pledges,
  mypledge,
  bloodRequestDonor,
  bloodrequestfordonor,
  upadateBloodrequestdonor,
  hospitalmypledge,
  bloodrequestforadmin,
  updatedonorstatus,
  mypledgetype
} = require('../controllers/Donor/request');

const {
  requestapprove,
  updateuserprofile,
  getuser
} = require('../controllers/request/requestapprove');

const {
  bloodsummary,
  organsummary
} = require('../controllers/inventory/inventoryrequest');

const {
  findDonors,
  sendDonorRequest
} = require('../controllers/request/matchingdonor');

const { validateSignup } = require('./validation');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// -------------------- Public Routes --------------------
router.post('/signup', validateSignup, signup);
router.post('/login', login);

// -------------------- User Routes (Recipient) --------------------
router.post('/userrequest', protect, authorize('recipient'), userrequest);
router.get('/userrequest/:id', protect, authorize('recipient'), getUserRequests);
router.put('/updateuserprofile', protect, updateuserprofile);
router.get('/getuser', protect, getuser);

// -------------------- Admin Routes --------------------
router.get('/adminrequests', protect, authorize('hospital'), adminrequest);
router.patch('/adminrequests/:type/:id/status', protect, authorize('hospital'), adminupdate);
router.get('/adminhospitalrequests', protect, authorize('hospital'), adminhospitalrequests);
router.get('/adminapplication', protect, authorize('hospital'), adminapplication);
router.patch('/adminapplicationupdate', protect, authorize('hospital'), adminapplicationupdate);
router.get('/adminhistory', protect, authorize('hospital'), adminhistory);
router.get('/bloodrequestforadmin', protect, authorize('hospital'), bloodrequestforadmin);
router.patch('/requestapprove/:id', protect, authorize('hospital'), requestapprove);
router.get('/bloodsummary', protect, authorize('hospital'), bloodsummary);
router.get('/organsummary', protect, authorize('hospital'), organsummary);

// -------------------- Hospital Routes --------------------
router.get('/hospitalinventory', protect, authorize('hospital'), hospitalinventory);
router.post('/inventoryupdate', protect, authorize('hospital'), inventoryupdate);
router.post('/organinventoryupdate', protect, authorize('hospital'), organinventoryupdate);
router.get('/organinventory', protect, authorize('hospital'), organinventory);
router.patch('/updateHospitalRequest', protect, authorize('hospital'), updateHospitalRequest);
router.post('/hospitalrequest', protect, authorize('hospital'), hospitalrequest);
router.get('/hospitalorganrequests', protect, authorize('hospital'), hospitalorganrequests);
router.patch('/hospitalrequestsubmit', protect, authorize('hospital'), hospitalrequestsubmit);
router.get('/hospitalmypledge', protect, authorize('hospital'), hospitalmypledge);
router.patch('/updatedonorstatus/:donorId', protect, authorize('hospital'), updatedonorstatus);

// -------------------- Donor Routes --------------------
router.post('/pledges', protect, authorize('donor'), pledges);
router.get('/mypledge', protect, authorize('donor'), mypledge);
router.post('/bloodRequestDonor', protect, authorize('donor'), bloodRequestDonor);
router.get('/bloodrequestfordonor', protect, authorize('donor'), bloodrequestfordonor);
router.patch('/upadateBloodrequestdonor', protect, authorize('donor'), upadateBloodrequestdonor);
router.get('/mypledgetype', protect, authorize('donor'), mypledgetype);

// -------------------- Matching Donors (Any authenticated) --------------------
router.post('/findDonors', protect, findDonors);
router.post('/sendDonorRequest/:email', protect, sendDonorRequest);

module.exports = router;
