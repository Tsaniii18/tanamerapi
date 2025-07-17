import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import db from './config/database.js';
import AuthRoute from './routes/AuthRoute.js';
import SlideRoute from './routes/SlideRoute.js';
import MenuItemRoute from './routes/MenuItemRoute.js';
import PackageRoute from './routes/PackageRoute.js';
import PackageItemRoute from './routes/PackageItemRoute.js';
import PromotionRoute from './routes/PromotionRoute.js';
import PromotionPackageRoute from './routes/PromotionPackageRoute.js';
import SocialMediaRoute from './routes/SocialMediaRoute.js';
import FileUploadRoute from './routes/FileUploadRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Routes
app.use('/api/auth', AuthRoute);
app.use('/api/slides', SlideRoute);
app.use('/api/menu-items', MenuItemRoute);
app.use('/api/packages', PackageRoute);
app.use('/api/package-items', PackageItemRoute);
app.use('/api/promotions', PromotionRoute);
app.use('/api/promotion-packages', PromotionPackageRoute);
app.use('/api/social-media', SocialMediaRoute);
app.use('/api/upload', FileUploadRoute);

// Database connection and server start
(async () => {
  try {
    await db.authenticate();
    console.log('Database connected...');
    
    // Sync database (in development only)
    if (process.env.NODE_ENV !== 'production') {
      await db.sync();
      console.log('Database synchronized');
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Connection error:', error);
  }
})();