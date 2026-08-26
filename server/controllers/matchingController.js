import { Produce } from '../models/Produce.js';
import { BuyerRequirement } from '../models/BuyerRequirement.js';
import { matchingService } from '../services/matchingService.js';
import { isDBConnected } from '../config/db.js';

export const getMatchesForBuyerRequirement = async (req, res) => {
  try {
    const { requirementId } = req.params;

    let requirement = null;
    if (isDBConnected()) {
      try {
        requirement = await BuyerRequirement.findOne({
          $or: [{ requirementId }, { _id: requirementId }],
        });
      } catch (e) {}
    }

    // Dynamic search fallback
    if (!requirement) {
      const { getMemoryRequirement } = await import('./requirementController.js').catch(() => ({}));
      if (getMemoryRequirement) {
        requirement = getMemoryRequirement(requirementId);
      }
    }

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: `Requirement ${requirementId} not found`,
        matches: [],
      });
    }

    let produces = [];
    if (isDBConnected()) {
      try {
        produces = await Produce.find({ status: 'ACTIVE' });
      } catch (e) {}
    }

    // Dynamic search in-memory active produce fallback
    if (!produces || produces.length === 0) {
      const { getAllActiveProducesInMemory } = await import('./produceController.js').catch(() => ({}));
      if (getAllActiveProducesInMemory) {
        produces = getAllActiveProducesInMemory();
      }
    }

    const matches = matchingService.matchRequirementWithProduces(requirement, produces || []);
    return res.json({
      success: true,
      requirementId,
      count: matches.length,
      matchCount: matches.length,
      matches,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, matches: [] });
  }
};

export const getMatchesForFarmerProduce = async (req, res) => {
  try {
    const { produceId } = req.params;

    let produce = null;
    if (isDBConnected()) {
      try {
        produce = await Produce.findOne({
          $or: [{ produceId }, { _id: produceId }],
        });
      } catch (e) {}
    }

    if (!produce) {
      const { getProduceByIdInMemory } = await import('./produceController.js').catch(() => ({}));
      if (getProduceByIdInMemory) {
        produce = getProduceByIdInMemory(produceId);
      }
    }

    if (!produce) {
      return res.status(404).json({
        success: false,
        message: `Produce ${produceId} not found`,
        matches: [],
      });
    }

    let requirements = [];
    if (isDBConnected()) {
      try {
        requirements = await BuyerRequirement.find({ status: 'OPEN' });
      } catch (e) {}
    }

    if (!requirements || requirements.length === 0) {
      const { getAllOpenRequirementsInMemory } = await import('./requirementController.js').catch(() => ({}));
      if (getAllOpenRequirementsInMemory) {
        requirements = getAllOpenRequirementsInMemory();
      }
    }

    const matches = matchingService.matchProduceWithRequirements(produce, requirements || []);
    return res.json({
      success: true,
      produceId,
      count: matches.length,
      matchCount: matches.length,
      matches,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, matches: [] });
  }
};
