import React, { useState, useEffect } from 'react';
import { 
  Leaf, Plus, Filter, Search, ExternalLink, 
  ChevronDown, X, RefreshCw, AlertTriangle
} from 'lucide-react';
import { getAllBatches, createBatch, updateBatchStatus } from '../../services/batchService';
import { mockFarms, batchStatusOptions } from '../../data/mockData';
import { toast } from 'react-toastify';

const AdminBatches: React.FC = () => {
  const [batches, setBatches] = useState<any[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [farmFilter, setFarmFilter] = useState<string>('');
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  
  // New batch form
  const [newBatch, setNewBatch] = useState({
    farmId: '',
    harvestDate: '',
    variety: '',
    quantity: '',
    grade: 'Standard'
  });
  
  // Update batch form
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateLocation, setUpdateLocation] = useState('');
  
  useEffect(() => {
    fetchBatches();
  }, []);
  
  useEffect(() => {
    filterBatches();
  }, [batches, searchTerm, statusFilter, farmFilter]);
  
  const fetchBatches = async () => {
    setIsLoading(true);
    try {
      const data = await getAllBatches();
      setBatches(data);
      setFilteredBatches(data);
    } catch (error) {
      console.error('Error fetching batches:', error);
      toast.error('Failed to fetch batches');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filterBatches = () => {
    let filtered = [...batches];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(batch => 
        batch.id.toLowerCase().includes(term) || 
        batch.variety.toLowerCase().includes(term) ||
        batch.grade.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(batch => batch.status === statusFilter);
    }
    
    if (farmFilter) {
      filtered = filtered.filter(batch => batch.farmId === farmFilter);
    }
    
    setFilteredBatches(filtered);
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setFarmFilter('');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBatch(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const result = await createBatch(newBatch);
      
      setBatches(prev => [result, ...prev]);
      toast.success('Batch created successfully');
      
      // Reset form and close modal
      setNewBatch({
        farmId: '',
        harvestDate: '',
        variety: '',
        quantity: '',
        grade: 'Standard'
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating batch:', error);
      toast.error('Failed to create batch');
    } finally {
      setIsLoading(false);
    }
  };
  
  const openUpdateModal = (batch: any) => {
    setSelectedBatch(batch);
    setUpdateStatus(batch.status);
    setUpdateLocation(batch.lastLocation || '');
    setIsUpdateModalOpen(true);
  };
  
  const handleUpdateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBatch) return;
    
    try {
      setIsLoading(true);
      const result = await updateBatchStatus(selectedBatch.id, updateStatus, updateLocation);
      
      // Update batches list
      setBatches(prev => 
        prev.map(batch => batch.id === selectedBatch.id ? result : batch)
      );
      
      toast.success('Batch status updated successfully');
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error('Error updating batch:', error);
      toast.error('Failed to update batch status');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Batches</h1>
          <p className="text-gray-600">Track and manage tobacco batches throughout the supply chain</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add New Batch
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search batches..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Statuses</option>
              {batchStatusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-48">
            <select
              value={farmFilter}
              onChange={(e) => setFarmFilter(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Farms</option>
              {mockFarms.map(farm => (
                <option key={farm.id} value={farm.id}>{farm.name}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={resetFilters}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <X size={16} className="mr-2" />
            Clear
          </button>
          
          <button
            onClick={fetchBatches}
            className="inline-flex items-center px-3 py-2 border border-green-500 rounded-lg text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Batches Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading && filteredBatches.length === 0 ? (
          <div className="py-32 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-green-500"></div>
              </div>
              <p className="mt-4 text-gray-500">Loading batches...</p>
            </div>
          </div>
        ) : filteredBatches.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-gray-500">
            <Leaf size={48} className="mb-4 text-green-200" />
            <p className="text-xl font-medium">No batches found</p>
            <p className="mt-2">Try adjusting your filters or create a new batch</p>
          </div>
        ) : (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBatches.map((batch) => {
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openUpdateModal(batch)}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Update Status
                        </button>
                        <a
                          href={`/verify/${batch.id}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        >
                          View <ExternalLink size={14} className="ml-1" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Create Batch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Batch</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Fill in the details to create a new tobacco batch
                      </p>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="farmId" className="block text-sm font-medium text-gray-700">Farm</label>
                    <select
                      id="farmId"
                      name="farmId"
                      value={newBatch.farmId}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      <option value="">Select a farm</option>
                      {mockFarms.map(farm => (
                        <option key={farm.id} value={farm.id}>{farm.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="harvestDate" className="block text-sm font-medium text-gray-700">Harvest Date</label>
                    <input
                      type="date"
                      id="harvestDate"
                      name="harvestDate"
                      value={newBatch.harvestDate}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="variety" className="block text-sm font-medium text-gray-700">Tobacco Variety</label>
                    <input
                      type="text"
                      id="variety"
                      name="variety"
                      value={newBatch.variety}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="e.g. Virginia Gold, Burley"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="text"
                      id="quantity"
                      name="quantity"
                      value={newBatch.quantity}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="e.g. 5000 kg"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grade</label>
                    <select
                      id="grade"
                      name="grade"
                      value={newBatch.grade}
                      onChange={handleInputChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      <option value="Premium">Premium</option>
                      <option value="Standard">Standard</option>
                      <option value="Economy">Economy</option>
                    </select>
                  </div>
                </form>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {isLoading ? 'Creating...' : 'Create Batch'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Update Batch Modal */}
      {isUpdateModalOpen && selectedBatch && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <RefreshCw className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Update Batch Status</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Update the status for batch: <span className="font-medium">{selectedBatch.id}</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleUpdateBatch} className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="updateStatus" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      id="updateStatus"
                      name="updateStatus"
                      value={updateStatus}
                      onChange={(e) => setUpdateStatus(e.target.value)}
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      {batchStatusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="updateLocation" className="block text-sm font-medium text-gray-700">Current Location</label>
                    <input
                      type="text"
                      id="updateLocation"
                      name="updateLocation"
                      value={updateLocation}
                      onChange={(e) => setUpdateLocation(e.target.value)}
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="e.g. Processing Facility, Distribution Center"
                    />
                  </div>
                  
                  {updateStatus === 'recalled' && (
                    <div className="bg-red-50 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Warning</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>
                              Setting a batch as recalled will trigger notifications to all relevant stakeholders in the supply chain. This action cannot be undone.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  onClick={handleUpdateBatch}
                  disabled={isLoading}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    updateStatus === 'recalled' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  {isLoading ? 'Updating...' : 'Update Status'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get badge colors
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'harvested':
      return 'bg-green-100 text-green-800';
    case 'curing':
      return 'bg-indigo-100 text-indigo-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'packaging':
      return 'bg-purple-100 text-purple-800';
    case 'distribution':
      return 'bg-amber-100 text-amber-800';
    case 'retail':
      return 'bg-gray-100 text-gray-800';
    case 'recalled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default AdminBatches;