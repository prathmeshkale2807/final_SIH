import api from './api';

const DEALS_STORAGE_KEY = 'krishak_active_deals_v1';

const defaultDeals = [
  {
    id: 'DEAL-2026-901',
    farmerId: 'FARM-2026-MH01',
    farmerName: 'Rahul Jadhav',
    farmerMobile: '+91 9876543210',
    farmerPickupAddress: 'Gat No. 42, Farm Shed, Ausa, Latur District, Maharashtra',
    buyerId: 'BUY-2026-PN08',
    buyerName: 'AgroFresh Processors Ltd.',
    buyerMobile: '+91 9822012345',
    crop: 'Onion (Grade A)',
    cropKey: 'onion',
    quantity: 60,
    unit: 'Quintals',
    pricePerUnit: 1490,
    totalValue: 89400,
    status: 'APPROVED', // 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'IN_TRANSIT' | 'COMPLETED'
    dropLocation: 'AgroFresh Central Processing Hub, Gate 2, Hadapsar Industrial Area, Pune, Maharashtra 411028',
    pickupDate: 'Tomorrow, 08:30 AM',
    transporterName: 'Krishak Verified Logistics (Cold Express)',
    vehicleNumber: 'MH-12-TR-8821',
    driverPhone: '+91 9890123456',
    escrowId: 'ESC-2026-9901',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    approvedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    milestones: [
      { key: 'REQUEST_SENT', label: 'Farmer Deal Request Sent', date: '25 Aug, 04:00 PM', done: true },
      { key: 'BUYER_APPROVED', label: 'Buyer Approved & Drop Assigned', date: '25 Aug, 05:30 PM', done: true },
      { key: 'ESCROW_FUNDED', label: '100% Escrow Amount Deposited', date: '25 Aug, 05:35 PM', done: true },
      { key: 'PICKUP_SCHEDULED', label: 'Truck Dispatched for Pickup', date: 'Today, 08:30 AM', done: true },
      { key: 'PICKUP_COMPLETED', label: 'Farm Gate Loading Complete', date: 'Pending', done: false },
      { key: 'DELIVERED', label: 'Delivered to Drop Facility', date: 'Pending', done: false },
      { key: 'PAYMENT_RELEASED', label: 'Escrow Payment Released', date: 'Pending', done: false },
    ],
  },
  {
    id: 'DEAL-2026-902',
    farmerId: 'FARM-2026-MH01',
    farmerName: 'Rahul Jadhav',
    farmerMobile: '+91 9876543210',
    farmerPickupAddress: 'Gat No. 42, Farm Shed, Ausa, Latur District, Maharashtra',
    buyerId: 'BUY-2026-PN08',
    buyerName: 'Metro Wholesale Sourcing',
    buyerMobile: '+91 9855512345',
    crop: 'Onion (Grade A)',
    cropKey: 'onion',
    quantity: 40,
    unit: 'Quintals',
    pricePerUnit: 1475,
    totalValue: 59000,
    status: 'PENDING_APPROVAL',
    dropLocation: 'Metro Distribution Center, Chakan Phase 2, Pune, Maharashtra',
    pickupDate: '27 Aug, 10:00 AM',
    transporterName: 'Pending Assignment',
    vehicleNumber: 'Pending',
    driverPhone: '',
    escrowId: 'ESC-2026-9902',
    createdAt: new Date().toISOString(),
    approvedAt: null,
    milestones: [
      { key: 'REQUEST_SENT', label: 'Farmer Deal Request Sent', date: 'Just now', done: true },
      { key: 'BUYER_APPROVED', label: 'Buyer Approved & Drop Assigned', date: 'Pending Buyer', done: false },
      { key: 'ESCROW_FUNDED', label: '100% Escrow Amount Deposited', date: 'Pending', done: false },
      { key: 'PICKUP_SCHEDULED', label: 'Truck Dispatched for Pickup', date: 'Pending', done: false },
      { key: 'PICKUP_COMPLETED', label: 'Farm Gate Loading Complete', date: 'Pending', done: false },
      { key: 'DELIVERED', label: 'Delivered to Drop Facility', date: 'Pending', done: false },
      { key: 'PAYMENT_RELEASED', label: 'Escrow Payment Released', date: 'Pending', done: false },
    ],
  },
];

export const dealService = {
  getDeals: () => {
    try {
      const stored = localStorage.getItem(DEALS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(defaultDeals));
      return defaultDeals;
    } catch {
      return defaultDeals;
    }
  },

  saveDeals: (deals) => {
    try {
      localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(deals));
      window.dispatchEvent(new Event('krishak_deals_updated'));
    } catch (e) {
      console.warn('Failed to save deals to storage:', e);
    }
  },

  getFarmerDeals: (farmerId = 'FARM-2026-MH01') => {
    const deals = dealService.getDeals();
    return deals.filter((d) => !farmerId || d.farmerId === farmerId || d.farmerId === 'FARM-2026-MH01');
  },

  getBuyerDeals: (buyerId = 'BUY-2026-PN08') => {
    const deals = dealService.getDeals();
    return deals;
  },

  createFarmerRequest: async ({
    farmerId = 'FARM-2026-MH01',
    farmerName = 'Rahul Jadhav',
    farmerMobile = '+91 9876543210',
    farmerPickupAddress = 'Gat No. 42, Farm Shed, Ausa, Latur District, Maharashtra',
    buyerId = 'BUY-2026-PN08',
    buyerName = 'AgroFresh Processors Ltd.',
    buyerMobile = '+91 9822012345',
    crop = 'Onion (Grade A)',
    cropKey = 'onion',
    quantity = 60,
    unit = 'Quintals',
    pricePerUnit = 1490,
  }) => {
    const deals = dealService.getDeals();
    const newDealId = `DEAL-${Date.now().toString().slice(-6)}`;
    const totalValue = Math.round(Number(quantity) * Number(pricePerUnit));

    const newDeal = {
      id: newDealId,
      farmerId,
      farmerName,
      farmerMobile,
      farmerPickupAddress: farmerPickupAddress || 'Gat No. 42, Farm Shed, Ausa, Latur District, Maharashtra',
      buyerId,
      buyerName,
      buyerMobile,
      crop,
      cropKey,
      quantity: Number(quantity),
      unit,
      pricePerUnit: Number(pricePerUnit),
      totalValue,
      status: 'PENDING_APPROVAL',
      dropLocation: 'To be assigned by Buyer upon approval',
      pickupDate: 'To be scheduled upon approval',
      transporterName: 'Pending Assignment',
      vehicleNumber: 'Pending',
      driverPhone: '',
      escrowId: `ESC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      approvedAt: null,
      milestones: [
        { key: 'REQUEST_SENT', label: 'Farmer Deal Request Sent', date: 'Just now', done: true },
        { key: 'BUYER_APPROVED', label: 'Buyer Approved & Drop Assigned', date: 'Pending Buyer', done: false },
        { key: 'ESCROW_FUNDED', label: '100% Escrow Amount Deposited', date: 'Pending', done: false },
        { key: 'PICKUP_SCHEDULED', label: 'Truck Dispatched for Pickup', date: 'Pending', done: false },
        { key: 'PICKUP_COMPLETED', label: 'Farm Gate Loading Complete', date: 'Pending', done: false },
        { key: 'DELIVERED', label: 'Delivered to Drop Facility', date: 'Pending', done: false },
        { key: 'PAYMENT_RELEASED', label: 'Escrow Payment Released', date: 'Pending', done: false },
      ],
    };

    const updated = [newDeal, ...deals];
    dealService.saveDeals(updated);

    // Also attempt backend creation if online
    try {
      await api.post('/offers', {
        produceId: newDealId,
        crop,
        price: pricePerUnit,
        quantity,
        unit,
        message: `Farmer direct request from ${farmerName} (${farmerPickupAddress})`,
      });
    } catch {}

    return { success: true, deal: newDeal };
  },

  approveDealByBuyer: async (
    dealId,
    {
      dropLocation = 'AgroFresh Central Processing Hub, Gate 2, Hadapsar Industrial Area, Pune, Maharashtra 411028',
      pickupDate = 'Tomorrow, 08:30 AM',
      transporterName = 'Krishak Verified Express Logistics',
      vehicleNumber = 'MH-12-TR-8821',
      driverPhone = '+91 9890123456',
      notes = '',
    } = {}
  ) => {
    const deals = dealService.getDeals();
    const dealIndex = deals.findIndex((d) => d.id === dealId);

    if (dealIndex === -1) {
      return { success: false, message: 'Deal not found' };
    }

    const nowStr = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    const current = deals[dealIndex];
    const updatedDeal = {
      ...current,
      status: 'APPROVED',
      dropLocation: dropLocation || current.dropLocation,
      pickupDate: pickupDate || 'Tomorrow, 08:30 AM',
      transporterName: transporterName || 'Krishak Verified Logistics',
      vehicleNumber: vehicleNumber || 'MH-12-TR-8821',
      driverPhone: driverPhone || '+91 9890123456',
      notes,
      approvedAt: new Date().toISOString(),
      milestones: current.milestones.map((m) => {
        if (m.key === 'BUYER_APPROVED') return { ...m, done: true, date: nowStr };
        if (m.key === 'ESCROW_FUNDED') return { ...m, done: true, date: nowStr };
        if (m.key === 'PICKUP_SCHEDULED') return { ...m, done: true, date: pickupDate };
        return m;
      }),
    };

    deals[dealIndex] = updatedDeal;
    dealService.saveDeals(deals);

    // Also attempt backend sync
    try {
      await api.patch(`/offers/${dealId}`, { status: 'ACCEPTED' });
    } catch {}

    return { success: true, deal: updatedDeal };
  },

  rejectDealByBuyer: async (dealId, reason = 'Price or specification mismatch') => {
    const deals = dealService.getDeals();
    const dealIndex = deals.findIndex((d) => d.id === dealId);
    if (dealIndex === -1) return { success: false, message: 'Deal not found' };

    deals[dealIndex] = {
      ...deals[dealIndex],
      status: 'REJECTED',
      rejectionReason: reason,
    };
    dealService.saveDeals(deals);
    return { success: true };
  },
};

export default dealService;
