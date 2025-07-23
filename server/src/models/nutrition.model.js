import { DataTypes } from 'sequelize';
import sequelize from '../config/mysql.database.js';

import Intensity from './intensity.model.js';
import User from './user.model.js';

const Nutrition = sequelize.define('Nutrition', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
}, {
    tableName: 'nutrition',
    timestamps: true,
});

Nutrition.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});
Nutrition.belongsTo(Intensity, {
    foreignKey: 'intensityId',
    as: 'intensity',
});

export default Nutrition;