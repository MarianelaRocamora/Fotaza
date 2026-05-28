require('dotenv').config();
const sequelize = require('./sequelize');

// Importar modelos directamente (sin pasar por asociaciones)
const Usuario     = require('../models/Usuario');
const Publicacion = require('../models/Publicacion');
const Etiqueta    = require('../models/Etiqueta');
const Imagen      = require('../models/Imagen');
const Voto        = require('../models/Voto');
const Comentario  = require('../models/Comentario');
const UsuarioSeguidor = require('../models/UsuarioSeguidor');
const bcrypt = require('bcrypt');

// Tabla intermedia sin timestamps
sequelize.define('publicacion_etiqueta', {}, {
    tableName: 'publicacion_etiqueta',
    timestamps: false
});

async function init() {
    try {
        console.log('🔄 Conectando a PostgreSQL...');
        await sequelize.authenticate();
        console.log('✅ Conexión establecida.');

        console.log('🔄 Sincronizando modelos (ALTER)...');
        await sequelize.sync({ alter: true });
        console.log('✅ Tablas sincronizadas.');

        // ─── Usuarios de prueba ──────────────────────────────
        const yaHayUsuarios = await Usuario.count();
        if (yaHayUsuarios === 0) {
            console.log('🔄 Insertando usuarios de prueba...');

            const hash = (pw) => bcrypt.hash(pw, 10);

            await Usuario.bulkCreate([
                {
                    nombre:   'Admin',
                    apellido: 'Fotaza',
                    email:    'admin@fotaza.com',
                    password: await hash('admin123'),
                    rol:      'moderador',
                    activo:   true
                },
                {
                    nombre:   'Juan',
                    apellido: 'Pérez',
                    email:    'juan@fotaza.com',
                    password: await hash('juan123'),
                    rol:      'usuario',
                    activo:   true
                },
                {
                    nombre:   'María',
                    apellido: 'González',
                    email:    'maria@fotaza.com',
                    password: await hash('maria123'),
                    rol:      'usuario',
                    activo:   true
                }
            ]);

            console.log('✅ Usuarios creados.');
        } else {
            console.log('ℹ️  Ya existen usuarios, se omite seed de usuarios.');
        }

        console.log('\n🎉 Base de datos inicializada correctamente.');
        console.log('\n👤 Usuarios de prueba:');
        console.log('   Moderador → admin@fotaza.com  / admin123');
        console.log('   Usuario 1 → juan@fotaza.com   / juan123');
        console.log('   Usuario 2 → maria@fotaza.com  / maria123');
        console.log('\n▶️  Ejecutá "npm start" para iniciar la app.');

    } catch (error) {
        console.error('❌ Error al inicializar la BD:', error);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

init();