const express = require("express");
const controlador = require("../controllers/InicioController");

var api = express.Router();

api.post("/login",controlador.Login)

module.exports=api;