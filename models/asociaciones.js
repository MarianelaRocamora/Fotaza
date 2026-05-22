const Usuario = require('./Usuario');
const Publicacion = require('./Publicacion');
const Etiqueta = require('./Etiqueta');
const Imagen = require('./Imagen');
const Voto = require('./Voto');
const Comentario = require('./Comentario');
const UsuarioSeguidor = require('./UsuarioSeguidor');

// ─── Usuario ────────────────────────────────────────────
Publicacion.belongsTo(Usuario, { foreignKey: 'id_creador', as: 'creador' });
Usuario.hasMany(Publicacion, { foreignKey: 'id_creador', as: 'publicaciones' });

// Usuario: relación de seguidores/seguidos entre usuarios.
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
Imagen.hasMany(Voto, { foreignKey: 'id_imagen', as: 'votos' });

// ─── Comentarios ────────────────────────────────────────
Comentario.belongsTo(Usuario, { foreignKey: 'id_comentador', as: 'comentador' });
Comentario.belongsTo(Imagen, { foreignKey: 'id_imagen' });
Imagen.hasMany(Comentario, { foreignKey: 'id_imagen', as: 'comentarios' });
