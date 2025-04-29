import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminBatches from './pages/admin/Batches';
import AdminQRCodes from './pages/admin/QRCodes';
import AdminFarms from './pages/admin/Farms';
import DistributorDashboard from './pages/distributor/Dashboard';
import ConsumerDashboard from './pages/consumer/Dashboard';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';

// Components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            {/* Profile Route - accessible by all roles */}
            <Route path="/profile" element={<Profile />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/batches" element={<AdminBatches />} />
            <Route path="/admin/qr-codes" element={<AdminQRCodes />} />
            <Route path="/admin/farms" element={<AdminFarms />} />

            {/* Other Role Routes */}
            <Route path="/distributor" element={<DistributorDashboard />} />
            <Route path="/consumer" element={<ConsumerDashboard />} />
          </Route>

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;