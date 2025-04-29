import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Leaf, CheckCircle, AlertTriangle, Calendar, Car as Farm, Truck, Factory, Package, Clock, ChevronDown, ChevronUp, ExternalLink, Lock } from 'lucide-react';
import { getBatchById } from '../../services/batchService';
import { getBatchHistory, verifyBatchAuthenticity } from '../../services/blockchainService';
import { mockFarms } from '../../data/mockData';

const ConsumerVerify: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const [batch, setBatch] = useState<any>(null);
  const [farm, setFarm] = useState<any>(null);
  const [batchHistory, setBatchHistory] = useState<any[]>([]);
  const [authenticity, setAuthenticity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showAllHistory, setShowAllHistory] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!batchId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch batch details
        const batchData = await getBatchById(batchId);
        setBatch(batchData);
        
        // Find farm details
        const farmData = mockFarms.find(f => f.id === batchData.farmId);
        setFarm(farmData);
        
        // Fetch blockchain history
        const history = await getBatchHistory(batchId);
        setBatchHistory(history);
        
        // Verify authenticity
        const authResult = await verifyBatchAuthenticity(batchId);
        setAuthenticity(authResult);
        
        setIsError(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsError(true);
        setErrorMessage('Batch not found or invalid QR code');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [batchId]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-green-500"></div>
          </div>
          <p className="mt-4 text-gray-500">Verifying product authenticity...</p>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-red-500 px-6 py-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-white" />
              <h1 className="ml-3 text-xl font-bold text-white">Verification Failed</h1>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">{errorMessage}</p>
            <p className="text-gray-600 text-sm mb-6">
              The batch ID may be incorrect or the QR code may be invalid. Please try scanning again or contact the manufacturer.
            </p>
            <Link 
              to="/login" 
              className="inline-block px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!batch || !authenticity) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className={`px-6 py-4 ${authenticity.authentic ? 'bg-green-500' : 'bg-red-500'}`}>
            <div className="flex items-center">
              {authenticity.authentic ? (
                <CheckCircle className="h-8 w-8 text-white" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-white" />
              )}
              <h1 className="ml-3 text-xl font-bold text-white">
                {authenticity.authentic ? 'Authentic Product' : 'Verification Failed'}
              </h1>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Batch: {batch.id}</h2>
                <p className="text-gray-600">{batch.variety} Tobacco</p>
              </div>
              
              <div className="mt-2 sm:mt-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(batch.status)}`}>
                  {batch.status}
                </span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center mb-4">
                <Lock size={16} className="text-green-600 mr-2" />
                <p className="text-sm text-gray-600">
                  Verified on blockchain: {new Date(batchHistory[0]?.timestamp).toLocaleString() || 'Unknown'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Current Location</h3>
                  <p className="text-base font-medium text-gray-900">{batch.lastLocation}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
                  <p className="text-base font-medium text-gray-900">
                    {new Date(batch.lastUpdated).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Quantity</h3>
                  <p className="text-base font-medium text-gray-900">{batch.quantity}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Grade</h3>
                  <p className="text-base font-medium text-gray-900">{batch.grade}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Farm Information */}
        {farm && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="px-6 py-4 bg-green-700 text-white">
              <div className="flex items-center">
                <Farm className="h-6 w-6" />
                <h2 className="ml-2 text-lg font-semibold">Farm Information</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                  <Farm className="h-6 w-6 text-green-700" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{farm.name}</h3>
                  <p className="text-sm text-gray-500">{farm.location}</p>
                </div>
              </div>
              
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Owner</h4>
                  <p className="text-base font-medium text-gray-900">{farm.owner}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Established</h4>
                  <p className="text-base font-medium text-gray-900">{farm.established}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Farm Size</h4>
                  <p className="text-base font-medium text-gray-900">{farm.size}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Certifications</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {farm.certifications.map((cert: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Supply Chain Journey */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gray-800 text-white">
            <div className="flex items-center">
              <Truck className="h-6 w-6" />
              <h2 className="ml-2 text-lg font-semibold">Supply Chain Journey</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="relative">
              {/* Timeline */}
              <div className="absolute top-0 bottom-0 left-7 w-px bg-gray-200"></div>
              
              <div className="space-y-8">
                {/* Show first 3 or all items based on toggle */}
                {(showAllHistory ? batchHistory : batchHistory.slice(0, 3)).map((event, index) => (
                  <div key={index} className="relative flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`relative z-10 flex items-center justify-center h-14 w-14 rounded-full ${getTimelineIconBg(event.data?.action || event.action)}`}>
                        {getTimelineIcon(event.data?.action || event.action)}
                      </div>
                    </div>
                    
                    <div className="ml-4 min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {getEventTitle(event.data?.action || event.action, event.data?.newStatus)}
                      </div>
                      
                      <div className="mt-1 text-sm text-gray-500">
                        <p>{new Date(event.timestamp).toLocaleString()}</p>
                        {event.data?.location && (
                          <p className="mt-1">Location: {event.data.location}</p>
                        )}
                        {event.data?.previousStatus && event.data?.newStatus && (
                          <p className="mt-1">
                            Status changed from <span className="font-medium">{event.data.previousStatus}</span> to{' '}
                            <span className="font-medium">{event.data.newStatus}</span>
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
                        <div className="font-mono break-all">Hash: {event.hash}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Show toggle button if there are more than 3 events */}
                {batchHistory.length > 3 && (
                  <button
                    onClick={() => setShowAllHistory(!showAllHistory)}
                    className="relative z-10 flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    {showAllHistory ? (
                      <>
                        <ChevronUp size={16} className="mr-2" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} className="mr-2" />
                        Show Complete Journey ({batchHistory.length} events)
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Leaf className="h-5 w-5 text-green-700" />
            <span className="text-lg font-bold text-gray-900">ChainLeaf</span>
          </div>
          <p className="text-sm text-gray-600">
            Blockchain-based Tobacco Supply Chain Traceability
          </p>
          <div className="mt-4">
            <Link 
              to="/login" 
              className="inline-flex items-center text-green-700 hover:text-green-800 text-sm font-medium"
            >
              <ExternalLink size={16} className="mr-1" />
              Login to ChainLeaf
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get status badge colors
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

// Helper function to get timeline icon background
const getTimelineIconBg = (action: string) => {
  switch (action) {
    case 'create':
      return 'bg-green-100 text-green-600';
    case 'update':
      return 'bg-blue-100 text-blue-600';
    case 'recall':
      return 'bg-red-100 text-red-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

// Helper function to get timeline icon
const getTimelineIcon = (action: string) => {
  switch (action) {
    case 'create':
      return <Leaf size={24} />;
    case 'update':
      return <Truck size={24} />;
    case 'recall':
      return <AlertTriangle size={24} />;
    default:
      return <Clock size={24} />;
  }
};

// Helper function to get event title
const getEventTitle = (action: string, newStatus?: string) => {
  switch (action) {
    case 'create':
      return 'Batch Created';
    case 'update':
      if (newStatus === 'processing') return 'Entered Processing';
      if (newStatus === 'packaging') return 'Entered Packaging';
      if (newStatus === 'distribution') return 'Entered Distribution';
      if (newStatus === 'retail') return 'Reached Retail';
      return `Status Updated to ${newStatus}`;
    case 'recall':
      return 'Product Recalled';
    default:
      return 'Event Recorded';
  }
};

export default ConsumerVerify;