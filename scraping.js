const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://elpais.com/ultimas-noticias/';

function scrapeNoticias() {
    axios.get(url).then((response) => {
        if(response.status === 200){            
        
            const html = response.data;
            //console.log(html);           
            
            const $ = cheerio.load(html);
            
            const noticias = [];
            let contador = 1

            //La $ función devuelve un Cheerioobjeto, que es similar a una matriz de elementos del DOM. Es posible utilizar este objeto como punto de partida para recorrer el DOM. Por ejemplo, puede utilizar la findfunción para seleccionar elementos dentro de los elementos seleccionados: $('h2.title').find('.subtitle').text();


            $('article').each((index, element) => {           //son los unicos article de la pagina por eso no especifico <article class="c c-d c--m ">
                const id = contador++
                const titulo = $(element).find('h2').text();
                const descripcion = $(element).find('p').text();
                const imagen = $(element).find('img').attr('src');
                const enlace = $(element).find('a').attr('href');
          
                const noticia = {
                  id: id,
                  titulo: titulo,
                  descripcion: descripcion,
                  imagen: imagen,
                  enlace: enlace,
                };
          
                noticias.push(noticia);
            });
            //console.log(noticias);
            
            // Guardamos los datos en un archivo JSON
            fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
        
    
        } 
    });
     
};
//scrapeNoticias()
module.exports = scrapeNoticias;