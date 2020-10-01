const express = require('express');
const app = express();

app.use(require('./notificacion'));

module.exports = app;
