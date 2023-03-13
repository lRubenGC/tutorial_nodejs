const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validarJWT = async (req, res, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        userAutenticado = await User.findById(uid);

        if(!userAutenticado) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe'
            })
        }
        
        // Verificar si el user está activo
        if (!userAutenticado.estado) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario de baja'
            })
        }
        
        req.user = userAutenticado;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })   
    }
}

module.exports = {
    validarJWT
}