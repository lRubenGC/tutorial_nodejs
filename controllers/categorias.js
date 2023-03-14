const { Categoria } = require('../models');

const obtenerCategorias = async (req, res) => {
    const {limit = 5, from = 0} = req.query;
    const query = {estado: true};

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('user', 'nombre')
            .skip(Number(from))
            .limit(Number(limit))
    ])

    res.json({
        total,
        categorias
    });
}

const obtenerCategoria = async (req, res) => {
    const {id} = req.params;

    categoriaDB = await Categoria.findById(id).populate('user', 'nombre');
    res.json(categoriaDB);
}

const crearCategoria = async (req, res) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        user: req.user._id
    }

    const categoria = new Categoria(data);

    await categoria.save();

    res.status(201).json(categoria)
}

const actualizarCategoria = async (req, res) => {
    const {id} = req.params;
    const {estado, user, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.user = req.user._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true})
        .populate('user', 'nombre');

    res.json(categoria);
}

const borrarCategoria = async (req, res) => {
    const {id} = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});
    
    res.json(categoria)
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}