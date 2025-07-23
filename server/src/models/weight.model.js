import { DataTypes } from 'sequelize';
import sequelize from '../config/mysql.database.js';

import User from './user.model.js';

const Weight = sequelize.define('Weight', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  weight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
}, {
  tableName: 'weight',
  timestamps: true,
  createdAt: 'creationDate'
});

Weight.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

export default Weight;