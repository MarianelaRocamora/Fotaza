const Usuario = require('./Usuario');
const Publicacion = require('./Publicacion');
const Etiqueta = require('./Etiqueta');

Publicacion.belongsTo(Usuario, { foreignKey: 'id_creador', as: 'creador' });
Usuario.hasMany(Publicacion, { foreignKey: 'id_creador', as: 'publicaciones' });

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