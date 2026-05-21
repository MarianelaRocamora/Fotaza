const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Comentario = sequelize.define('comentario', {
    id_comentario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fecha_comentario: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'activo'
    },
    id_comentador: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_imagen: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
   
}, {
    tableName: 'comentario',
    timestamps: false
});

module.exports = Comentario;