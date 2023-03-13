const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const userGet = async (req, res) => {
    const {limit = 5, from = 0} = req.query;
    const query = {estado: true};

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
        .skip(Number(from))
        .limit(Number(limit))
    ])

    res.json({
        total,
        users
    });
}

const userPut = async (req, res) => {
    const { id } = req.params;
    const {_id, password, google, ...resto} = req.body;

    if (password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, resto, {new: true});

    res.json(user);
}

const userPost = async (req, res) => {
    const { nombre, mail, password, rol } = req.body;
    const user = new User({nombre, mail, password, rol});

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);
    // Guardar en DB
    await user.save();

    res.status(200).json(user);
}

const userDelete = async (req, res) => {
    const {id} = req.params;

    // Para borrarlo físicamente
    // const user = await User.findByIdAndDelete(id);

    const user = await User.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json(user);
}

module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete
}