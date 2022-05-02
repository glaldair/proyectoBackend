// Crear una clase Contenedor que tenga una propiedad nombre
const fs = require('fs');

class Contenedor {
    constructor(nombreArchivo) {
        this.nombre = nombreArchivo;
        this.productos = [];
    }

    // save(Object): Number - Llama al archivo y guarda el objeto que recibe, devuelve el id asignado al objeto.
    async save(Object) {
        // Si el id ya existe se cancela la operación y se devuelve un objeto { error: 'id ya existe' }
        let json = await this.leerArchivo();
        let obj = json.find(obj => obj.id == Object.id);
        if(obj){
            return { error: 'id ya existe' };
        }
        await this.productos.push(Object);
        await this.guardarArchivo();
        return Object;
    }
    // getById(Number): Object - Llama al archivo y devuelve el objeto con el id que recibe, o { error: 'producto no encontrado' } si no existe.
    async getById(Number){
        let json = await this.leerArchivo();
        let obj = json.find(obj => obj.id == Number);
        if(!obj){
            return { error : 'producto no encontrado' };
        }
        return obj;
    }
    // getAll(): Array - Devuelve un array con todos los objetos almacenados en el archivo.
    async getAll() {
        let json = await this.leerArchivo();
        return json;
    }
    // deleteById(Number): Void - Llama al archivo y elimina el objeto completamente del archivo con el id que recibe.
    async deleteById(Number) {
        let json = await this.productos;
        let obj = json.find(obj => obj.id == Number);
        if(!obj){
            return { error : 'producto no encontrado' };
        }
        let index = json.indexOf(obj);
        json.splice(index, 1);
        await this.guardarArchivo();
    }
    // Crear un método que modifique un producto por id y devuelva el objeto modificado.
    async update(Number, Object) {
        let json = await this.productos;
        let obj = json.find(obj => obj.id == Number);
        if(!obj){
            return { error : 'producto no encontrado' };
        }
        let index = json.indexOf(obj);
        json[index] = Object;
        await this.guardarArchivo();
        return Object;
    }

    // get(): Array - Devuelve un objeto con el ultimo producto agregado.
    async get() {
        let json = await this.productos;
        return json[json.length - 1];
    }


    // Crear métodos generales: guardarArchivo, leerArchivo.
    async guardarArchivo() {
        let json = await JSON.stringify(this.productos);
        await fs.writeFileSync(this.nombre, json);
    }
    async leerArchivo() {
        let json = await fs.readFileSync(this.nombre, 'utf-8');
        return JSON.parse(json);
    }
}

module.exports = Contenedor;