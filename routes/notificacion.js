const express = require("express");
const fetch = require("node-fetch");
// Tuve que importar fetch para hacer la consulta
const app = express();

// Creo la ruta que resive los datos con el contenido de la notificacion
app.post("/notificacion", (req, res) => {
    let body = req.body;
    console.log("body", body);

    // Hago destructuracion del body con todo lo que necesito
    const { token, titulo, contenido, usuario, time } = body;
    // Hago validacion de campos vacios
    if (
        token.trim() === "" ||
        titulo.trim() === "" ||
        contenido.trim() === "" ||
        usuario.trim() === "" ||
        time === 0
    ) {
        res.json({
            ok: false,
            err: {
                message: "Todos los campos son obligatorios",
            },
        });
    } else {
        // Creo la variable con todos los datos del mensaje
        let mensaje = {
            to: token,
            data: { extraData: "Some data" },
            title: titulo,
            body: contenido + " " + usuario,
            ttl: 2419200,
            badge: 0,
        };

        console.log("Enviando notificacion ..");
        // Hago esta funcion callback que hace la peticion a la
        // api de expo para que envie la notificacion
        setTimeout(() => {
            fetch("https://exp.host/--/api/v2/push/send", {
                    method: "post",
                    headers: {
                        Accept: "application/json",
                        "Accept-Encoding": "gzip, deflate",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(mensaje),
                })
                .then((res) => res.json())
                .then((resultado) => console.log("resultado: ", resultado));
        }, time);

        // Si los datos se enviarion de forma correcta le aviso
        res.json({
            ok: true,
            message: "Se enviaron los datos correctamente",
        });
    }
});

module.exports = app;