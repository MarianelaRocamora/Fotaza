require('dotenv').config();
const sequelize = require('./sequelize');
const bcrypt = require('bcrypt');

const Usuario         = require('../models/Usuario');
const Publicacion     = require('../models/Publicacion');
const Etiqueta        = require('../models/etiqueta');
const Imagen          = require('../models/Imagen');
const Voto            = require('../models/Voto');
const Comentario      = require('../models/Comentario');
const UsuarioSeguidor = require('../models/UsuarioSeguidor');

sequelize.define('publicacion_etiqueta', {}, {
    tableName: 'publicacion_etiqueta',
    timestamps: false,
});

async function init() {
    try {
        console.log('🔄 Conectando a PostgreSQL...');
        await sequelize.authenticate();
        console.log('✅ Conexión establecida.');

        console.log('🔄 Sincronizando modelos...');
        await sequelize.sync({ force: false });

        // Tabla session para connect-pg-simple
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS "session" (
                "sid" varchar NOT NULL COLLATE "default",
                "sess" json NOT NULL,
                "expire" timestamp(6) NOT NULL,
                CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
            );
        `);
        await sequelize.query(`
            CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
        `);

        // Columna datos BYTEA para imágenes
        await sequelize.query(`
            ALTER TABLE imagen ADD COLUMN IF NOT EXISTS datos BYTEA;
        `);

        console.log('✅ Tablas listas.');

        // Solo inserta si la BD está vacía
        const yaHayUsuarios = await Usuario.count();
        if (yaHayUsuarios > 0) {
            console.log('ℹ️  Ya existen datos, se omite el seed.');
            console.log('\n👤 Usuarios de prueba:');
            console.log('   Moderador → admin@fotaza.com   / admin123');
            console.log('   Usuario 1 → juan@fotaza.com    / juan123');
            console.log('   Usuario 2 → maria@fotaza.com   / maria123');
            console.log('   Usuario 3 → lucas@fotaza.com   / lucas123');
            return;
        }

        console.log('🔄 Insertando usuarios de prueba...');
        const hash = (pw) => bcrypt.hash(pw, 10);

        await Usuario.bulkCreate([
            {
                nombre: 'Admin', apellido: 'Fotaza',
                correo: 'admin@fotaza.com',
                contrasena: await hash('admin123'),
                es_moderador: true, estado: 'activo',
                bio: 'Moderador.'
            },
            {
                nombre: 'Juan', apellido: 'Pérez',
                correo: 'juan@fotaza.com',
                contrasena: await hash('juan123'),
                es_moderador: false, estado: 'activo',
                bio: 'Fotógrafo. Me gustan los paisajes y la naturaleza.'
            },
            {
                nombre: 'María', apellido: 'González',
                correo: 'maria@fotaza.com',
                contrasena: await hash('maria123'),
                es_moderador: false, estado: 'activo',
                bio: 'Apasionada por la fotografía urbana y los retratos.'
            },
            {
                nombre: 'Lucas', apellido: 'Rodríguez',
                correo: 'lucas@fotaza.com',
                contrasena: await hash('lucas123'),
                es_moderador: false, estado: 'activo',
                bio: 'Me gusta la fotografía de naturaleza y viajes.'
            },
        ]);

        console.log('✅ Usuarios creados.');
        console.log('\n🎉 Base de datos inicializada correctamente.');
        console.log('\n👤 Usuarios de prueba:');
        console.log('   Moderador → admin@fotaza.com   / admin123');
        console.log('   Usuario 1 → juan@fotaza.com    / juan123');
        console.log('   Usuario 2 → maria@fotaza.com   / maria123');
        console.log('   Usuario 3 → lucas@fotaza.com   / lucas123');
        console.log('\n▶️  Ejecutá "npm start" para iniciar la app.');

    } catch (error) {
        console.error('❌ Error al inicializar la BD:', error);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

init();