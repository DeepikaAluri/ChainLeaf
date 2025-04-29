import React, { useState, useEffect } from 'react';
import { ScanLine, Camera, X, Check, MapPin, RefreshCw, Truck, Box, QrCode } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { scanQRCode } from '../../services/qrService';
import { getBatchById, updateBatchStatus } from '../../services/batchService';
import { toast } from 'react-toastify';
import { batchStatusOptions } from '../../data/mockData';

const DistributorScan: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const preselectedBatchId = queryParams.get('batch');
  
  const [qrValue, setQrValue] = useState<string>('');
  const [manualInput, setManualInput] = useState<string>(preselectedBatchId || '');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedBatch, setScannedBatch] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [newStatus, setNewStatus] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  
  useEffect(() => {
    // If a batch ID is provided in the URL, automatically load that batch
    if (preselectedBatchId) {
      handleManualLookup();
    }
  }, [preselectedBatchId]);
  
  const startScanning = () => {
    setIsScanning(true);
    
    // In a real app, this would activate the device camera
    // and use a QR code scanning library
    
    // Mock a successful scan after 2 seconds
    setTimeout(() => {
      const mockQrUrl = `${window.location.origin}/verify/BATCH-002`;
      setQrValue(mockQrUrl);
      handleScanComplete(mockQrUrl);
    }, 2000);
  };
  
  const cancelScan = () => {
    setIsScanning(false);
    setQrValue('');
  };
  
  const handleScanComplete = async (scannedValue: string) => {
    setIsScanning(false);
    setIsLoading(true);
    
    try {
      // Process the scanned QR code
      const scanResult = await scanQRCode(scannedValue);
      
      if (scanResult.success && scanResult.batchId) {
        // Fetch batch details
        const batchData = await getBatchById(scanResult.batchId);
        setScannedBatch(batchData);
        
        // Pre-fill the form with current values
        setCurrentLocation(batchData.lastLocation || '');
        setNewStatus(batchData.status);
        
        toast.success(`Successfully scanned batch: ${scanResult.batchId}`);
      } else {
        toast.error('Invalid QR code');
        setScannedBatch(null);
      }
    } catch (error) {
      console.error('Error processing scan:', error);
      toast.error('Failed to process QR code');
      setScannedBatch(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleManualLookup = async () => {
    if (!manualInput) {
      toast.error('Please enter a batch ID');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Fetch batch details
      const batchData = await getBatchById(manualInput);
      setScannedBatch(batchData);
      
      // Pre-fill the form with current values
      setCurrentLocation(batchData.lastLocation || '');
      setNewStatus(batchData.status);
      
      toast.success(`Found batch: ${manualInput}`);
    } catch (error) {
      console.error('Error looking up batch:', error);
      toast.error('Batch not found');
      setScannedBatch(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scannedBatch) return;
    
    if (!currentLocation) {
      toast.error('Please enter the current location');
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const result = await updateBatchStatus(scannedBatch.id, newStatus, currentLocation);
      
      toast.success(`Batch ${result.id} updated successfully to ${newStatus}`);
      
      // Update the local state with the new data
      setScannedBatch(result);
      
      // Reset the form after a successful update
      setTimeout(() => {
        navigate('/distributor');
      }, 2000);
    } catch (error) {
      console.error('Error updating batch:', error);
      toast.error('Failed to update batch');
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Scan QR Code</h1>
        <p className="text-gray-600">Scan a batch QR code to update its status in the blockchain</p>
      </div>
      
      {/* Scanning Interface */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Scan or Enter Batch ID</h2>
          <p className="text-sm text-gray-500">Use the camera to scan a QR code or manually enter a batch ID</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR Scanner */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            {isScanning ? (
              <div className="relative">
                <div className="aspect-video bg-black flex items-center justify-center">
                  <div className="animate-pulse flex flex-col items-center text-white">
                    <Camera size={48} className="mb-2" />
                    <p>Scanning...</p>
                  </div>
                </div>
                
                {/* Scan animation overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-green-500 rounded-lg relative">
                    <div className="absolute top-0 left-0 right-0 h-px bg-green-500 animate-[scanline_2s_ease-in-out_infinite]"></div>
                  </div>
                </div>
                
                <button
                  onClick={cancelScan}
                  className="absolute top-3 right-3 bg-white/80 rounded-full p-1 text-gray-700 hover:bg-white"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div 
                onClick={startScanning}
                className="aspect-video bg-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <QrCode size={48} className="text-gray-400 mb-3" />
                <p className="font-medium text-gray-600">Click to Scan QR Code</p>
              </div>
            )}
            
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={startScanning}
                disabled={isScanning}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <ScanLine size={18} className="mr-2" />
                {isScanning ? 'Scanning...' : 'Start Scanning'}
              </button>
            </div>
          </div>
          
          {/* Manual Input */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <div className="mb-4">
              <label htmlFor="batchId" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Batch ID Manually
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="batchId"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="e.g. BATCH-001"
                  className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
                <button
                  onClick={handleManualLookup}
                  disabled={isLoading || !manualInput}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isLoading ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    'Look Up'
                  )}
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Recently Scanned:</p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setManualInput('BATCH-002');
                    handleManualLookup();
                  }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200"
                >
                  BATCH-002
                </button>
                <button
                  onClick={() => {
                    setManualInput('BATCH-003');
                    handleManualLookup();
                  }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 ml-2"
                >
                  BATCH-003
                </button>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              You can manually enter a batch ID if you can't scan the QR code. The batch ID is typically in the format BATCH-XXX.
            </p>
          </div>
        </div>
      </div>
      
      {/* Batch Details and Update Form */}
      {isLoading ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center py-16">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-green-500"></div>
            </div>
            <p className="mt-4 text-gray-500">Loading batch details...</p>
          </div>
        </div>
      ) : scannedBatch ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
            <div className="flex items-center">
              <Check size={24} className="text-green-600 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Batch Found</h2>
                <p className="text-sm text-gray-600">Update the status and location for this batch</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Batch Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Batch Information</h3>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Batch ID:</span>
                    <span className="text-sm font-medium text-gray-900">{scannedBatch.id}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Farm ID:</span>
                    <span className="text-sm font-medium text-gray-900">{scannedBatch.farmId}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Variety:</span>
                    <span className="text-sm font-medium text-gray-900">{scannedBatch.variety}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Quantity:</span>
                    <span className="text-sm font-medium text-gray-900">{scannedBatch.quantity}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Grade:</span>
                    <span className="text-sm font-medium text-gray-900">{scannedBatch.grade}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Current Status:</span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(scannedBatch.status)}`}>
                      {scannedBatch.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Last Updated:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(scannedBatch.lastUpdated).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Last Location:</span>
                    <span className="text-sm font-medium text-gray-900">{scannedBatch.lastLocation}</span>
                  </div>
                </div>
              </div>
              
              {/* Update Form */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Update Batch Status</h3>
                
                <form onSubmit={handleUpdateBatch} className="space-y-4">
                  <div>
                    <label htmlFor="currentLocation" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Location
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="currentLocation"
                        value={currentLocation}
                        onChange={(e) => setCurrentLocation(e.target.value)}
                        required
                        className="pl-10 block w-full rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="e.g. Central Processing Facility"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700 mb-1">
                      New Status
                    </label>
                    <select
                      id="newStatus"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      required
                      className="block w-full rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      {batchStatusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex items-center mb-4">
                      <div className={`p-1 rounded-full ${getStatusIconColor(newStatus)}`}>
                        {getStatusIcon(newStatus)}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {getStatusDescription(newStatus)}
                      </span>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="w-full inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      {isUpdating ? (
                        <>
                          <RefreshCw size={16} className="mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          Update Batch Status
                        </>
                      )}
                    </button>
                    
                    <p className="mt-2 text-xs text-gray-500 text-center">
                      This action will update the batch status on the blockchain and is irreversible.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}
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

// Helper function to get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'harvested':
      return <Leaf size={18} className="text-green-500" />;
    case 'curing':
      return <Leaf size={18} className="text-indigo-500" />;
    case 'processing':
      return <RefreshCw size={18} className="text-blue-500" />;
    case 'packaging':
      return <Box size={18} className="text-purple-500" />;
    case 'distribution':
      return <Truck size={18} className="text-amber-500" />;
    case 'retail':
      return <Check size={18} className="text-gray-500" />;
    case 'recalled':
      return <X size={18} className="text-red-500" />;
    default:
      return <Leaf size={18} className="text-gray-500" />;
  }
};

// Helper function to get status icon background color
const getStatusIconColor = (status: string) => {
  switch (status) {
    case 'harvested':
      return 'bg-green-100';
    case 'curing':
      return 'bg-indigo-100';
    case 'processing':
      return 'bg-blue-100';
    case 'packaging':
      return 'bg-purple-100';
    case 'distribution':
      return 'bg-amber-100';
    case 'retail':
      return 'bg-gray-100';
    case 'recalled':
      return 'bg-red-100';
    default:
      return 'bg-gray-100';
  }
};

// Helper function to get status description
const getStatusDescription = (status: string) => {
  switch (status) {
    case 'harvested':
      return 'Product has been harvested from the farm';
    case 'curing':
      return 'Tobacco is in the curing process';
    case 'processing':
      return 'Product is being processed';
    case 'packaging':
      return 'Product is being packaged';
    case 'distribution':
      return 'Product is in distribution';
    case 'retail':
      return 'Product has reached retail';
    case 'recalled':
      return 'Product has been recalled';
    default:
      return 'Unknown status';
  }
};

export default DistributorScan;