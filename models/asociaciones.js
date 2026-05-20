const Usuario = require('./Usuario');
const Publicacion = require('./Publicacion');
const Etiqueta = require('./Etiqueta');
const Imagen = require('./Imagen');
const Voto = require('./Voto');

// ─── Usuario ────────────────────────────────────────────
Publicacion.belongsTo(Usuario, { foreignKey: 'id_creador', as: 'creador' });
Usuario.hasMany(Publicacion, { foreignKey: 'id_creador', as: 'publicaciones' });

// ─── Etiquetas ──────────────────────────────────────────
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

// ─── Imágenes ───────────────────────────────────────────
Publicacion.belongsToMany(Imagen, {
    through: 'publicacion_imagen',
    foreignKey: 'id_publicacion',
    as: 'imagenes'
});

Imagen.belongsToMany(Publicacion, {
    through: 'publicacion_imagen',
    foreignKey: 'id_imagen',
    as: 'publicaciones'
});

// ─── Votos ──────────────────────────────────────────────
Voto.belongsTo(Imagen, { foreignKey: 'id_imagen' });
Voto.belongsTo(Usuario, { foreignKey: 'id_votante', as: 'votante' });
Imagen.hasMany(Voto, { foreignKey: 'id_imagen' });
`const Usuario = require('./Usuario');
const Publicacion = require('./Publicacion');
const Etiqueta = require('./Etiqueta');
const Imagen = require('./Imagen');
const Voto = require('./Voto');

// ─── Usuario ────────────────────────────────────────────
Publicacion.belongsTo(Usuario, { foreignKey: 'id_creador', as: 'creador' });
Usuario.hasMany(Publicacion, { foreignKey: 'id_creador', as: 'publicaciones' });

// ─── Etiquetas ──────────────────────────────────────────
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

// ─── Imágenes ───────────────────────────────────────────
Publicacion.belongsToMany(Imagen, {
    through: 'publicacion_imagen',
    foreignKey: 'id_publicacion',
    as: 'imagenes'
});

Imagen.belongsToMany(Publicacion, {
    through: 'publicacion_imagen',
    foreignKey: 'id_imagen',
    as: 'publicaciones'
});

// ─── Votos ──────────────────────────────────────────────
Voto.belongsTo(Imagen, { foreignKey: 'id_imagen' });
Voto.belongsTo(Usuario, { foreignKey: 'id_votante', as: 'votante' });
Imagen.hasMany(Voto, { foreignKey: 'id_imagen' });
`