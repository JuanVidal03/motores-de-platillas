// requerimos express y su configuración
const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// creando una instancia dela clase contenedor
const Contenedor = require('./Contenedor.js');
const productos = new Contenedor('productos.json');

// configuracion de ejs
const ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('views', './views');


// ruta principal donde esta el formmulario
app.get('/', (req, res) => {

    try {
        res.render('./pages/index.ejs');

    } catch (error) {
        res.json({ error: `Hubo un error: ${error}.` });
    }

});


// accediendo a todos los productos
app.get('/productos', async(req, res) => {

    try {
        const allProducts = await productos.getAll();
        res.render('./pages/productos.ejs', { productos: allProducts});
    } catch (error) {
        res.json({ error: `Hubo un error: ${error}.` });
    }
});


// añadiendo productos
app.post('/productos', async(req, res) => {

    try {
        const body = req.body;
        await productos.save(body);
        res.redirect('/');
        
    } catch (error) {
        res.json({ error: `Hubo un error: ${error}.` });
    }

});


// iniciando el server y mapeo de errores
const server = app.listen(PORT, () => {
    console.log(`El servidor está escuchando el puerto: ${server.address().port}`);
});
server.on('error', error => console.log(`Error en el seridor: ${error}`));