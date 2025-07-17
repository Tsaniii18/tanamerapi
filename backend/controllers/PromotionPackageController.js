import PromotionPackage from '../models/PromotionPackageModel.js';
import Promotion from '../models/PromotionModel.js';
import Package from '../models/PackageModel.js';

// Get promotion packages by promotion ID
export const getPromotionPackages = async (req, res) => {
  try {
    const { promotionId } = req.params;
    
    // Check if promotion exists
    const promotion = await Promotion.findByPk(promotionId);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    
    // Get packages for this promotion
    const packages = await Package.findAll({
      include: [
        {
          model: Promotion,
          as: 'promotions',
          where: { id: promotionId },
          through: { attributes: [] } // Don't include junction table
        }
      ]
    });
    
    res.json(packages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a promotion package association
export const createPromotionPackage = async (req, res) => {
  try {
    const { promotion_id, package_id } = req.body;
    
    // Check if promotion exists
    const promotion = await Promotion.findByPk(promotion_id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    
    // Check if package exists
    const packageData = await Package.findByPk(package_id);
    if (!packageData) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    // Check if association already exists
    const existing = await PromotionPackage.findOne({
      where: {
        promotion_id,
        package_id
      }
    });
    
    if (existing) {
      return res.status(400).json({ message: 'Package already added to this promotion' });
    }
    
    // Create association
    const promotionPackage = await PromotionPackage.create({
      promotion_id,
      package_id
    });
    
    res.status(201).json(promotionPackage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a promotion package association
export const deletePromotionPackage = async (req, res) => {
  try {
    const { promotion_id, package_id } = req.params;
    
    const promotionPackage = await PromotionPackage.findOne({
      where: {
        promotion_id,
        package_id
      }
    });
    
    if (!promotionPackage) {
      return res.status(404).json({ message: 'Association not found' });
    }
    
    // Delete association from database
    await promotionPackage.destroy();
    
    res.json({ message: 'Package removed from promotion' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};