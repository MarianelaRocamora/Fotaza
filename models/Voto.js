const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Voto = sequelize.define('voto', {
    id_voto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    valoracion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    fecha_voto: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    id_votante: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_imagen: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'voto',
    timestamps: false
});

module.exports = Voto;