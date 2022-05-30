let admin = require("firebase-admin");
let serviceAccount = require("../db/backend-74374-firebase-adminsdk-megli-eec088cfa2.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

class ContenedorFB {
    constructor(name) {
        this.name = name;
    }

    // save: (producto) -> Guarda el producto en el servidor
    async save(producto) {
        const productosCollection = db.collection(this.name);
        let id = producto.id;
        let doc = await productosCollection.doc(`${id}`);
        await doc.create(producto);

        return producto;
    }

    // getAll: () -> Retorna todos los productos
    async getAll() {
        const productosCollection = db.collection(this.name);
        let productos = [];
        let docs = await productosCollection.get();
        docs.forEach(doc => {
            productos.push(doc.data());
        });
        return productos;
    }

    // getById: (id) -> Retorna el producto con el id dado
    async getById(id) {
        const productosCollection = db.collection(this.name);
        let doc = await productosCollection.doc(`${id}`).get();
        return doc.data();
    }

    // update: (id, producto) -> Actualiza el producto con el id dado
    async update(id, producto) {
        const productosCollection = db.collection(this.name);
        let doc = await productosCollection.doc(`${id}`);
        await doc.update(producto);
        return producto;
    }

    // deleteById: (id) -> Elimina el producto con el id dado
    async deleteById(id) {
        const productosCollection = db.collection(this.name);
        let doc = await productosCollection.doc(id)
        await doc.delete();
        return { success: true };
    }
}

module.exports = ContenedorFB;