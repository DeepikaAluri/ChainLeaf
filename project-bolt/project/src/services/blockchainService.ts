// This is a mock implementation for blockchain interactions
// In a real application, this would integrate with Ethereum or Hyperledger

interface BlockchainTransaction {
  hash: string;
  timestamp: number;
  data: any;
}

const mockBlockchain: Record<string, BlockchainTransaction[]> = {};

export const recordBatchToBlockchain = async (batchId: string, data: any) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      // Generate a mock transaction hash
      const hash = `0x${Math.random().toString(16).substring(2, 42)}`;
      
      // Store the transaction in our mock blockchain
      if (!mockBlockchain[batchId]) {
        mockBlockchain[batchId] = [];
      }
      
      mockBlockchain[batchId].push({
        hash,
        timestamp: Date.now(),
        data
      });
      
      console.log(`Recorded to blockchain: ${batchId}`, data);
      resolve(hash);
    }, 1000); // Simulate blockchain delay
  });
};

export const getBatchHistory = async (batchId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return the batch history from our mock blockchain
      resolve(mockBlockchain[batchId] || []);
    }, 500);
  });
};

export const verifyBatchAuthenticity = async (batchId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real blockchain implementation, this would verify the integrity of the batch data
      const isAuthentic = !!mockBlockchain[batchId] && mockBlockchain[batchId].length > 0;
      resolve({
        authentic: isAuthentic,
        reason: isAuthentic ? 'Batch verified on blockchain' : 'Batch not found on blockchain'
      });
    }, 800);
  });
};