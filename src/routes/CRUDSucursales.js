//Kenneth García

const express=require("express")
const controller=require("../controllers/SucursalesController")
var api=express.Router()

const md_autenticacion = require("../middlewares/autenticacion");

api.get("/verSucursales/:ID",md_autenticacion.Auth,controller.verSucursales)
api.get("/idSucursal/:ID",md_autenticacion.Auth,controller.idSucursal)
api.post("/nuevaSucursal/:ID",md_autenticacion.Auth,controller.nuevaSucursal)
api.put("/editarSucursal/:ID",md_autenticacion.Auth,controller.editarSucursal)
api.delete("/eliminarSucursal/:ID",md_autenticacion.Auth,controller.eliminarSucursal)

module.exports=api;