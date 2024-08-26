const { validationResult } = require("express-validator");
const AsientoModel = require("../models/asientoModel");
const AsientoDTO = require("../dto/asientoDto");

const AsientoController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { idAsiento, idLugar, identificacionCliente } = req.body;
    const asientoModel = new AsientoModel();
    const asientoDto = new AsientoDTO();
    try {
        
        // Verificar si el usuario existe en la colección boleta
        const boleta = await asientoModel.findBoletaByCliente(identificacionCliente);
        if (!boleta) {
            return res.status(404).json(asientoDto.templateInvalidClient());
        }

        if (req.url.includes('getReserva')) {
            // Verificar si el id_asiento ya está en la boleta
            const asientoExisteEnBoleta = boleta.id_asiento && boleta.id_asiento.some(asiento => asiento.equals(idAsiento));
            if (asientoExisteEnBoleta) {
                return res.status(400).json(asientoDto.templateAsientoInBoleta());
            }

            // Verificar si el id_lugar en la boleta coincide con el idLugar ingresado
            if (!boleta.id_lugar || !boleta.id_lugar.equals(idLugar)) {
                return res.status(400).json(asientoDto.templateLugarMismatch());
            }
            const resultado = await asientoModel.updateAsientoInBoleta(idAsiento, idLugar, identificacionCliente);

            if (resultado.asientoModificado && resultado.boletaModificada) {
                return res.status(200).json(asientoDto.templateUpdateSuccess());
            } else {
                return res.status(400).json(asientoDto.templateInvalidAction("Error al actualizar el asiento en la boleta."));
            }
        } else if (req.url.includes('returnReserva')) {

            // Verificar si el id_asiento no está en la boleta
            const asientoNoExisteEnBoleta = !(boleta.id_asiento && boleta.id_asiento.some(asiento => asiento.equals(idAsiento)));
            if (asientoNoExisteEnBoleta) {
                return res.status(400).json(asientoDto.templateAsientoNotInBoleta());
            }

            const resultado = await asientoModel.revertAsientoInBoleta(idAsiento, idLugar, identificacionCliente);

            if (resultado.asientoModificado && resultado.boletaModificada) {
                return res.status(200).json(asientoDto.templateRevertSuccess());
            } else {
                return res.status(400).json(asientoDto.templateInvalidAction("Error al revertir el asiento en la boleta."));
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
    try {
      const { idPelicula, fechaInicioFiltro} = req.query;
      const lugarModel = new LugarModel();
  
      const lugar = await lugarModel.getLugaresByPelicula(idPelicula,fechaInicioFiltro);
  
      if (lugar.length === 0) {
        return res.status(404).send('Lugar no encontrado');
      }
  
      res.sendFile(path.join(__dirname, "../../", process.env.STATIC, "views/asiento.html"));
    } catch (error) {
      console.error("Error al renderizar el asiento:", error);
      res.status(500).send("Error interno del servidor");
    }
  };


module.exports = {AsientoController,renderasiento};
