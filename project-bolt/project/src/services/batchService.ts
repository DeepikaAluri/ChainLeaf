import { mockBatches } from '../data/mockData';
import { recordBatchToBlockchain } from './blockchainService';

// Get all batches (for admin)
export const getAllBatches = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBatches);
    }, 500);
  });
};

// Get batch by ID
export const getBatchById = async (id: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const batch = mockBatches.find(batch => batch.id === id);
      if (batch) {
        resolve(batch);
      } else {
        reject(new Error('Batch not found'));
      }
    }, 300);
  });
};

// Create a new batch
export const createBatch = async (batchData: any) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      // Create a new batch with a unique ID
      const newBatch = {
        id: `BATCH-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'created',
        ...batchData
      };
      
      // In a real app, we would save this to a database
      console.log('Created new batch:', newBatch);
      
      // Record the batch creation to the blockchain
      await recordBatchToBlockchain(newBatch.id, {
        action: 'create',
        timestamp: new Date().toISOString(),
        data: newBatch
      });
      
      resolve(newBatch);
    }, 800);
  });
};

// Update batch status
export const updateBatchStatus = async (id: string, newStatus: string, location: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const batch = mockBatches.find(batch => batch.id === id);
      
      if (!batch) {
        reject(new Error('Batch not found'));
        return;
      }
      
      // Update the batch status
      const updatedBatch = {
        ...batch,
        status: newStatus,
        lastUpdated: new Date().toISOString(),
        lastLocation: location
      };
      
      console.log('Updated batch:', updatedBatch);
      
      // Record the status update to the blockchain
      await recordBatchToBlockchain(id, {
        action: 'update',
        timestamp: new Date().toISOString(),
        previousStatus: batch.status,
        newStatus,
        location
      });
      
      resolve(updatedBatch);
    }, 600);
  });
};