const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductosSucursalesSchema = Schema({
    nombreProducto:String,
    cantidadProducto:Number,
    cantidadVendida:Number,
    nombreEmpresa:{type:Schema.Types.String,ref:"Sucursales"}
});

module.exports = mongoose.model("ProductosSucursales", ProductosSucursalesSchema);