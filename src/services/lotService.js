import { produceService } from './produceService';

export const lotService = {
  getAllLots: async () => {
    return await produceService.getMyProduce();
  },
  createLot: async (newLot) => {
    const res = await produceService.createProduce(newLot);
    return res.produce;
  },
  toggleLotStatus: async (id, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    const res = await produceService.toggleProduceStatus(id, nextStatus);
    return res.produce;
  },
};
