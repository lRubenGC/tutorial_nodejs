const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');
const { obtenerCategorias, obtenerCategoria, crearCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

// Obtener todas las categorias - público
router.get('/', obtenerCategorias);

// Obtener una categoría por id - público
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);

// Crear una categoría - privado (cualquier persona con un token válido)
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar una categoría - privado (cualquier persona con un token válido)
router.put('/:id', [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    check("nombre", "Nombre no válido").not().isEmpty(),
    validarCampos,
], actualizarCategoria);

// Eliminar una categoría - admin
router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    esAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
], borrarCategoria);


module.exports = router;