const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const UsuarioSeguidor = sequelize.define('usuario_seguidor', {
    id_seguimiento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_seguidor: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_seguimiento: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'usuario_seguidor',
    timestamps: false
});

module.exports = UsuarioSeguidor;