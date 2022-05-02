'use Strict';

const Contenedor = require('./class/Contenedor.js');    // Importar la clase Contenedor
const { Producto, ProductoCarrito } = require('./class/Producto.js');        // Importar la clase Producto
const Carrito = require('./class/Carrito.js');          // Importar la clase Carrito

const apiProductos = new Contenedor('productos.json');  // Crear el contenedor de productos.
apiProductos.guardarArchivo();

const carrito = new Carrito('./carrito.json');          // Crear el contenedor de carritos.
carrito.guardarArchivo();





// Funcion opcional para mostrar los productos de forma manual.
const arrproductos = []; // Arreglo para guardar los productos

// Crear nuevos productos
arrproductos.push(new Producto(1, 'Laptop', 'Laptop HP', 'LAP-001', 'laptop.jpg', '1000', '10', 'Electronicos'));
arrproductos.push(new Producto(2, 'Laptop', 'Laptop Lenovo', 'LAP-002', 'laptop.jpg', '2000', '10', 'Electronicos'));
arrproductos.push(new Producto(3, 'Laptop', 'Laptop Asus', 'LAP-003', 'laptop.jpg', '3000', '10', 'Electronicos'));
arrproductos.push(new Producto(4, 'Laptop', 'Laptop Acer', 'LAP-004', 'laptop.jpg', '4000', '10', 'Electronicos'));

// Funcion para guardar los productos en el archivo
function guardarProductos(arr) {
    for (const objeto of arr) {
        apiProductos.save(objeto);
    }
}
guardarProductos(arrproductos); // Prueba para guardar los productos en el archivo productos.json






const express = require('express');
const handlebars = require('express-handlebars');
const { Router } = express;

const app = express();      // Crear una instancia de express
const PORT = 8080;          // Puerto en el que se va a correr el servidor
const router = Router();    // Crear una instancia de Router


app.engine(
    "hbs", 
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + "/views/layouts",
        partialsDir: __dirname + "/views/partials/"
    })
);

app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api', router);
app.use(express.static('public'));

app.get('/', async (req, res) => {
    res.render('main');
});

app.get('/form-productos', async (req, res) => {
    res.render('addProducto');
});

app.get('/productos', async (req, res) => {
    res.render('productos', { productos: await apiProductos.getAll() });
});

/*
    Router de productos
*/
router.get('/productos/:id', async (req, res) => {
    let id = req.params.id;
    if (id) {
        const producto = await apiProductos.getById(id);
        res.json(producto);
    } else {
        const productos = await apiProductos.getAll();
        res.json(productos);
    }
});
router.post('/productos', async (req, res) => {
    const producto = new Producto(
        req.body.id,
        req.body.nombre,
        req.body.descripcion,
        req.body.codigo,
        req.body.foto,
        req.body.precio,
        req.body.stock,
        req.body.categoria
    );
    apiProductos.save(producto);
    res.json(producto);
});
router.put('/productos/:id', async (req, res) => {
    let id = req.params.id;
    let producto = req.body;
    await apiProductos.update(id, producto);
    res.json(producto);
});
router.delete('/productos/:id', async (req, res) => {
    let id = req.params.id;
    await apiProductos.deleteById(id);
    res.json({success: true});
});


/*
    Router del carrito
*/
router.post('/carrito', (req, res) => {
    let newCarrito = carrito.create();

    (async () => {
            await newCarrito
            .then( (carrito) => res.json({id: carrito, success: true}) )
            .catch( (error) => res.json({error: error, success: false}) )
        }
    )();
});
// Funcion para eliminar un carrito por su id
router.delete('/carrito/:id', async (req, res) => {
    let id = req.params.id;
    await carrito.deleteById(id);
    res.json({success: true});
});
// Funcion para listar los productos de un carrito por su id
router.get('/carrito/:id/productos', async (req, res) => {
    let id = req.params.id;
    const productos = await carrito.getProductos(id);
    res.json(productos);
});
// Funcion para incorporar productos al carrito por su id de carrito y de producto
router.post('/carrito/:id/productos', async (req, res) => {
    // Usar la clase ProductoCarrito para crear un nuevo producto carrito
    const productoCarrito = new ProductoCarrito(
        req.body.id,
        req.body.nombre,
        req.body.descripcion,
        req.body.codigo,
        req.body.foto,
        req.body.precio,
        req.body.categoria
    );
    // Si falta algún parametro, se cancela la operación y retorna un error(falta algun parametro)
    if (!productoCarrito.id || !productoCarrito.timestamp || !productoCarrito.nombre || !productoCarrito.descripcion || !productoCarrito.codigo || !productoCarrito.foto || !productoCarrito.precio || !productoCarrito.categoria) {
        res.json({error: 'Falta algún parametro', success: false});
    }
    // Si todos los parametros están presentes, se procede a guardar el producto carrito en el carrito
    let id = req.params.id;
    // Si el id del producto existe en el carrito se usa el metodo addCantidad
    if (await carrito.getProducto(id, productoCarrito.id)) {
        await carrito.addCantidad(id, productoCarrito.id);
    } else {
        await carrito.addProducto(id, productoCarrito);
    }
    res.json(productoCarrito);
});
// Funcion para eliminar un producto del carrito por su id de carrito y de producto
router.delete('/carrito/:id/productos/:id_prod', async (req, res) => {
    let id = req.params.id;
    let id_prod = req.params.id_prod;
    await carrito.deleteProducto(id, id_prod);
    res.json({success: true});
});


const server = app.listen(PORT, () => console.log('Servidor corriendo en el puerto ' + PORT));
server.on('error', (err) => console.log(err));