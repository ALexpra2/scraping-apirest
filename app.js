const express = require('express');
const fs = require('fs');
const scrapeNoticias = require('./scraping');

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
    scrapeNoticias()
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
//Leer las noticias
app.get('/noticias', (req, res) => {    
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
    const buscarNoticia = noticias.find(noticia => noticia.id === req.params.id);
    if (!buscarNoticia) {
        return res.status(404).json({ mensaje: 'Noticia no encontrada' });
    }
    res.json(buscarNoticia);
})

app.delete('/noticias/:id', (req, res) => {                                                                     //elimina la noticia pasado como ID
    usuarios = usuarios.filter(usuario => usuario.nombre.toLowerCase() !== req.params.nombre.toLowerCase());    //devuelvo a la lista de noticias todas menos la que voy a eliminar
      res.json({ 
        mensaje: 'Usuario eliminado correctamente',
        usuarios: usuarios
       }); 
  });  

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });