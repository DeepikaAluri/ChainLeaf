import React, { useState, useEffect } from 'react';
import { QrCode, Download, Share2, Clipboard, Check, Search, Filter } from 'lucide-react';
import { getAllBatches } from '../../services/batchService';
import { generateQRCode } from '../../services/qrService';
import { mockFarms } from '../../data/mockData';
import { toast } from 'react-toastify';

const AdminQRCodes: React.FC = () => {
  const [batches, setBatches] = useState<any[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [farmFilter, setFarmFilter] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  
  useEffect(() => {
    fetchBatches();
  }, []);
  
  useEffect(() => {
    filterBatches();
  }, [batches, searchTerm, farmFilter]);
  
  const fetchBatches = async () => {
    setIsLoading(true);
    try {
      const data = await getAllBatches();
      
      // Generate verification URLs for each batch
      const batchesWithUrls = await Promise.all(
        data.map(async (batch: any) => {
          const url = await generateQRCode(batch.id);
          return { ...batch, verificationUrl: url };
        })
      );
      
      setBatches(batchesWithUrls);
      setFilteredBatches(batchesWithUrls);
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
        batch.variety.toLowerCase().includes(term)
      );
    }
    
    if (farmFilter) {
      filtered = filtered.filter(batch => batch.farmId === farmFilter);
    }
    
    setFilteredBatches(filtered);
  };
  
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success('URL copied to clipboard');
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedUrl(null);
    }, 2000);
  };
  
  const downloadQRCode = (batchId: string) => {
    // In a real app, this would generate and download a QR code image
    toast.info(`Downloading QR code for batch ${batchId}`);
  };
  
  const shareQRCode = (url: string, batchId: string) => {
    // In a real app, this would open a share dialog
    if (navigator.share) {
      navigator.share({
        title: `ChainLeaf Verification for ${batchId}`,
        text: 'Verify this tobacco product by scanning the QR code',
        url: url
      })
      .then(() => toast.success('Shared successfully'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      toast.info('Sharing not supported on this browser. URL copied to clipboard instead.');
      copyToClipboard(url);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">QR Code Generation</h1>
        <p className="text-gray-600">Create and manage QR codes for your tobacco batches</p>
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
          
          <div className="w-full md:w-64">
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
        </div>
      </div>
      
      {/* QR Codes Grid */}
      {isLoading ? (
        <div className="py-32 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-green-500"></div>
            </div>
            <p className="mt-4 text-gray-500">Loading QR codes...</p>
          </div>
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center text-gray-500">
          <QrCode size={48} className="mb-4 text-green-200" />
          <p className="text-xl font-medium">No batches found</p>
          <p className="mt-2">Try adjusting your filters or create new batches</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => {
            const farm = mockFarms.find(f => f.id === batch.farmId);
            return (
              <div key={batch.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="mb-4 flex justify-center">
                    {/* Here we'd normally render an actual QR code using a library like qrcode.react */}
                    {/* For this demo, we'll use a placeholder */}
                    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <QrCode size={120} className="text-green-700" />
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{batch.id}</h3>
                    <p className="text-sm text-gray-500">{farm?.name || batch.farmId}</p>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Variety:</span>
                      <span className="font-medium text-gray-900">{batch.variety}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-500">Harvest Date:</span>
                      <span className="font-medium text-gray-900">{batch.harvestDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-500">Status:</span>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(batch.status)}`}>
                        {batch.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-5 flex flex-col space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={batch.verificationUrl}
                        readOnly
                        className="w-full pr-10 pl-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <button
                        onClick={() => copyToClipboard(batch.verificationUrl)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center"
                      >
                        {copiedUrl === batch.verificationUrl ? (
                          <Check size={18} className="text-green-500" />
                        ) : (
                          <Clipboard size={18} className="text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => downloadQRCode(batch.id)}
                        className="inline-flex items-center justify-center px-4 py-2 border border-green-500 text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Download size={18} className="mr-2" />
                        Download
                      </button>
                      <button
                        onClick={() => shareQRCode(batch.verificationUrl, batch.id)}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Share2 size={18} className="mr-2" />
                        Share
                      </button>
                    </div>
                    
                    <a
                      href={batch.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Preview Verification Page
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
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

export default AdminQRCodes;