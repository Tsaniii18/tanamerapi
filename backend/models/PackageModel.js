import { DataTypes } from 'sequelize';
import db from '../config/database.js';
import PackageItem from './PackageItemModel.js';

const Package = db.define('packages', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['jeep', 'orange-picking']]
    }
  },
  route: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true
    }
  }
});

// Relation with PackageItem
Package.hasMany(PackageItem, { foreignKey: 'package_id', as: 'items' });
PackageItem.belongsTo(Package, { foreignKey: 'package_id' });

export default Package;