const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Imagen = sequelize.define('imagen', {
    id_imagen: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    foto: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    datos: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    ancho: DataTypes.INTEGER,
    altura: DataTypes.INTEGER,
    licencia: {
        type: DataTypes.STRING(20),
        defaultValue: 'sin_copyright',
        validate: { isIn: [['copyright', 'sin_copyright']] }
    },
    marca_de_agua: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    texto_marca: DataTypes.STRING(200),
    fecha_subida: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'activo'
    },
    comentario_clausurado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    id_publicacion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: 'imagen',
    timestamps: false
});

module.exports = Imagen;