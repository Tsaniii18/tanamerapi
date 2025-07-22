// SiteSettingController.js
import SiteSetting from '../models/SiteSettingModel.js';
import fs from 'fs';
import path from 'path';

// Get all site settings
export const getSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSetting.findAll();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get site setting by key
export const getSiteSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;
    
    const setting = await SiteSetting.findOne({ where: { key } });
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    
    res.json(setting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update or create site setting
export const updateSiteSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value, type } = req.body;
    
    let setting = await SiteSetting.findOne({ where: { key } });
    
    if (setting) {
      // If key is 'home_image' and there's a file upload
      if (key === 'home_image' && req.file) {
        // Delete old image if it exists
        if (setting.value) {
          const oldImagePath = path.join(process.cwd(), 'public', setting.value);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        // Set new image URL
        const imageUrl = `/uploads/${req.file.filename}`;
        await setting.update({ value: imageUrl });
      } else {
        // Update text value
        await setting.update({ value });
      }
    } else {
      // Create new setting
      if (key === 'home_image' && req.file) {
        const imageUrl = `/uploads/${req.file.filename}`;
        setting = await SiteSetting.create({
          key,
          value: imageUrl,
          type: 'image'
        });
      } else {
        setting = await SiteSetting.create({
          key,
          value,
          type: type || 'text'
        });
      }
    }
    
    res.json(setting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};