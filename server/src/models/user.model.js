import { DataTypes } from 'sequelize';
import sequelize from '../config/mysql.database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Please provide a valid email address'
      },
      notEmpty: {
        msg: 'Email cannot be empty'
      }
    }
  },
  username: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(30),
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'creationDate',
  updatedAt: 'lastModifiedDate',
});

User.associate = (models) => {
  User.hasMany(models.Weight, {
    foreignKey: 'userId',
    as: 'weight',
  });
  User.hasMany(models.Nutrition, {
    foreignKey: 'userId',
    as: 'nutrition',
  });
};

export default User;
