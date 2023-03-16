const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require('express');

const { subirArchivo } = require('../helpers');
const { User, Producto } = require('../models')

const cargarArchivo = async (req, res = response) => {  
    try {
        // txt, md
        // const nombreArchivo = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        const nombreArchivo = await subirArchivo(req.files, undefined, 'imgs');
        res.json({
            nombre: nombreArchivo
        })
    } catch ( err ) {
        return res.status(400).json({msg: err})
    }

}

const actualizarArchivo = async (req, res = response) => {
    const {coleccion, id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({msg: `No existe un usuario con el ID ${id}`})
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({msg: `No existe un producto con el ID ${id}`})
            }
            break;
    
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'})
    }

    // Limpiar imágenes previas
    if (modelo.img) {
        // Borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }
    
    const nombreArchivo = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = await nombreArchivo;
    
    await modelo.save();

    res.json(modelo);
}

const mostrarImagen = async (req, res = response) => {
    const {coleccion, id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({msg: `No existe un usuario con el ID ${id}`})
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({msg: `No existe un producto con el ID ${id}`})
            }
            break;
    
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'})
    }

    // Limpiar imágenes previas
    if (modelo.img) {
        // Borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    const pathNoImage = path.join(__dirname, '../assets/no-image.jpg');
    return res.sendFile(pathNoImage);
}

const actualizarImagenCloudinary = async (req, res = response) => {
    const {coleccion, id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({msg: `No existe un usuario con el ID ${id}`})
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({msg: `No existe un producto con el ID ${id}`})
            }
            break;
    
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'})
    }

    // Limpiar imágenes previas
    if (modelo.img) {
        // Borrar la imagen de cloudinary
        const nombreArr = modelo.img.split("/");
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split(".");

        cloudinary.uploader.destroy(public_id);
    }
    
    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;
    
    await modelo.save();

    res.json(modelo);
}

module.exports = {
    cargarArchivo,
    actualizarArchivo,
    mostrarImagen,
    actualizarImagenCloudinary
};