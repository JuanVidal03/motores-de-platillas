// requerimos express y su configuración
const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// creando una instancia dela clase contenedor
const Contenedor = require('./Contenedor.js');
const productos = new Contenedor('productos.json');

// configuración de pug
const pug = require('pug');
app.set('view engine', 'pug');
app.set('views', './views')



// formulario para añadir un nuevo productos
app.get('/', (req, res) => {

    try {
        res.render('index');
    } catch (error) {
        res.json({ error: `Hubo un error: ${error}.` })
    }
});


// accediendo a todos los productos
app.get('/productos', async(req, res) => {

    try {
        const allProducts = await productos.getAll();
        res.render('productos', { productos: allProducts });

    } catch (error) {
        res.json({ error: `Hubo un error: ${error}.` })
    }
});


// añadiendo productos
app.post('/productos', async(req, res) => {

    try {
        const body = req.body;
        await productos.save(body);
        res.redirect('/')
        
    } catch (error) {
        res.json({ error: `Hubo un error: ${error}.` })
    }

});


// iniciando el server y mapeo de errores
const server = app.listen(PORT, () => {
    console.log(`El servidor está escuchando el puerto: ${server.address().port}`);
});
server.on('error', error => console.log(`Error en el seridor: ${error}`));