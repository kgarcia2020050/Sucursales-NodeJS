const Productos = require("../models/modeloProductos");
const encriptar = require("bcrypt-nodejs");
const ProductosSucursales = require("../models/modeloProductosSucursales");

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

function enviarProductos(req, res) {
  var datos = req.body;
  var modeloProductosSucursales = new ProductosSucursales();

  if (datos.nombreProducto && datos.cantidadProducto && datos.nombreEmpresa) {
    Productos.findOne(
      { nombreProducto: datos.nombreProducto },
      (error, productoEncontrado) => {
        if (productoEncontrado.stock < datos.cantidadProducto) {
          return res.status(500).send({
            Error: "No puedes enviar una cantidad mayor al stock del producto.",
          });
        } else {
          modeloProductosSucursales.nombreProducto = datos.nombreProducto;
          modeloProductosSucursales.cantidadProducto = datos.cantidadProducto;
          modeloProductosSucursales.cantidadVendida = 0;
          modeloProductosSucursales.nombreEmpresa = datos.nombreEmpresa;

          Productos.findOneAndUpdate(
            { nombreProducto: datos.nombreProducto },
            { $inc: { stock: datos.cantidadProducto * -1 } },
            { new: true },
            (error, productoActualizado) => {
              if (productoActualizado.stock <= 0) {
                Productos.deleteOne(
                  { nombreProducto: datos.nombreProducto },
                  (error, productoEliminado) => {
                    if (error)
                      return res
                        .status(500)
                        .send({ Error: "No se pudo eliminar al producto." });
                  }
                );
              }
              modeloProductosSucursales.save((error, productoEnviado) => {
                if (error)
                  return res
                    .status(500)
                    .send({ Error: "Error al enviar los productos." });
                return res.status(200).send({
                  Producto_enviado: "Producto enviado correctamente",
                });
              });
            }
          );
        }
      }
    );
  } else {
    return res.status(500).send({ Error: "Debes llenar todos los datos." });
  }
}

module.exports = {
  enviarProductos,
  registroProductos,
  verProductos,
  editarProductos,
  eliminarProductos,
  productoPorId,
};
