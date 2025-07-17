import Promotion from '../models/PromotionModel.js';
import Package from '../models/PackageModel.js';
import PromotionPackage from '../models/PromotionPackageModel.js';
import fs from 'fs';
import path from 'path';

// Get all promotions
export const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.findAll({
      include: [
        { 
          model: Package, 
          as: 'packages',
          through: { attributes: [] } // Don't include junction table
        }
      ]
    });
    res.json(promotions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single promotion
export const getPromotion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const promotion = await Promotion.findByPk(id, {
      include: [
        { 
          model: Package, 
          as: 'packages',
          through: { attributes: [] } // Don't include junction table
        }
      ]
    });
    
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    
    res.json(promotion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new promotion
export const createPromotion = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      terms, 
      valid_from, 
      valid_until, 
      discount_percent,
      package_ids
    } = req.body;
    
    let image_url = null;
    
    // If image is uploaded
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }
    
    // Create promotion
    const promotion = await Promotion.create({
      title,
      description,
      terms,
      valid_from,
      valid_until,
      discount_percent,
      image_url
    });
    
    // Add packages to promotion if provided
    if (package_ids && Array.isArray(package_ids) && package_ids.length > 0) {
      const promotionPackages = package_ids.map(package_id => ({
        promotion_id: promotion.id,
        package_id
      }));
      
      await PromotionPackage.bulkCreate(promotionPackages);
    }
    
    // Fetch created promotion with packages
    const createdPromotion = await Promotion.findByPk(promotion.id, {
      include: [
        { 
          model: Package, 
          as: 'packages',
          through: { attributes: [] } // Don't include junction table
        }
      ]
    });
    
    res.status(201).json(createdPromotion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a promotion
export const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      terms, 
      valid_from, 
      valid_until, 
      discount_percent 
    } = req.body;
    
    const promotion = await Promotion.findByPk(id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    
    let image_url = promotion.image_url;
    
    // If new image is uploaded
    if (req.file) {
      // Delete old image if it exists
      if (promotion.image_url) {
        const oldImagePath = path.join(process.cwd(), 'public', promotion.image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // Set new image URL
      image_url = `/uploads/${req.file.filename}`;
    }
    
    // Update promotion
    await promotion.update({
      title: title || promotion.title,
      description: description !== undefined ? description : promotion.description,
      terms: terms !== undefined ? terms : promotion.terms,
      valid_from: valid_from || promotion.valid_from,
      valid_until: valid_until || promotion.valid_until,
      discount_percent: discount_percent || promotion.discount_percent,
      image_url
    });
    
    // Fetch updated promotion with packages
    const updatedPromotion = await Promotion.findByPk(id, {
      include: [
        { 
          model: Package, 
          as: 'packages',
          through: { attributes: [] } // Don't include junction table
        }
      ]
    });
    
    res.json(updatedPromotion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a promotion
export const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const promotion = await Promotion.findByPk(id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    
    // Delete image file if it exists
    if (promotion.image_url) {
      const imagePath = path.join(process.cwd(), 'public', promotion.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete promotion packages first
    await PromotionPackage.destroy({
      where: { promotion_id: id }
    });
    
    // Delete promotion from database
    await promotion.destroy();
    
    res.json({ message: 'Promotion deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};