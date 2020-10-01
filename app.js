const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

// Creo la ruta para la notificacion
app.use(require('./routes'));

// Definimos el puerto
process.env.PORT = process.env.PORT || 3000;

// Arrancar el app
app.listen(process.env.PORT, () => {
  console.log(`server en puerto ${process.env.PORT}`);
});
