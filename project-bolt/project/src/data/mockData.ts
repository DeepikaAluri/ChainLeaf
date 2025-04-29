// Mock users for authentication
export const mockUsers = [
  {
    id: '1',
    email: 'admin@chainleaf.com',
    password: '1234',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: '2',
    email: 'distributor@chainleaf.com',
    password: '1234',
    role: 'distributor',
    name: 'Distributor User'
  },
  {
    id: '3',
    email: 'consumer@chainleaf.com',
    password: '1234',
    role: 'consumer',
    name: 'Consumer User'
  }
];

// Mock farms
export const mockFarms = [
  {
    id: 'FARM-001',
    name: 'Green Valley Tobacco',
    location: 'Kentucky, USA',
    owner: 'John Smith',
    certifications: ['Organic', 'Fair Trade'],
    established: '2005-03-15',
    size: '250 acres'
  },
  {
    id: 'FARM-002',
    name: 'Golden Leaf Plantation',
    location: 'North Carolina, USA',
    owner: 'Maria Rodriguez',
    certifications: ['GAP Certified'],
    established: '1998-06-22',
    size: '380 acres'
  },
  {
    id: 'FARM-003',
    name: 'Sunrise Tobacco Co.',
    location: 'Virginia, USA',
    owner: 'David Chen',
    certifications: ['Sustainable Agriculture', 'Rainforest Alliance'],
    established: '2010-09-10',
    size: '175 acres'
  }
];

// Mock batches
export const mockBatches = [
  {
    id: 'BATCH-001',
    farmId: 'FARM-001',
    harvestDate: '2023-08-15',
    variety: 'Virginia Gold',
    quantity: '5000 kg',
    grade: 'Premium',
    status: 'harvested',
    createdAt: '2023-08-16T09:30:00Z',
    lastUpdated: '2023-08-16T09:30:00Z',
    lastLocation: 'Green Valley Tobacco Farm'
  },
  {
    id: 'BATCH-002',
    farmId: 'FARM-001',
    harvestDate: '2023-09-01',
    variety: 'Burley',
    quantity: '3800 kg',
    grade: 'Standard',
    status: 'processing',
    createdAt: '2023-09-02T10:15:00Z',
    lastUpdated: '2023-10-05T14:20:00Z',
    lastLocation: 'Central Processing Facility'
  },
  {
    id: 'BATCH-003',
    farmId: 'FARM-002',
    harvestDate: '2023-08-25',
    variety: 'Oriental',
    quantity: '2200 kg',
    grade: 'Premium',
    status: 'distribution',
    createdAt: '2023-08-26T08:45:00Z',
    lastUpdated: '2023-11-10T11:30:00Z',
    lastLocation: 'Regional Distribution Center'
  },
  {
    id: 'BATCH-004',
    farmId: 'FARM-003',
    harvestDate: '2023-09-10',
    variety: 'Kentucky',
    quantity: '4100 kg',
    grade: 'Standard',
    status: 'retail',
    createdAt: '2023-09-11T15:20:00Z',
    lastUpdated: '2023-12-01T09:10:00Z',
    lastLocation: 'Retail Distribution'
  }
];

// Batch status options
export const batchStatusOptions = [
  { value: 'harvested', label: 'Harvested' },
  { value: 'curing', label: 'Curing' },
  { value: 'processing', label: 'Processing' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'distribution', label: 'Distribution' },
  { value: 'retail', label: 'Retail' },
  { value: 'recalled', label: 'Recalled' }
];

// Mock blockchain transactions
export const mockBlockchainTransactions = [
  {
    batchId: 'BATCH-001',
    transactions: [
      {
        hash: '0x3a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u',
        timestamp: 1692180600000, // 2023-08-16T09:30:00Z
        action: 'create',
        data: {
          farmId: 'FARM-001',
          harvestDate: '2023-08-15',
          variety: 'Virginia Gold',
          quantity: '5000 kg',
          grade: 'Premium'
        }
      }
    ]
  },
  {
    batchId: 'BATCH-002',
    transactions: [
      {
        hash: '0x9t8s7r6q5p4o3n2m1l0k9j8i7h6g5f4e3d2c1b0a',
        timestamp: 1693650900000, // 2023-09-02T10:15:00Z
        action: 'create',
        data: {
          farmId: 'FARM-001',
          harvestDate: '2023-09-01',
          variety: 'Burley',
          quantity: '3800 kg',
          grade: 'Standard'
        }
      },
      {
        hash: '0xq1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6j7k8l9z',
        timestamp: 1696516800000, // 2023-10-05T14:20:00Z
        action: 'update',
        previousStatus: 'harvested',
        newStatus: 'processing',
        location: 'Central Processing Facility'
      }
    ]
  }
];