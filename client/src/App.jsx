import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import {
  ProtectedRoute,
  AdminRoute,
  DonorRoute,
  UserRoute
} from './ProtectedRoute';

import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import About from './pages/About';
import Contact from './pages/Contact';

// User
import RecipientDashboard from './pages/userpages/RecipiantDashboard';
import UserAppointment from './components/Appointment/UserAppointment';
import UserProfile from './components/Profiles/UserProfile';

// Admin
import AdminDashboard from './pages/Admin/AdminDashboard';
import HospitalDetails from './pages/Admin/HospitalDetails';
import BloodDonation from './pages/Admin/BloodDonation';
import OrganDonor from './pages/Admin/OrganDonor';
import BloodPage from './pages/Admin/BloodPage';
import OrganPage from './pages/Admin/OrganPage';
import Inventory from './pages/Admin/Inventory';
import AdminRequestsPage from './pages/Admin/AdminRequestsPage';
import Registration from './pages/Admin/Registration';



// Donor
import Donor from './pages/Donors/Donor';
import DonorAppointment from './pages/Donors/Appointment';
import Donation from './pages/Donors/Donation';
import Pledge from './pages/Donors/pledge';
import MyPledge from './pages/Donors/MyPledge';
import MyRequests from './pages/userpages/MyRequests';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="userprofile" element={<UserProfile />} />

        {/* User Protected Routes */}
        <Route path="/Recipiant-dashboard" element={<UserRoute />}>
          <Route index element={<RecipientDashboard />} />
          <Route path="appointment" element={<UserAppointment />} />

          <Route path="myrequests" element={<MyRequests />} />

        </Route>

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="hospital" element={<HospitalDetails />} />
          <Route path="blood" element={<BloodDonation />} />
          <Route path="organ" element={<OrganDonor />} />
          <Route path="registration" element={<Registration />} />
          <Route path="request" element={<AdminRequestsPage />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="organinventory" element={<OrganPage />} />
          <Route path="bloodinventory" element={<BloodPage />} />
        </Route>

        {/* Hospital Protected Routes */}
        {/* <Route path="/hospital" element={<HospitalRoute />}>
          <Route index element={<Hospital />} />
          <Route path="appointment" element={<Appointment />} />
        </Route> */}

        {/* Donor Protected Routes */}
        <Route path="/donor" element={<DonorRoute />}>
          <Route index element={<Donor />} />
          <Route path="appointments" element={<DonorAppointment />} />
          <Route path="donation" element={<Donation />} />
          <Route path="pledge" element={<Pledge />} />
          <Route path="mypledge" element={<MyPledge />} />

        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
