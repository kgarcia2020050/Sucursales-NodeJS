//Kenneth García

const { response } = require("express");
var Entidades = require("../models/modeloEntidad");
var Sucursales = require("../models/modeloSucursales");
const ProductosSucursales = require("../models/modeloProductosSucursales");

function verSucursales(req, res) {
  var ID = req.params.ID;
  Sucursales.find({ idEmpresa: ID }, (error, sucursalesEncontradas) => {
    if (error)
      return res
        .status(500)
        .send({ Error: "Error en la petición para ver las sucursales." });
    return res.status(200).send({ Mis_sucursales: sucursalesEncontradas });
  });
}

function idSucursal(req, res) {
  var idSucursal = req.params.ID;
  Sucursales.findById({ _id: idSucursal }, (error, sucursalEncontrada) => {
    if (error)
      return res
        .status(500)
        .send({ Error: "Error al obtener la sucursal con el ID enviado." });
    return res.status(200).send({ Sucursal_encontrada: sucursalEncontrada });
  });
}

function nuevaSucursal(req, res) {
  var datos = req.body;
  var idEmpresa = req.params.ID;
  var modeloSucursales = new Sucursales();

  if (datos.nombreSucursal && datos.direccionSucursal) {
    modeloSucursales.nombreSucursal = datos.nombreSucursal;
    modeloSucursales.direccionSucursal = datos.direccionSucursal;
    modeloSucursales.idEmpresa = idEmpresa;
    modeloSucursales.save((error, sucursalCreada) => {
      if (error)
        return res
          .status(500)
          .send({ Error: "Error en la petición para crear la sucursal." });
      if (!sucursalCreada)
        return res
          .status(500)
          .send({ Error: "No se pudo añadir a la nueva sucursal." });
      return res.status(200).send({ Nueva_sucursal: sucursalCreada });
    });
  } else {
    return res.status(500).send({
      Error:
        "Debes enviar los datos obligatorios. (Nombre y dirección de la sucursal)",
    });
  }
}

function editarSucursal(req, res) {
  var idSucursal = req.params.ID;
  var datos = req.body;

  if (!datos) {
    return res.status(500).send({ Error: "No hay campos para modificar." });
  }

  Sucursales.findByIdAndUpdate(
    idSucursal,
    datos,
    { new: true },
    (error, sucursalModificada) => {
      if (error)
        return res.status(500).send({
          Error: "Error en la petición para modificar la sucursal.",
        });
      if (!sucursalModificada)
        return res.status(500).send({ Error: "Esta sucursal no existe." });
      return res.status(200).send({ Sucursal_modificada: sucursalModificada });
    }
  );
}

function misProductos(req, res) {
  var nombreSucursal = req.params.nombre;
  ProductosSucursales.find(
    { nombreEmpresa: nombreSucursal },
    (error, productosHallados) => {
      if (error)
        return res
          .status(500)
          .send({ Error: "Error al obtener los productos de una sucursal." });
      return res.status(200).send({ Mis_productos: productosHallados });
    }
  );
}

function sucursalNombre(req, res) {
  var nombreSucursal = req.params.nombre;
  Sucursales.find(
    { nombreSucursal: nombreSucursal },
    (error, sucursalEncontrada) => {
      if (error)
        return res.status(500).send({ Error: "Error al buscar la sucursal." });
      return res.status(500).send({ Sucursal_encontrada: sucursalEncontrada });
    }
  );
}

function eliminarSucursal(req, res) {
  var idSucursal = req.params.ID;

  Sucursales.findByIdAndDelete(
    { _id: idSucursal, idEmpresa: req.user.sub },
    (error, sucursalEliminada) => {
      if (error)
        return res
          .status(500)
          .send({ Error: "Error en la petición para eliminar la sucursal." });
      if (!sucursalEliminada)
        return res.status(500).send({ Error: "Esta sucursal no existe." });
      return res.status(200).send({ Sucursal_eliminada: sucursalEliminada });
    }
  );
}

function venta(req, res) {
  var nombreProducto = req.params.nombre;
  var datos = req.body;
  ProductosSucursales.findOne(
    { nombreProducto: nombreProducto },
    (error, productoEncontrado) => {
      if (error)
        return res
          .status(500)
          .send({ Error: "Error al tratar de vender los productos." });
      if (!productoEncontrado)
        return res.status(500).send({ Error: "Este producto no existe." });
      if (datos.cantidad > productoEncontrado.cantidadProducto)
        return res
          .status(500)
          .send({
            Error: "No puedes vender una cantidad mayor al stock del producto.",
          });
      if (!datos.cantidad) {
        return res.status(500).send({
          Error: "Debes especificar la cantidad a vender del producto.",
        });
      } else {
        ProductosSucursales.findOneAndUpdate(
          { nombreProducto: nombreProducto },
          { $inc: { cantidadProducto: datos.cantidad * -1 } },
          { new: true },
          (error, stockActualizado) => {
            if (error)
              return res
                .status(500)
                .send({ Error: "Error al modificar el stock." });
            if (!stockActualizado)
              return res.status(500).send({
                Error: "No se pudo modificar el stock de la sucursal.",
              });
            return res
              .status(200)
              .send({ Stock_actualizado: stockActualizado });
          }
        );
      }
    }
  );
}

module.exports = {
  verSucursales,
  nuevaSucursal,
  editarSucursal,
  eliminarSucursal,
  idSucursal,
  misProductos,
  venta,
  sucursalNombre
};
