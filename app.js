const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let noticias = [];
const PORT =3000;

// Leer datos desde el archivo JSON
function leerDatos() {
  try {
    const data = fs.readFileSync('noticias.json', 'utf-8');
    noticias = JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo noticias.json:', error.message);
  }
}

// Guardar datos en el archivo JSON
function guardarDatos() {
  fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
}

app.get('/', (req, res) => {
    leerDatos()
    res.send(` <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Listado de noticias</title>
    </head>
    <body>
       <h1>Indice de Noticias</h1>
       <ul>
       ${noticias.map(noticia => `<li>ID:${noticia.id}, ${noticia.titulo}</li>`).join('')}
       </ul>
       <nav>
            <a href="/noticias">Pulsa para ir a las noticias completas</a> 
        </nav>
       <p>Número de noticias: ${noticias.length}</p>
       </body>
    </html>`);
});


//!Partes del metodo CRUD

//Leer las noticias
app.get('/noticias', (req, res) => { 
    leerDatos()   
    res.json(noticias);
});

//Crear una nueva Noticia
app.post('/noticias', (req, res) => {
    
    const nuevaNoticia = {
      id: noticias.length + 1,
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      imagen: req.body.imagen,
      enlace: req.body.enlace,
    };
    noticias.push(nuevaNoticia);
    guardarDatos()
    res.redirect('/noticias');
});


//Buscar un usuario por ID
app.get('/noticias/:id', (req, res) => {    
    leerDatos()
    const buscarNoticia = noticias.find(noticia => noticia.id === parseInt(req.params.id));   //Hay que poner parseint porque noticia.id es un numero y params devualve un string
    if (!buscarNoticia) {
        return res.status(404).json({ mensaje: 'Noticia no encontrada' });
    }
    res.json(buscarNoticia);
});

//Actualizar los datos de una noticia.
app.put('/noticias/:id', (req, res) => {
    const index = noticias.findIndex(noticia => noticia.id === parseInt(req.params.id));   //Find index devuelve el index si existe o -1 si no existe por eso valido -1 en el if
    if (index !== -1) {    
      noticias[index] = { ...noticias[index], ...req.body };                               //me traigo el noticias[index] y le cambio los datos requeridos en req.body
      res.json(noticias);
    }
      res.status(404).json({ mensaje: 'Noticia no encontrada' });
    });

//Eliminar una noticia por id
app.delete('/noticias/:id', (req, res) => {                                         //elimina la noticia pasado como ID
     noticias=noticias.filter(noticia => noticia.id !== parseInt(req.params.id))    //filtro el array devolviendome todos los campos menos el que coincide con el que le paso por id           
      res.json({ 
        mensaje: 'Noticia eliminada correctamente',
        noticias: noticias
       }); 
       guardarDatos()
       
       
      
  });  

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });