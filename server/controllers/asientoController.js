const { validationResult } = require("express-validator");
const AsientoModel = require("../models/asientoModel");
const AsientoDTO = require("../dto/asientoDto");
const LugarModel = require("../models/lugarModel");
const path = require("path");
const { ObjectId } = require('mongodb');

const AsientoController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let {idLugarq} = req.query;
    
    let { idAsiento, idLugar, identificacionCliente } = req.body;
    const asientoModel = new AsientoModel();
    const asientoDto = new AsientoDTO();

    try {
        await asientoModel.init();

        if (req.url.includes('getReserva')) {
          const idAsientos = idAsiento.map(id => new ObjectId(id));

          
          console.log("Id Lugar del getReserva Controller:",idLugar);
          
          // Verifica si el usuario existe en la colección boleta
          const boleta = await asientoModel.findBoletaByCliente(identificacionCliente);
          if (!boleta) {
              return res.status(404).json(asientoDto.templateInvalidClient());
          }
      
          // Verificar si los asientos están en la boleta
          const asientosExistentes = idAsientos.filter(id => 
              boleta.id_asiento && boleta.id_asiento.some(asiento => asiento.equals(id))
          );
          if (asientosExistentes.length > 0) {
              return res.status(400).json(asientoDto.templateAsientoInBoleta());
          }
      
          // Verificar si el id_lugar en la boleta coincide con el idLugar ingresado
          if (!boleta.id_lugar || !boleta.id_lugar.equals(idLugar)) {
              return res.status(400).json(asientoDto.templateLugarMismatch());
          }
      
          // Actualizar los asientos en la boleta
          const resultado = await asientoModel.updateAsientoInBoleta(idAsientos, idLugar, identificacionCliente);
          console.log(resultado);
          if (resultado.asientosModificados && resultado.boletaModificada) {
              return res.status(200).json(asientoDto.templateUpdateSuccess());
          } else {
              return res.status(400).json(asientoDto.templateInvalidAction("Error al actualizar los asientos en la boleta."));
          }
      } else if (req.url.includes('returnReserva')) {
            // Verificar si el usuario existe en la colección boleta
            const boleta = await asientoModel.findBoletaByCliente(identificacionCliente);
            if (!boleta) {
                return res.status(404).json(asientoDto.templateInvalidClient());
            }

            // Verificar si los asientos no están en la boleta
            const asientosNoExistentes = idAsiento.filter(id => 
                !(boleta.id_asiento && boleta.id_asiento.some(asiento => asiento.equals(id)))
            );
            if (asientosNoExistentes.length > 0) {
                return res.status(400).json(asientoDto.templateAsientoNotInBoleta());
            }

            // Revertir los asientos en la boleta
            const resultado = await asientoModel.revertAsientoInBoleta(idAsiento, idLugar, identificacionCliente);
            
            if (resultado.asientosModificados && resultado.boletaModificada) {
                return res.status(200).json(asientoDto.templateRevertSuccess());
            } else {
                return res.status(400).json(asientoDto.templateInvalidAction("Error al revertir los asientos en la boleta."));
            }
        } else if (req.url.includes("asientosDisponibles")) {
            // Obtener asientos disponibles en un lugar específico
            const resultados = await asientoModel.getAsientosAvailable(idLugarq);
            if (resultados.length > 0) {
                return res.status(200).json(asientoDto.templateSuccess(resultados));
            } else {
                return res.status(404).json(asientoDto.templateNoSeatsAvailable());
            }
        } else if (req.url.includes("getAsientos")) {
            // Obtener todos los asientos
            const resultados = await asientoModel.getAllAsiento();
            if (resultados.length > 0) {
                return res.status(200).json(asientoDto.templateSuccess(resultados));
            } else {
                return res.status(404).json(asientoDto.templateNoSeatsAvailable());
            }
        } else {
            return res.status(400).json(asientoDto.templateInvalidAction("Acción no válida"));
        }
    } catch (error) {
        console.error("Error en el controlador de asientos:", error);
        return res.status(500).json(asientoDto.templateErrorInternal());
    }
}

// Nueva función para manejar la vista HTML
const renderasiento = async (req, res) => {
    const lugarModel = new LugarModel();
    try {
        await lugarModel.init();
        const { idPelicula, fechaInicioFiltro } = req.query;
      
        const lugar = await lugarModel.getLugaresByPelicula(idPelicula, fechaInicioFiltro);
  
        if (lugar.length === 0) {
            return res.status(404).send('Lugar no encontrado');
        }
        res.sendFile(path.join(__dirname, "../../", process.env.STATIC, "views/asiento.html"));
    } catch (error) {
        console.error("Error al renderizar el asiento:", error);
        res.status(500).send("Error interno del servidor");
    }
};

module.exports = { AsientoController, renderasiento };
