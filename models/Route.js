import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Route = sequelize.define('Route', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  path: {
    type: DataTypes.JSONB,
    allowNull: false
  },
}, {
  tableName: 'routes',
  timestamps: true,
});


export default Route;
