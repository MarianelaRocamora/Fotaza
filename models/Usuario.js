const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Usuario = sequelize.define('usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    sexo: {
        type: DataTypes.CHAR(1),
        validate: { isIn: [['M', 'F', 'O']] }
    },
    fecha_nacimiento: {
        type: DataTypes.DATEONLY
    },
    bio: DataTypes.TEXT,
    avatar: DataTypes.STRING(255),
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'activo'
    },
    es_moderador: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'usuario',
    timestamps: false
});

module.exports = Usuario;