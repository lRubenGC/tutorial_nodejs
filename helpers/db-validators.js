const { Categoria, Role, User } = require('../models');


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

module.exports = {
    esRoleValido,
    emailExiste,
    existeCategoriaPorId,
    existeUsuarioPorId,
    esRoleValidoPut
};