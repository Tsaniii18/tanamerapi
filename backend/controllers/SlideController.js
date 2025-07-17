import Slide from '../models/SlideModel.js';
import fs from 'fs';
import path from 'path';

// Get all slides
export const getSlides = async (req, res) => {
  try {
    const slides = await Slide.findAll({
      order: [['order', 'ASC']]
    });
    res.json(slides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new slide
export const createSlide = async (req, res) => {
  try {
    const { title, order } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }
    
    const image_url = `/uploads/${req.file.filename}`;
    
    const slide = await Slide.create({
      title,
      image_url,
      order: order || 0
    });
    
    res.status(201).json(slide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a slide
export const updateSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, order } = req.body;
    
    const slide = await Slide.findByPk(id);
    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }
    
    let image_url = slide.image_url;
    
    // If new image is uploaded
    if (req.file) {
      // Delete old image if it exists
      if (slide.image_url) {
        const oldImagePath = path.join(process.cwd(), 'public', slide.image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // Set new image URL
      image_url = `/uploads/${req.file.filename}`;
    }
    
    // Update slide
    await slide.update({
      title: title || slide.title,
      image_url,
      order: order !== undefined ? order : slide.order
    });
    
    res.json(slide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a slide
export const deleteSlide = async (req, res) => {
  try {
    const { id } = req.params;
    
    const slide = await Slide.findByPk(id);
    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }
    
    // Delete image file if it exists
    if (slide.image_url) {
      const imagePath = path.join(process.cwd(), 'public', slide.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete slide from database
    await slide.destroy();
    
    res.json({ message: 'Slide deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};