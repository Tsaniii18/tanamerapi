import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const PackageItem = db.define('package_items', {
  package_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

export default PackageItem;