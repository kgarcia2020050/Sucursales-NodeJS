const express = require('express');
const controlador = require('../controllers/EmpresasProductos');
var api = express.Router();

const md_autenticacion =require("../middlewares/autenticacion")

api.get('/verProductos/:ID',md_autenticacion.Auth,controlador.verProductos)
api.get('/productoId/:ID',md_autenticacion.Auth,controlador.productoPorId)
api.post("/enviarProductos",md_autenticacion.Auth,controlador.enviarProductos)
api.post('/agregarProductos/:ID',md_autenticacion.Auth,controlador.registroProductos)
api.put('/editarProducto/:ID',md_autenticacion.Auth,controlador.editarProductos)
api.delete('/eliminarProducto/:ID',md_autenticacion.Auth,controlador.eliminarProductos)

module.exports=api;