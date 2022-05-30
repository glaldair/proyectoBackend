const mongoose = require('mongoose');
const { productosModel } = require('../src/models/Productos.js');

class ContenedorMDB {
    constructor (name) {
        this.name = name;
    }

    // save: (0bject) -> Guarda el objeto producto
    async save (object) {

        let producto = new productosModel(object);
        await producto.save();
        return producto;

    }

    // getAll: () -> Retorna todos los productos
    async getAll () {
        return await productosModel.find();
    }

    // getById: (id) -> Retorna el producto con el id indicado
    async getById (id) {
        // Eliminar el _id del objeto
        let producto = await productosModel.find({id: id}, {_id: 0});

        if(producto.length == 0) {
            return {error: 'Producto no encontrado'};
        }

        return producto;
    }

    // update: (id, object) -> Actualiza el producto con el id indicado
    async update (id, object) {
        let producto = await productosModel.findOneAndUpdate({id: id}, object);
        return producto;
    }

    // deleteById: (id) -> Elimina el producto con el id indicado
    async deleteById (id) {
        let producto = await productosModel.findOneAndDelete({id: id}, {_id: 0});
        return producto;
    }

    // guardarArchivo: () -> Guarda el contenido del archivo en el servidor
    async guardarArchivo () {

        try {
            
            const URL = `mongodb://localhost:27017/${this.name}`;
            let rta = await mongoose.connect(URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Conectado a MongoDB');

        } catch (error) {
            console.log('Error al conectar a MongoDB' + error);
        }

    }
}

module.exports = ContenedorMDB;