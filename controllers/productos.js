const { Producto } = require('../models');

const obtenerProductos = async (req, res) => {
    const {limit = 5, from = 0} = req.query;
    const query = {estado: true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('user', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(from))
            .limit(Number(limit))
    ])

    res.json({
        total,
        productos
    });
}

const obtenerProducto = async (req, res) => {
    const {id} = req.params;

    productoDB = await Producto.findById(id)
        .populate('user', 'nombre')
        .populate('categoria', 'nombre');
        
    res.json(productoDB);
}

const crearProducto = async (req, res) => {
    const {estado, user, ...body} = req.body;
    body.nombre = body.nombre.toUpperCase();

    const productoDB = await Producto.findOne({nombre: body.nombre})

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }

    // Generar la data a guardar
    const data = {
        ...body,
        user: req.user._id,
    }

    const producto = new Producto(data);

    await producto.save();

    res.status(201).json(producto)
}

const actualizarProducto = async (req, res) => {
    const {id} = req.params;
    const {estado, user, ...data} = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.user = req.user._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true})
        .populate('user', 'nombre')
        .populate('categoria', 'nombre');

    res.json(producto);
}

const borrarProducto = async (req, res) => {
    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});
    
    res.json(producto)
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}