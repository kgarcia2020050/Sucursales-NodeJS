const Entidades = require("../models/modeloEntidad");
const encriptar = require("bcrypt-nodejs");

function registroEntidades(req, res) {
  var datos = req.body;
  var modeloEntidades = new Entidades();
  if (
    datos.nombreEmpresa &&
    datos.direccionEmpresa &&
    datos.tipoEmpresa &&
    datos.municipioEmpresa &&
    datos.usuario &&
    datos.password
  ) {
    modeloEntidades.nombreEmpresa = datos.nombreEmpresa;
    modeloEntidades.direccionEmpresa = datos.direccionEmpresa;
    modeloEntidades.tipoEmpresa = datos.tipoEmpresa;
    modeloEntidades.municipioEmpresa = datos.municipioEmpresa;
    modeloEntidades.usuario = datos.usuario;
    modeloEntidades.rol = "EMPRESA";

    Entidades.find((error, empresaEncontrada) => {
      if (empresaEncontrada.length == 0) {
        encriptar.hash(datos.password, null, null, (error, claveEncriptada) => {
          modeloEntidades.password = claveEncriptada;
          modeloEntidades.save((error, empresaAgregada) => {
            if (error)
              return res.status(500).send({ Error: "Error en la peticion." });
            if (!empresaAgregada)
              return res.status(404).send({
                Error: "No se pudo crear a la empresa.",
              });
            return res.status(200).send({ Empresa_nueva: empresaAgregada });
          });
        });
      }/*  else {
        return res.status(500).send({ Error: "Esta empresa ya existe." });
      } */
    });
  } else {
    return res
      .status(500)
      .send({ Error: "Debes llenar los campos solicitados." });
  }
}

function verEntidades(req, res) {
  Entidades.find({ rol: "EMPRESA" }, (error, listadoEntidades) => {
    if (error) return res.status(500).send({ Error: "Error en la petición." });
    return res.status(200).send({ Entidades_registradas: listadoEntidades });
  });
}

function empresaId(req,res){
  var idEmpresa=req.params.ID;
  Entidades.findById({_id:idEmpresa},(error,empresaEncontrada)=>{
    if(error) return res.status(500).send({Error:"Error al obtener la empresa por su ID."});
    return res.status(200).send({Empresa_encontrada:empresaEncontrada})
  })
}


function editarEntidad(req, res) {
  var idEmpresa = req.params.ID;

  var datos = req.body;

  if (!datos) {
    return res.status(500).send({ Error: "No hay campos para modificar." });
  }

  if (datos.password) {
    Entidades.findByIdAndUpdate(
      idEmpresa,
      datos,
      { new: true },
      (error, empresaEditada) => {
        if (error)
          return res
            .status(500)
            .send({ Error: "Error en la peticion para cambiar la clave." });
        encriptar.hash(datos.password, null, null, (error, claveEncriptada) => {
          if (error)
            return res
              .status(500)
              .send({ Error: "Error en la petición para encriptar la clave." });
          if (empresaEditada == 0)
            return res
              .status(500)
              .send({ Error: "La empresa que se desea editar no existe." });
          empresaEditada.password = claveEncriptada;

          Entidades.findByIdAndUpdate(
            idEmpresa,
            empresaEditada,
            { new: true },
            (error, claveCambiada) => {
              if (error)
                return res.status(500).send({
                  Error: "Error en la petición para cambiar la clave.",
                });

              return res
                .status(200)
                .send({ Empresa_modificada: claveCambiada });
            }
          );
        });
      }
    );
  } else {
    Entidades.findByIdAndUpdate(
      idEmpresa,
      datos,
      { new: true },
      (error, empresaEditada) => {
        if (error)
          return res.status(500).send({ Error: "Error en la peticion." });
        if (empresaEditada == 0)
          return res
            .status(500)
            .send({ Error: "La empresa que se desea editar no existe." });
        return res.status(200).send({ Empresa_modificada: empresaEditada });
      }
    );
  }
}

function eliminarEntidades(req, res) {
  var idEmpresa = req.params.ID;

  Entidades.findByIdAndDelete(idEmpresa, (error, empresaEliminada) => {
    if (error)
      return res
        .status(500)
        .send({ Error: "Error en la peticion para eliminar." });
    if (empresaEliminada == 0)
      return res.status(500).send({ Error: "La empresa no existe." });
    return res.status(200).send({ Empresa_eliminada: empresaEliminada });
  });
}

module.exports = {
  registroEntidades,
  verEntidades,
  editarEntidad,
  eliminarEntidades,
  empresaId
};
