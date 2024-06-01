const express = require('express'); // Importamos express
const app = express(); // Instanciamos express
const fs = require('fs');
const Jimp = require("jimp");
const { v4: uuidv4 } = require('uuid');


app.listen(3000 , console.log("Servidor funcionando "))

app.use(express.json());  

app.use(express.static("assets", { 
  setHeaders: (res, path) => {
    if (path.endsWith(".css")) {
      res.set("Content-Type", "text/css");
    }
  }
}));


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");  
})

const fetch = require("node-fetch");

//Ruta de imagen procesada por Jimp.
app.get("/BW", async (req, res) => {
    try {

        //Constante de captura de imput HTML.
        const { imageUrl } = req.query;

        //Prueba de captura de imagen. 
        console.log(" Url de la imagen:", imageUrl); 
        const imagen = await Jimp.read(imageUrl);

        //parametros de jimp
        await imagen
            .resize(350, Jimp.AUTO)
            imagen.greyscale();            
        
        //Definimos el nombre de la imagen
        const nuevoNombre = `${uuidv4().slice(0, 6)}.jpeg`;

        //guardamos la imagen con el nuevo nombre
        await imagen.writeAsync(`assets/img${nuevoNombre}`);
       
        //Retorna la imagen procesada 
        res.send(`<img src="img${nuevoNombre}" alt="Imagen procesada">`);

    } catch (error) {
        //Manejo de errores.
        console.error("Error al procesar la imagen:", error);
        res.status(500).send("Error al procesar la imagen");
    }
});