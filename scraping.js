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
            $('article').each((index, element) => {
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