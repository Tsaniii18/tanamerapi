import db from '../config/database.js';
import { DataTypes } from 'sequelize';

// This script adds the primary_package_id column to the promotions table
const addPrimaryPackageIdColumn = async () => {
  try {
    // Check if the column already exists
    const [results] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'promotions' 
      AND COLUMN_NAME = 'primary_package_id'
    `);
    
    if (results.length === 0) {
      // Add the column
      await db.query(`
        ALTER TABLE promotions 
        ADD COLUMN primary_package_id INT,
        ADD CONSTRAINT fk_primary_package_id 
        FOREIGN KEY (primary_package_id) 
        REFERENCES packages(id) 
        ON DELETE SET NULL
      `);
      
      console.log('Successfully added primary_package_id column to promotions table');
      
      // Update existing promotions to use the first associated package as primary
      await db.query(`
        UPDATE promotions p
        JOIN promotion_packages pp ON p.id = pp.promotion_id
        SET p.primary_package_id = pp.package_id
        WHERE p.primary_package_id IS NULL
        AND (p.id, pp.package_id) IN (
          SELECT promotion_id, MIN(package_id) 
          FROM promotion_packages 
          GROUP BY promotion_id
        )
      `);
      
      console.log('Successfully updated existing promotions with primary_package_id');
    } else {
      console.log('Column primary_package_id already exists in promotions table');
    }
  } catch (error) {
    console.error('Migration error:', error);
  }
};

// Run the migration
addPrimaryPackageIdColumn();