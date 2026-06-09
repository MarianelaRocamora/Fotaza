const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Etiqueta = sequelize.define('etiqueta', {
    id_etiqueta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_etiqueta: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'etiqueta',
    timestamps: false
});

module.exports = Etiqueta;