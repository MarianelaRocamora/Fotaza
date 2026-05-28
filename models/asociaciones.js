const Usuario = require('./Usuario');
const Publicacion = require('./Publicacion');
const Etiqueta = require('./Etiqueta');
const Imagen = require('./Imagen');
const Voto = require('./Voto');
const Comentario = require('./Comentario');
const UsuarioSeguidor = require('./UsuarioSeguidor');

// ─── Usuario ↔ Publicacion ──────────────────────────────
Publicacion.belongsTo(Usuario, { foreignKey: 'id_creador', as: 'creador' });
Usuario.hasMany(Publicacion, { foreignKey: 'id_creador', as: 'publicaciones' });

// ─── Publicacion ↔ Etiqueta ─────────────────────────────
Publicacion.belongsToMany(Etiqueta, {
    through: { model: 'publicacion_etiqueta', timestamps: false },
    foreignKey: 'id_publicacion',
    as: 'etiquetas'
});
Etiqueta.belongsToMany(Publicacion, {
    through: { model: 'publicacion_etiqueta', timestamps: false },
    foreignKey: 'id_etiqueta',
    as: 'publicaciones'
});

// ─── Publicacion ↔ Imagen ───────────────────────────────
Publicacion.hasMany(Imagen, { foreignKey: 'id_publicacion', as: 'imagenes' });
Imagen.belongsTo(Publicacion, { foreignKey: 'id_publicacion', as: 'publicacion' });

// ─── Votos ──────────────────────────────────────────────
Voto.belongsTo(Imagen, { foreignKey: 'id_imagen' });
Voto.belongsTo(Usuario, { foreignKey: 'id_votante', as: 'votante' });
Imagen.hasMany(Voto, { foreignKey: 'id_imagen', as: 'votos' });

// ─── Comentarios ────────────────────────────────────────
Comentario.belongsTo(Usuario, { foreignKey: 'id_comentador', as: 'comentador' });
Comentario.belongsTo(Imagen, { foreignKey: 'id_imagen' });
Imagen.hasMany(Comentario, { foreignKey: 'id_imagen', as: 'comentarios' });

// ─── Seguidores ─────────────────────────────────────────
Usuario.belongsToMany(Usuario, {
    through: UsuarioSeguidor,
    foreignKey: 'id_seguidor',
    otherKey: 'id_usuario',
    as: 'seguidos'
});
Usuario.belongsToMany(Usuario, {
    through: UsuarioSeguidor,
    foreignKey: 'id_usuario',
    otherKey: 'id_seguidor',
    as: 'seguidores'
});