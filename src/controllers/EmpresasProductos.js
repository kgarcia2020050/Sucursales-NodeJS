const Productos = require("../models/modeloProductos");
const encriptar = require("bcrypt-nodejs");

function registroProductos(req, res) {
  var datos = req.body;
  var idEmpresa = req.params.ID;
  var modeloProductos = new Productos();

  if (datos.nombreProducto && datos.nombreProveedor && datos.stock) {
    modeloProductos.nombreProducto = datos.nombreProducto;
    modeloProductos.nombreProveedor = datos.nombreProveedor;
    modeloProductos.stock = datos.stock;
    modeloProductos.idEmpresa = idEmpresa;

    modeloProductos.save((error, productoCreado) => {
      if (error)
        return res
          .status(500)
          .send({ Error: "Error en la petición para crear el producto." });
      if (!productoCreado)
        return res
          .status(500)
          .send({ Error: "No se pudo añadir el nuevo producto." });
      return res.status(200).send({ Mis_productos: productoCreado });
    });
  } else {
    return res.status(500).send({
      Error: "Debes llenar los datos obligatorios.",
    });
  }
}

function verProductos(req, res) {
  var ID = req.params.ID;
  Productos.find({ idEmpresa: ID }, (error, productosEncontrados) => {
    if (error)
      return res
        .status(500)
        .send({ Error: "Error en la petición para ver los productos." });
    return res.status(200).send({ Mis_productos: productosEncontrados });
  });
}

function editarProductos(req, res) {
  var idProducto = req.params.ID;

  var datos = req.body;
  Productos.findByIdAndUpdate(
    { _id: idProducto },
    datos,
    { new: true },
    (error, productoEditado) => {
      if (error)
        return res.status(500).send({ Error: "Error en la peticion." });
      return res.status(200).send({ Producto_modificado: productoEditado });
    }
  );
}

function productoPorId(req, res) {
  var idProducto = req.params.ID;
  Productos.findById({ _id: idProducto }, (error, productoEncontrado) => {
    if (error)
      return res.status(500).send({ Error: "Error al obtener el producto." });
    return res.status(200).send({ Producto: productoEncontrado });
  });
}

function eliminarProductos(req, res) {
  var idProducto = req.params.ID;

  Productos.findByIdAndDelete(idProducto, (error, productoEliminado) => {
    if (error)
      return res
        .status(500)
        .send({ Error: "Error en la peticion para eliminar." });
    if (productoEliminado == 0)
      return res.status(500).send({ Error: "El producto  no existe." });
    return res.status(200).send({ Producto_eliminado: productoEliminado });
  });
}

module.exports = {
  registroProductos,
  verProductos,
  editarProductos,
  eliminarProductos,
  productoPorId,
};
