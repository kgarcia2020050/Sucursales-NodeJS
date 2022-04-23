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
      Error:
        "Debes llenar los datos obligatorios.",
    });
  }
}


function verProductos(req, res) {
  var ID=req.params.ID;
  Productos.find({idEmpresa:ID},(error, productosEncontrados) => {
    if (error)
      return res
        .status(500)
        .send({ Error: "Error en la petición para ver los productos." });
    if (productosEncontrados.length == 0)
      return res.status(500).send({ Error: "No tienes ningun producto." });
    return res.status(200).send({ Mis_productos: productosEncontrados });
  });
}

function editarProductos(req, res) {
  var idProducto = req.params.ID;

  var datos = req.body;

  if (!datos) {
    return res.status(500).send({ Error: "No hay campos para modificar." });
  }

  if (datos.password) {
    Productos.findByIdAndUpdate(
      idProducto,
      datos,
      { new: true },
      (error, productoEditado) => {
        if (error)
          return res
            .status(500)
            .send({ Error: "Error en la peticion para cambiar la clave." });
        encriptar.hash(datos.password, null, null, (error, claveEncriptada) => {
          if (error)
            return res
              .status(500)
              .send({ Error: "Error en la petición para encriptar la clave." });
          if (productoEditado == 0)
            return res
              .status(500)
              .send({ Error: "La empresa que se desea editar no existe." });
          productoEditado.password = claveEncriptada;

          Productos.findByIdAndUpdate(
            idProducto,
            productoEditado,
            { new: true },
            (error, claveCambiada) => {
              if (error)
                return res.status(500).send({
                  Error: "Error en la petición para cambiar la clave.",
                });

              return res
                .status(200)
                .send({ Producto_modificado: claveCambiada });
            }
          );
        });
      }
    );
  } else {
    Producto.findByIdAndUpdate(
      idProducto,
      datos,
      { new: true },
      (error, productoEditado) => {
        if (error)
          return res.status(500).send({ Error: "Error en la peticion." });
        if (productoEditado == 0)
          return res
            .status(500)
            .send({ Error: "La empresa que se desea editar no existe." });
        return res.status(200).send({ Producto_modificado: productoEditada });
      }
    );
  }
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
};
