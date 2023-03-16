const { Categoria, Role, User, Producto } = require('../models');


const esRoleValido = async (role = '') => {
    const existeRol = await Role.findOne({role});
    if (!existeRol) {
        throw new Error(`El rol ${role} no está registrado en la DB`);
    }
}

const emailExiste = async (mail = '') => {
    const mailExists = await User.findOne({mail});
    if (mailExists) {
        throw new Error(`El mail ${mail} ya está en uso`);
    }
}

const existeUsuarioPorId = async (id) => {
    const userExists = await User.findById(id);
    if (!userExists) {
        throw new Error(`El id ${id} no existe`);
    }
}

const esRoleValidoPut = async (role) => {
    if (!role) {
        return;
    }
    const existeRol = await Role.findOne({role});
    if (!existeRol) {
        throw new Error(`El rol ${role} no está registrado en la DB`);
    }
}

const existeCategoriaPorId = async (id) => {
    const categoriaExists = await Categoria.findById(id);
    if (!categoriaExists) {
        throw new Error(`El id ${id} no existe`);
    }
}

const existeProductoPorId = async (id) => {
    const productoExists = await Producto.findById(id);
    if (!productoExists) {
        throw new Error(`El id ${id} no existe`);
    }
}

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no está permitida. Permitidas: ${colecciones}`);
    }

    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeCategoriaPorId,
    existeProductoPorId,
    existeUsuarioPorId,
    esRoleValidoPut,
    coleccionesPermitidas
};