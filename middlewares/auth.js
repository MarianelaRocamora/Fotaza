const soloRegistrados = (req, res, next) => {
    if (!req.session.usuario) {
        return res.redirect('/login?error=Debés iniciar sesión para realizar esa acción');
    }
    next();
};

module.exports = { soloRegistrados };