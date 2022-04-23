const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SucursalesSchema = Schema({
    nombreSucursal:String,
    direccionSucursal:String,
    idEmpresa:{type:Schema.Types.ObjectId,ref:"Entidades"}
});

module.exports = mongoose.model("Sucursales", SucursalesSchema);