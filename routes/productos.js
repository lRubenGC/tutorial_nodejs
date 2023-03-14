const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

// Obtener todas las Productos - público
router.get('/', obtenerProductos);

// Obtener un producto por id - público
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

// Crear un producto - privado (cualquier persona con un token válido)
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('estado', 'El estado debe ser booleano').isBoolean(),
    check('precio', 'Precio no válido').optional().not().isEmpty(),
    check('precio', 'El precio debe ser un número').optional().isNumeric(),
    check('categoria', 'No es un ID válido').isMongoId(),
    check("categoria").custom(existeCategoriaPorId),
    check('descripcion', 'Descripción no válida').optional().not().isEmpty(),
    check('disponible', 'Disponibilidad no válida').optional().isBoolean(),
    validarCampos
], crearProducto);

// Actualizar un producto - privado (cualquier persona con un token válido)
router.put('/:id', [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeProductoPorId),
    check('categoria', 'No es un ID válido').optional().isMongoId(),
    check("categoria").optional().custom(existeCategoriaPorId),
    validarCampos,
], actualizarProducto);

// Eliminar una producto - admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
], borrarProducto);


module.exports = router;