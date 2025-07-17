import PackageItem from '../models/PackageItemModel.js';
import Package from '../models/PackageModel.js';

// Get package items by package ID
export const getPackageItems = async (req, res) => {
  try {
    const { packageId } = req.params;
    
    // Check if package exists
    const packageData = await Package.findByPk(packageId);
    if (!packageData) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    // Get package items
    const packageItems = await PackageItem.findAll({
      where: { package_id: packageId }
    });
    
    res.json(packageItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a package item
export const createPackageItem = async (req, res) => {
  try {
    const { package_id, item_name } = req.body;
    
    // Check if package exists
    const packageData = await Package.findByPk(package_id);
    if (!packageData) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    // Create package item
    const packageItem = await PackageItem.create({
      package_id,
      item_name
    });
    
    res.status(201).json(packageItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a package item
export const updatePackageItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { item_name } = req.body;
    
    const packageItem = await PackageItem.findByPk(id);
    if (!packageItem) {
      return res.status(404).json({ message: 'Package item not found' });
    }
    
    // Update package item
    await packageItem.update({
      item_name: item_name || packageItem.item_name
    });
    
    res.json(packageItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a package item
export const deletePackageItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const packageItem = await PackageItem.findByPk(id);
    if (!packageItem) {
      return res.status(404).json({ message: 'Package item not found' });
    }
    
    // Delete package item from database
    await packageItem.destroy();
    
    res.json({ message: 'Package item deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};