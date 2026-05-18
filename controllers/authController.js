const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

const mostrarRegistro = (req, res) => {
    res.render('registro');
};

const registrar = async (req, res) => {
    const { nombre, apellido, correo, contrasena, sexo, fecha_nacimiento, bio } = req.body;
    try {
        const existe = await Usuario.findOne({ where: { correo } });
        if (existe) {
            return res.render('registro', { error: 'El correo ya está registrado' });
        }
        const hash = await bcrypt.hash(contrasena, 10);
        await Usuario.create({
            nombre,
            apellido,
            correo,
            contrasena: hash,
            sexo: sexo || null,
            fecha_nacimiento: fecha_nacimiento || null,
            bio: bio || null,
            estado: 'activo',
            fecha_creacion: new Date()
        });
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.render('registro', { error: 'Error al registrar usuario' });
    }
};

const mostrarLogin = (req, res) => {
    res.render('login');
};

const login = async (req, res) => {
    const { correo, contrasena } = req.body;
    try {
        const usuario = await Usuario.findOne({ where: { correo } });
        if (!usuario) {
            return res.render('login', { error: 'Correo o contraseña incorrectos' });
        }
        const valido = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!valido) {
            return res.render('login', { error: 'Correo o contraseña incorrectos' });
        }
        req.session.usuario = {
            id: usuario.id_usuario,
            nombre: usuario.nombre,
            es_moderador: usuario.es_moderador
        };
        res.redirect('/home');
    } catch (error) {
        console.error(error);
        res.render('login', { error: 'Error al iniciar sesión' });
    }
};

module.exports = { mostrarRegistro, registrar, mostrarLogin, login };