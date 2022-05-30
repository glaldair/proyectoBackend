const mongoose = require('mongoose');
const productosCollection = "productos";

const ProductosSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    timestamp: { type: String, required: true },
    nombre: { type: String, required: true, maxlength: 100 },
    descripcion: { type: String, required: true, maxlength: 500 },
    codigo: { type: String, required: true, maxlength: 50 },
    imagen: { type: String, required: true, maxlength: 100 },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    categoria: { type: String, required: true, maxlength: 100 },
});

const productosModel = mongoose.model(productosCollection, ProductosSchema);

module.exports = {
    productosModel
}