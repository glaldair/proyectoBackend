const fs = require('fs');

class Carrito {
    constructor(nombre) {
        this.nombre = nombre;
        this.apiCarrito = [];
    }

    // save: Crear un nuevo carrito(array de productos) dentro de la apiCarrito y devuelve su id.
    async create() {
        let id = Math.floor(Math.random() * 1000);
        let fecha = new Date();
        let fechaActual = (fecha.getMonth() + 1) + "/" + fecha.getDate() + "/" + fecha.getFullYear();
        let hora = fecha.getHours() + ':' + fecha.getMinutes();
        this.apiCarrito.push(
            {
                id: id,
                timestamp: fechaActual + " " + hora,
                productos: []
            }
        )
        await this.guardarArchivo();
        return id;
    }

    // delete: Vacia un carrito y lo elimina por su id.
    async deleteById(id) {
        this.apiCarrito = this.apiCarrito.filter(c => c.id != id);
        await this.guardarArchivo();
    }

    // getAll: (id) -> Me permite listar los productos guardados en el carrito(id).
    async getProductos(id) {
        let setCarrito = this.apiCarrito.find(c => c.id == id);
        let productos = setCarrito.productos;
        return productos;
    }

    // getProducto: (id, id_prod) -> Devuelve un producto del carrito(id) por su id de producto.
    async getProducto(id, id_prod) {
        let carrito = this.apiCarrito.find(c => c.id == id);
        let producto = carrito.productos.find(p => p.id == id_prod);
        return producto;
    }

    // saveProducto: (object) -> Crea un nuevo producto dentro del carrito(id) y lo guarda.
    async addProducto(id, producto) {
        let carrito = this.apiCarrito.find(c => c.id == id);
        // Si el id del producto ya existe en el carrito, no se agrega.
        let productos = carrito.productos;
        let existe = productos.find(p => p.id == producto.id);
        if (!existe) {
            productos.push(producto);
        }
        carrito.productos = productos;
        await this.guardarArchivo();
        return producto;
    }

    // addCantidad: (id, id_prod) -> Agrega una cantidad a la cantidad del producto.
    async addCantidad(id, id_prod) {
        let carrito = this.apiCarrito.find(c => c.id == id);
        let producto = carrito.productos.find(p => p.id == id_prod);
        producto.cantidad++;
        await this.guardarArchivo();
        return producto;
    }
        
    // deleteProducto: (id, id_prod) -> Elimina un producto del carrito(id) por su id de producto.
    async deleteProducto(id, id_prod) {
        let carrito = this.apiCarrito.find(c => c.id == id);
        let productos = carrito.productos;
        productos = productos.filter(p => p.id != id_prod);
        carrito.productos = productos;
        await this.guardarArchivo();
    }
    

    // guardarArchivo: Crea un nuevo archivo y guarda el carrito en el archivo.
    async guardarArchivo() {
        let json = JSON.stringify(this.apiCarrito);
        await fs.writeFileSync(this.nombre, json);
    }
    // leerArchivo: Lee el archivo carrito.json y lo guarda en el atributo carrito.
    async leerArchivo() {
        let json = await fs.readFileSync(this.nombre, 'utf-8');
        return JSON.parse(json);
    }
}

module.exports = Carrito;