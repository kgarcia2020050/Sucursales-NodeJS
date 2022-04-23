const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EntidadSchema = Schema({
    nombreEmpresa: String,
    direccionEmpresa:String,
    tipoEmpresa:String,
    municipioEmpresa:String,
    usuario:String,
    password:String,
    rol:String
});

module.exports = mongoose.model("Entidades", EntidadSchema);