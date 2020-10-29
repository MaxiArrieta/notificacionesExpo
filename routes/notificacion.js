const express = require("express");
const fetch = require("node-fetch");
const moment = require("moment");
const app = express();
const arrayNotificaciones = [];
moment.locale("es");
// let opciones = { hour: 'numeric', minute: '2-digit', hour12: false };
// Esta funcion se ejecuta cada 30 segundas y reccore el array de notificaciones
// las copara y quita las repetidas xq se envian push todo el timepo si hay alguna
// repetida la saca, si todo esta ok envia la notificacion
const sendNotificacion = () => {
    let dia = new Date().toLocaleString("es-AR", {
        timeZone: "America/Buenos_Aires",
    });
    let hora = moment(dia).format("LT");

    if (arrayNotificaciones.length === 0) return;
    arrayNotificaciones.map((notificacion, index) => {
        console.log("///// Hora ///// Notificacion /////");
        console.log(`   ${hora}    ===    ${notificacion.time}`);
        // Comparo la hora de la notificacion con la hora
        // si son iguales se ejecuta la notificacion
        if (hora === notificacion.time) {
            console.log("Son iguales ");
            fetch("https://exp.host/--/api/v2/push/send", {
                    method: "post",
                    headers: {
                        Accept: "application/json",
                        "Accept-Encoding": "gzip, deflate",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(notificacion.mensaje),
                })
                .then((res) => res.json())
                .then((resultado) => {
                    console.log("Resultado: ", resultado);
                    // Si esta todo ok sacamos la notificacion del array
                    if (resultado.data.status === "ok") {
                        arrayNotificaciones.splice(index, 1);
                    } else {
                        // si hay un error no puedo hacer nada de aca
                        // tengo que sacarlo igual
                        arrayNotificaciones.splice(index, 1);
                    }
                });
        } else {
            console.log("son distintos ");
        }
    });
};

// Creo la ruta que resive los datos con el contenido de la notificacion
app.post("/notificacion", (req, res) => {
    let body = req.body;
    // Hago destructuracion del body con todo lo que necesito
    const { token, titulo, contenido, usuario, time } = body;
    // Hago validacion de campos vacios
    if (
        token.trim() === "" ||
        titulo.trim() === "" ||
        contenido.trim() === "" ||
        usuario.trim() === "" ||
        time === ""
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

        // Agrego el msj al array de notificaciones
        // arrayNotificaciones.push({ mensaje, time });
        // Respuesta de la api
        res.json({
            ok: true,
            message: "Se enviaron los datos correctamente",
        });
        // lo mando a comparar como objeto asi esta igual que la notificacion
        comparar({ mensaje, time });
    }
});

const comparar = (nuevaNotificacion) => {
    // hacemos un if para saber si hay mas de 1 notificaciones agregadas
    if (arrayNotificaciones.length > 0) {
        // si hay mas de 1 entonces lo recorre
        arrayNotificaciones.map((notificacion) => {
            // comparo primero por token, si es del mismo usuario
            if (notificacion.mensaje.to === nuevaNotificacion.mensaje.to) {
                // despues por el cuerpo de la notificacion el mensaje
                if (notificacion.mensaje.body === nuevaNotificacion.mensaje.body) {
                    // y por ultimo por la hora, si todo esto coincide
                    if (notificacion.time === nuevaNotificacion.time) {
                        // saco la notificacion del array

                        console.log("***************************************************");
                        console.log(notificacion.time, " === ", nuevaNotificacion.time);
                        console.log("No se agrego, ya esta en el array");
                    } else {
                        arrayNotificaciones.push(nuevaNotificacion);
                    }
                } else {
                    arrayNotificaciones.push(nuevaNotificacion);
                }
            } else {
                arrayNotificaciones.push(nuevaNotificacion);
            }
        });
    } else {
        arrayNotificaciones.push(nuevaNotificacion);
    }
};

setInterval(() => {
    sendNotificacion();
}, 50000);

module.exports = app;