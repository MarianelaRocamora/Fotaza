const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Usuario = require('./Usuario');

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

Publicacion.belongsTo(Usuario, { foreignKey: 'id_creador', as: 'creador' });
Usuario.hasMany(Publicacion, { foreignKey: 'id_creador', as: 'publicaciones' });

const Etiqueta = require('./Etiqueta');

Publicacion.belongsToMany(Etiqueta, {
    through: 'publicacion_etiqueta',
    foreignKey: 'id_publicacion',
    as: 'etiquetas'
});

Etiqueta.belongsToMany(Publicacion, {
    through: 'publicacion_etiqueta',
    foreignKey: 'id_etiqueta',
    as: 'publicaciones'
});

module.exports = Publicacion;