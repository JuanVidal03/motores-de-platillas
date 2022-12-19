// requerimos express y su configuración
const express = require('express');
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// creando una instancia dela clase contenedor
const Contenedor = require('./Contenedor.js');
const productos = new Contenedor('productos.json');

// configuración handlebars
const handlebars = require('express-handlebars');
const hbs = handlebars.create({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutDir: __dirname + './views/layouts'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');



// metodo que renderiza el main
app.get('/', (req, res) => {

    try {
        res.render('main')
    } catch (error) {
        res.json({ error: `Ha ocurrido un error: ${res.statusCode}` })
    }
});


// accediendo a todos los productos
app.get('/productos', async(req, res) => {

    try {
        const allProducts = await productos.getAll();
        res.render("productos", { products: allProducts });

    } catch (error) {
        res.json({error: 'Ha ocurrido un error al subir los productos.'})
    }

});


// añadiendo productos
app.post('/productos', async(req, res) => {

    try {
        const body = req.body;
        await productos.save(body);
        res.redirect('/');

    } catch (error) {
        res.json({ error: 'Ha ocurrido un error.' })
    }

});


// iniciando el server y mapeo de errores
const server = app.listen(PORT, () => {
    console.log(`El servidor está escuchando el puerto: ${server.address().port}`);
});
server.on('error', error => console.log(`Error en el seridor: ${error}`));