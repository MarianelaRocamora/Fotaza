const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Publicacion = sequelize.define('publicacion', {
    id_publicacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    descripcion: DataTypes.TEXT,
    fecha_publicacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'activo'
    },
    id_creador: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'publicacion',
    timestamps: false
});

module.exports = Publicacion;