// iniciando modulo fs de node
const fs = require('fs');

//inicio clase contenedor
class Contenedor {

    constructor(path){
        this.path = path;
    }

    // metodo para obtener todos los productos
    async getAll(){
        try {
            
            const objs = await fs.promises.readFile(`${this.path}`, 'utf-8', err => {
                if(err){
                    console.log(err);
                }
            });
            return JSON.parse(objs);


        } catch (err) {
            console.log(`ERROR: ${err}`);
            return [];
        }
    }

    // guardando los productos
    async save(objeto){

        const objects = await this.getAll();
        let newId;

        // con esto se define el id que el elemento va a tener
        if (objects.length == 0) {
            newId = 1
        } else {
            newId = objects[objects.length-1].id+1;
        }

        // creamos el objeto definitivo y lo pusheamos al array contenedor
        const newObject = {...objeto, id: newId};
        objects.push(newObject);

        try{
            await fs.promises.writeFile(`${this.path}`, JSON.stringify(objects, null, 2));
            console.log('Producto añadido exitosamente!');
            // return newId;

        } catch(err) {
            throw new Error(`Errar al guardar: ${err}`)
        }
    }

    // obteniendo un producto por id
    async getById(id){

        try {
            
            await this.getAll()
                .then((res) => {

                    if(res.find(element => element.id == id)){

                        const objeto = res.find(ele => ele.id == id);
                        console.log(objeto);
                        return objeto;
 
                     } else {
                        return { error: 'Producto no encontrado' }
                         console.log(null);
                     }

                })

        } catch (err) {
            console.log(`ERROR: ${err}`);
        }
    }

    // eliminando objto por id
    async deleteById(id){

        try {
            await this.getAll()
                .then(async (res) => {
                    
                    if(res.find(element => element.id === id)){

                       const index = res.findIndex(ele => ele.id === id);
                       const indice = index;
                       res.splice(indice, 1);
                        await fs.promises.writeFile(`${this.path}`, JSON.stringify(res, null, 2));
                        console.log('Producto eliminado exitosamente!');

                    } else {
                        console.log(`El producto con el id: ${id} no existe.`);
                    }

                })
                .catch((err) => {
                    console.log(err);
                })

        } catch (err) {
            console.log(`ERROR, ${err}`);
        }

    }

    // eliminando todos los elementos
    async deleteAll(){

        try {
            await fs.promises.writeFile(`${this.path}`, '')
            console.log('Archivo modificado con exito!');
        } catch (err) {
            console.log(err);
        }

    }
}

// exportando la clase Contenedor
module.exports = Contenedor;