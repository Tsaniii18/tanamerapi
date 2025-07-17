import Package from '../models/PackageModel.js';
import PackageItem from '../models/PackageItemModel.js';
import fs from 'fs';
import path from 'path';

// Get all packages
export const getPackages = async (req, res) => {
  try {
    const packages = await Package.findAll({
      include: [
        { model: PackageItem, as: 'items' }
      ]
    });
    res.json(packages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get packages by type
export const getPackagesByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    const packages = await Package.findAll({
      where: { type },
      include: [
        { model: PackageItem, as: 'items' }
      ]
    });
    
    res.json(packages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single package
export const getPackage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const packageData = await Package.findByPk(id, {
      include: [
        { model: PackageItem, as: 'items' }
      ]
    });
    
    if (!packageData) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    res.json(packageData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new package
export const createPackage = async (req, res) => {
  try {
    const { name, type, route, description, price, items } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }
    
    const image_url = `/uploads/${req.file.filename}`;
    
    // Create package
    const packageData = await Package.create({
      name,
      type,
      route: type === 'jeep' ? route : null,
      description,
      image_url,
      price
    });
    
    // Create package items if provided
    if (items && Array.isArray(items) && items.length > 0) {
      const packageItems = items.map(item => ({
        package_id: packageData.id,
        item_name: item
      }));
      
      await PackageItem.bulkCreate(packageItems);
    }
    
    // Fetch created package with items
    const createdPackage = await Package.findByPk(packageData.id, {
      include: [
        { model: PackageItem, as: 'items' }
      ]
    });
    
    res.status(201).json(createdPackage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a package
export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, route, description, price } = req.body;
    
    const packageData = await Package.findByPk(id);
    if (!packageData) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    let image_url = packageData.image_url;
    
    // If new image is uploaded
    if (req.file) {
      // Delete old image if it exists
      if (packageData.image_url) {
        const oldImagePath = path.join(process.cwd(), 'public', packageData.image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // Set new image URL
      image_url = `/uploads/${req.file.filename}`;
    }
    
    // Update package
    await packageData.update({
      name: name || packageData.name,
      type: type || packageData.type,
      route: type === 'jeep' ? (route || packageData.route) : null,
      description: description !== undefined ? description : packageData.description,
      image_url,
      price: price || packageData.price
    });
    
    // Fetch updated package with items
    const updatedPackage = await Package.findByPk(id, {
      include: [
        { model: PackageItem, as: 'items' }
      ]
    });
    
    res.json(updatedPackage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a package
export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const packageData = await Package.findByPk(id);
    if (!packageData) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    // Delete image file if it exists
    if (packageData.image_url) {
      const imagePath = path.join(process.cwd(), 'public', packageData.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete package items first
    await PackageItem.destroy({
      where: { package_id: id }
    });
    
    // Delete package from database
    await packageData.destroy();
    
    res.json({ message: 'Package deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};