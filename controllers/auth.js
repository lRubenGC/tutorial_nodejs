const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const generarJWT = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res) => {
    const {mail, password} = req.body;

    try {
        const user = await User.findOne({mail});
        // Si mail no existe
        if (!user) {
            return res.status(400).json({
                msg: 'Mail / Password no son correctos - mail'
            })
        }
        // Si el usuario está inactivo
        if (!user.estado) {
            return res.status(400).json({
                msg: 'Mail / Password no son correctos - estado: false'
            })
        }
        // Contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Mail / Password no son correctos - password'
            })
        }
        // JWT
        const token = await generarJWT(user.id);

        res.json({
            user,
            token
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Contacte con el administrador'
        })
    }
}

const googleSignIn = async (req, res) => {
    const { id_token } = req.body;

    try {
        const { nombre, mail, img } = await googleVerify(id_token);

        let user = await User.findOne({mail});

        if (!user) {
            const data = {
                nombre,
                mail,
                password: 'pepe',
                img,
                rol: 'USER_ROLE',
                google: true
            };

            user = new User(data);
            await user.save();
        }

        if (!user.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador - Usuario bloqueado'
            })
        }

        const token = await generarJWT(user.id);

        res.json({
            user,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

}

module.exports = {
    login,
    googleSignIn
}