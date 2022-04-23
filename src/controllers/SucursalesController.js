//Kenneth García

const { response } = require("express");
var Entidades = require("../models/modeloEntidad");
var Sucursales = require("../models/modeloSucursales");

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

module.exports = {
  verSucursales,
  nuevaSucursal,
  editarSucursal,
  eliminarSucursal,
  idSucursal,
};
