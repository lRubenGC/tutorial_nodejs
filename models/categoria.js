const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: [true, 'El estado es obligatorio']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El user es obligatorio']
    },
});

CategoriaSchema.methods.toJSON = function() {
    const {__v, estado, ...data} = this.toObject();

    return data;
}

module.exports = model('Categoria', CategoriaSchema);