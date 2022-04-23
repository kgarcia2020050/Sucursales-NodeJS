const express = require('express');
const cors = require('cors');
var app = express();

const rutaInicio = require('./src/routes/CrearAdmin');
const rutasEmpresas= require('./src/routes/CRUDAdmin');
const rutasSucursales=require("./src/routes/CRUDSucursales")
const rutasProductos= require('./src/routes/CRUDProductos');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api', rutaInicio,rutasEmpresas,rutasSucursales,rutasProductos);


module.exports = app;