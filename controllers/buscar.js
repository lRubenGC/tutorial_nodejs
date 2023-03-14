const { ObjectId } = require('mongoose').Types;

const { User, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]; 

const buscarUsuarios = async (termino = '', res) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const user = await User.findById(termino);
        return res.json({
            results: (user) ? [user]: []
        })
    }

    const regex = new RegExp(termino, 'i');

    const users = await User.find({
        $or: [{nombre: regex}, {mail: regex}],
        $and: [{estado: true}]
    });
    
    res.json({results: users})
}

const buscarCategorias = async (termino = '', res) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria]: []
        })
    }

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({nombre: regex, estado: true});

    res.json({results: categorias})
}

const buscarProductos = async (termino = '', res) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto]: []
        })
    }

    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({nombre: regex, estado: true})
        .populate('categoria', 'nombre');

    res.json({results: productos})
}

const buscar = (req, res) => {
    const {coleccion, termino} = req.params;
    
    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
    
        default:
            res.status(500).json({
                msg: 'Se me olvidó hacer esta búsqueda'
            })
            break;
    }
}

module.exports = {
    buscar
}