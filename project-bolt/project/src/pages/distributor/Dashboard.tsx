import React, { useState, useEffect } from 'react';
import { BarChart2, ScanLine, TrendingUp, CheckCircle, Truck, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllBatches } from '../../services/batchService';
import { useNavigate } from 'react-router-dom';

const DistributorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [batches, setBatches] = useState<any[]>([]);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const batchData = await getAllBatches();
        
        // Filter batches that are in processing or distribution phases
        const relevantBatches = batchData.filter((batch: any) => 
          ['processing', 'packaging', 'distribution'].includes(batch.status)
        );
        
        setBatches(relevantBatches);
        
        // Mock recent scans data (in a real app, this would come from a database)
        const mockScans = [
          {
            id: 1,
            batchId: 'BATCH-002',
            timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            location: 'Central Processing Facility',
            status: 'processing'
          },
          {
            id: 2,
            batchId: 'BATCH-003',
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            location: 'Regional Distribution Center',
            status: 'distribution'
          }
        ];
        
        setRecentScans(mockScans);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleScanClick = () => {
    navigate('/distributor/scan');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-green-500"></div>
          </div>
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Distributor Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-100 text-green-700">
              <Truck size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Batches in Transit</p>
              <h3 className="text-xl font-bold text-gray-900">
                {batches.filter(batch => batch.status === 'distribution').length}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <CheckCircle size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Processing</p>
              <h3 className="text-xl font-bold text-gray-900">
                {batches.filter(batch => batch.status === 'processing').length}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <Clock size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Recent Scans</p>
              <h3 className="text-xl font-bold text-gray-900">{recentScans.length}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleScanClick}
            className="flex items-center justify-center space-x-2 p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
          >
            <ScanLine size={20} className="text-green-700" />
            <span className="font-medium text-green-700">Scan QR Code</span>
          </button>
          
          <button
            className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <BarChart2 size={20} className="text-blue-700" />
            <span className="font-medium text-blue-700">View Reports</span>
          </button>
        </div>
      </div>
      
      {/* Batches Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Active Batches</h2>
        </div>
        
        {batches.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-gray-500">
            <Truck size={40} className="mb-4 text-gray-300" />
            <p className="text-lg font-medium">No active batches</p>
            <p className="mt-2 text-sm">There are currently no batches in processing or distribution</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variety</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700">{batch.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.variety}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(batch.status)}`}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{batch.lastLocation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate(`/distributor/scan?batch=${batch.id}`)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Recent Scans */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Scans</h2>
        </div>
        
        {recentScans.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-gray-500">
            <ScanLine size={40} className="mb-4 text-gray-300" />
            <p className="text-lg font-medium">No recent scans</p>
            <p className="mt-2 text-sm">You haven't scanned any batches recently</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Update</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700">{scan.batchId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(scan.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scan.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(scan.status)}`}>
                        {scan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get badge colors
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'packaging':
      return 'bg-purple-100 text-purple-800';
    case 'distribution':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default DistributorDashboard;