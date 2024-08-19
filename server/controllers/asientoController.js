const { validationResult } = require("express-validator");
const AsientoModel = require("../models/asientoModel");
const AsientoDTO = require("../dto/asientoDto");

class AsientoController {
    constructor() {
        this.asientoModel = new AsientoModel();
        this.asientoDto = new AsientoDTO();
        console.log("Instancia del Asiento", this.asientoModel.constructor.name);

    }

    async handleRequest(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
              .status(400)
              .json(this.asientoDto.templateValidationError(errors.array()));
          }
        
        const { idAsiento, idLugar, identificacionCliente } = req.body;

        try {
            // Verificar si el usuario existe en la colección boleta
            const boleta = await this.asientoModel.findBoletaByCliente(identificacionCliente);
            if (!boleta) {
                return res.status(404).json(this.asientoDto.templateInvalidClient());
            }

            if (req.url.includes('getReserva')) {
                 // Verificar si el id_asiento ya está en la boleta
                const asientoExisteEnBoleta = boleta.id_asiento && boleta.id_asiento.some(asiento => asiento.equals(idAsiento));
                if (asientoExisteEnBoleta) {
                    return res.status(400).json(this.asientoDto.templateAsientoInBoleta());
                }

                // Verificar si el id_lugar en la boleta coincide con el idLugar ingresado
                if (!boleta.id_lugar || !boleta.id_lugar.equals(idLugar)) {
                    return res.status(400).json(this.asientoDto.templateLugarMismatch());
                }
                const resultado = await this.asientoModel.updateAsientoInBoleta(idAsiento, idLugar, identificacionCliente);

                if (resultado.asientoModificado && resultado.boletaModificada) {
                    return res.status(200).json(this.asientoDto.templateUpdateSuccess());
                } else {
                    return res.status(400).json(this.asientoDto.templateInvalidAction("Error al actualizar el asiento en la boleta."));
                }
            } else if (req.url.includes('returnReserva')) {

                // Verificar si el id_asiento no está en la boleta
                const asientoNoExisteEnBoleta = !(boleta.id_asiento && boleta.id_asiento.some(asiento => asiento.equals(idAsiento)));
                if (asientoNoExisteEnBoleta) {
                    return res.status(400).json(this.asientoDto.templateAsientoNotInBoleta());
                }

                const resultado = await this.asientoModel.revertAsientoInBoleta(idAsiento, idLugar, identificacionCliente);

                if (resultado.asientoModificado && resultado.boletaModificada) {
                    return res.status(200).json(this.asientoDto.templateRevertSuccess());
                } else {
                    return res.status(400).json(this.asientoDto.templateInvalidAction("Error al revertir el asiento en la boleta."));
                }
            } else {
                return res.status(400).json(this.asientoDto.templateInvalidAction("Acción no válida"));
            }
        } catch (error) {
            console.error("Error en el controlador de asientos:", error);
            return res.status(500).json(this.asientoDto.templateErrorInternal());
        }
    }
}

module.exports = AsientoController;
