import React, { useState } from 'react';
import { Car as Farm, MapPin, Calendar, Ruler, Award, Plus, Search, X } from 'lucide-react';
import { mockFarms } from '../../data/mockData';

const AdminFarms: React.FC = () => {
  const [farms, setFarms] = useState(mockFarms);
  const [filteredFarms, setFilteredFarms] = useState(mockFarms);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New farm form
  const [newFarm, setNewFarm] = useState({
    name: '',
    location: '',
    owner: '',
    certifications: '',
    established: '',
    size: ''
  });
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      setFilteredFarms(farms);
    } else {
      setFilteredFarms(
        farms.filter(
          farm => 
            farm.name.toLowerCase().includes(term) ||
            farm.location.toLowerCase().includes(term) ||
            farm.owner.toLowerCase().includes(term)
        )
      );
    }
  };
  
  const resetSearch = () => {
    setSearchTerm('');
    setFilteredFarms(farms);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFarm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new farm object
    const newFarmObject = {
      id: `FARM-${(farms.length + 1).toString().padStart(3, '0')}`,
      name: newFarm.name,
      location: newFarm.location,
      owner: newFarm.owner,
      certifications: newFarm.certifications.split(',').map(cert => cert.trim()),
      established: newFarm.established,
      size: newFarm.size
    };
    
    // Add to farms list
    const updatedFarms = [...farms, newFarmObject];
    setFarms(updatedFarms);
    setFilteredFarms(updatedFarms);
    
    // Reset form and close modal
    setNewFarm({
      name: '',
      location: '',
      owner: '',
      certifications: '',
      established: '',
      size: ''
    });
    setIsModalOpen(false);
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tobacco Farms</h1>
          <p className="text-gray-600">Manage all tobacco farms in your supply chain</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add New Farm
        </button>
      </div>
      
      {/* Search */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search farms by name, location, or owner..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        {searchTerm && (
          <button
            onClick={resetSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      {/* Farms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFarms.map(farm => (
          <div key={farm.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                  <Farm className="h-6 w-6 text-green-700" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{farm.name}</h3>
                  <p className="text-sm text-gray-500">{farm.id}</p>
                </div>
              </div>
              
              <div className="mt-5 space-y-3">
                <div className="flex items-center text-sm">
                  <MapPin size={16} className="flex-shrink-0 mr-2 text-gray-400" />
                  <span className="text-gray-600">{farm.location}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar size={16} className="flex-shrink-0 mr-2 text-gray-400" />
                  <span className="text-gray-600">Established: {farm.established}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Ruler size={16} className="flex-shrink-0 mr-2 text-gray-400" />
                  <span className="text-gray-600">Size: {farm.size}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {farm.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      <Award size={12} className="mr-1" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-5 pt-5 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                      <div className="h-full w-full flex items-center justify-center text-gray-500 font-medium">
                        {farm.owner.slice(0, 2)}
                      </div>
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Owner</p>
                    <p className="text-sm text-gray-500">{farm.owner}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Create Farm Modal */}
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
                    <Farm className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Farm</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Fill in the details to add a new tobacco farm to your supply chain
                      </p>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Farm Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newFarm.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Green Valley Tobacco"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={newFarm.location}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Kentucky, USA"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="owner" className="block text-sm font-medium text-gray-700">Owner Name</label>
                    <input
                      type="text"
                      id="owner"
                      name="owner"
                      value={newFarm.owner}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="John Smith"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="certifications" className="block text-sm font-medium text-gray-700">Certifications</label>
                    <input
                      type="text"
                      id="certifications"
                      name="certifications"
                      value={newFarm.certifications}
                      onChange={handleInputChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Organic, Fair Trade (comma separated)"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="established" className="block text-sm font-medium text-gray-700">Established Date</label>
                    <input
                      type="date"
                      id="established"
                      name="established"
                      value={newFarm.established}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700">Farm Size</label>
                    <input
                      type="text"
                      id="size"
                      name="size"
                      value={newFarm.size}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="e.g. 250 acres"
                    />
                  </div>
                </form>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add Farm
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
      
      {/* Empty State */}
      {filteredFarms.length === 0 && (
        <div className="py-32 flex flex-col items-center justify-center text-gray-500">
          <Farm size={48} className="mb-4 text-green-200" />
          <p className="text-xl font-medium">No farms found</p>
          <p className="mt-2">Try adjusting your search or add a new farm</p>
        </div>
      )}
    </div>
  );
};

export default AdminFarms;