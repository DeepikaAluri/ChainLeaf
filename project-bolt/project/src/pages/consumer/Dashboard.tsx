import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ScanLine, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const ConsumerDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome, {user?.name}!
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Verification Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <ScanLine className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Product Verification</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Verify the authenticity of tobacco products by scanning their QR codes.
            </p>
            <Link
              to="/verify"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Scan QR Code
            </Link>
          </div>
        </div>

        {/* Recent Verifications Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <History className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Recent Verifications</h2>
            </div>
            <p className="text-gray-600 mb-4">
              View your history of verified products and their authenticity status.
            </p>
            <Link
              to="/history"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard; 