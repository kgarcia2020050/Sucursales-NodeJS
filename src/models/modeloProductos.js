const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductosSchema = Schema({
    nombreProducto: String,
    nombreProveedor: String,
    stock: Number,
    idEmpresa:{type:Schema.Types.ObjectId,ref:"Entidades"}
});

module.exports = mongoose.model("Productos", ProductosSchema);