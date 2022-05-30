class Producto {
    constructor(id, nombre, descripcion, codigo, imagen, precio, stock, categoria) {
        this.id = parseInt(id);
        this.timestamp = this.getDate();
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.codigo = codigo;
        this.imagen = imagen;
        this.precio = parseFloat(precio);
        this.stock = parseInt(stock);
        this.categoria = categoria;
    }

    getDate() {
        let fecha = new Date();
        let fechaActual = (fecha.getMonth() + 1) + "/" + fecha.getDate() + "/" + fecha.getFullYear();
        let hora = fecha.getHours() + ':' + fecha.getMinutes();
        let fechaFinal = fechaActual + ' ' + hora;
        return fechaFinal;
    }
}

// Exportar la class Contenedor
class ProductoCarrito {
    constructor(id, nombre, descripcion, codigo, imagen, precio, categoria) {
        this.id = parseInt(id);
        this.timestamp = this.getDate();
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.codigo = codigo;
        this.imagen = imagen;
        this.precio = parseFloat(precio);
        this.categoria = categoria;
        this.cantidad = 1;
    }

    getDate() {
        let fecha = new Date();
        let fechaActual = (fecha.getMonth() + 1) + "/" + fecha.getDate() + "/" + fecha.getFullYear();
        let hora = fecha.getHours() + ':' + fecha.getMinutes();
        let fechaFinal = fechaActual + ' ' + hora;
        return fechaFinal;
    }

    // addCantidad: (cantidad) -> Agrega una cantidad a la cantidad del producto.
    addCantidad() {
        this.cantidad++;
    }
}

// Exportar las clases
module.exports = {
    Producto,
    ProductoCarrito
}