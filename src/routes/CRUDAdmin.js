const express = require('express');
const controlador = require('../controllers/EmpresasController');
var api = express.Router();

const md_autenticacion= require('../middlewares/autenticacion')

api.post('/registro',md_autenticacion.Auth,controlador.registroEntidades)
api.post('/registrarse',controlador.registroEntidades)
api.get('/empresaID/:ID',md_autenticacion.Auth,controlador.empresaId)
api.get('/empresas',md_autenticacion.Auth,controlador.verEntidades)
api.put('/editar/:ID',md_autenticacion.Auth,controlador.editarEntidad)
api.delete('/eliminar/:ID',md_autenticacion.Auth,controlador.eliminarEntidades)

module.exports=api;