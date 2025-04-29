import React, { useState, useEffect } from 'react';
import { BarChart2, Leaf, TrendingUp, AlertTriangle, CheckCircle, Truck, Layers, Factory } from 'lucide-react';
import { getAllBatches } from '../../services/batchService';
import { mockFarms } from '../../data/mockData';

const AdminDashboard: React.FC = () => {
  const [batches, setBatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const batchData = await getAllBatches();
        setBatches(batchData);
      } catch (error) {
        console.error('Error fetching batches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Count batches by status
  const statusCounts = batches.reduce((acc: any, batch) => {
    acc[batch.status] = (acc[batch.status] || 0) + 1;
    return acc;
  }, {});

  // Count batches by farm
  const farmCounts = batches.reduce((acc: any, batch) => {
    acc[batch.farmId] = (acc[batch.farmId] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for charts
  const statusChartData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count
  }));

  const farmChartData = Object.entries(farmCounts).map(([farmId, count]) => {
    const farm = mockFarms.find(f => f.id === farmId);
    return {
      farm: farm ? farm.name : farmId,
      count
    };
  });

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
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor your tobacco supply chain</p>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-100 text-green-700">
              <Leaf size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Batches</p>
              <h3 className="text-xl font-bold text-gray-900">{batches.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <Factory size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Processing</p>
              <h3 className="text-xl font-bold text-gray-900">{statusCounts['processing'] || 0}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <Truck size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Distribution</p>
              <h3 className="text-xl font-bold text-gray-900">{statusCounts['distribution'] || 0}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-red-100 text-red-700">
              <AlertTriangle size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Recalled</p>
              <h3 className="text-xl font-bold text-gray-900">{statusCounts['recalled'] || 0}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Batch Status Overview</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Simple Bar Chart */}
              <div className="space-y-2">
                {statusChartData.map(({ status, count }: any) => (
                  <div key={status} className="flex items-center">
                    <span className="w-24 text-sm capitalize text-gray-600">{status}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${getStatusColor(status)}`} 
                        style={{ width: `${(count / batches.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Batches by Farm</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Simple Bar Chart */}
              <div className="space-y-2">
                {farmChartData.map(({ farm, count }: any) => (
                  <div key={farm} className="flex items-center">
                    <span className="w-24 text-sm truncate text-gray-600">{farm}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${(count / batches.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Batches */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Batches</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variety</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {batches.slice(0, 5).map((batch) => {
                const farm = mockFarms.find(f => f.id === batch.farmId);
                return (
                  <tr key={batch.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700">{batch.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{farm?.name || batch.farmId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{batch.variety}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{batch.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(batch.status)}`}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(batch.lastUpdated).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper function to get status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'harvested':
      return 'bg-green-500';
    case 'processing':
      return 'bg-blue-500';
    case 'distribution':
      return 'bg-amber-500';
    case 'retail':
      return 'bg-purple-500';
    case 'recalled':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

// Helper function to get badge colors
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'harvested':
      return 'bg-green-100 text-green-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'distribution':
      return 'bg-amber-100 text-amber-800';
    case 'retail':
      return 'bg-purple-100 text-purple-800';
    case 'recalled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default AdminDashboard;