import { DataTypes } from 'sequelize';
import sequelize from '../config/mysql.database.js';

const Intensity = sequelize.define('Intensity', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    type: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'intensity'
});

export default Intensity;