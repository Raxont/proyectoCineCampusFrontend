const AsientoModel = require("../models/asientoModel");

class AsientoController {
    constructor() {
        this.asientoModel = new AsientoModel();
    }

    async handleRequest(req, res) {
        const { action } = req.params;
        const informacion = req.body;

        try {
            let resultado;

            if (req.url.includes('getReserva')) {
                resultado = await this.asientoModel.updateAsientoInBoleta(informacion);
            } else if (req.url.includes('returnReserva')) {
                resultado = await this.asientoModel.revertAsientoInBoleta(informacion);
            } else {
                res.status(400).send("Acción no válida.");
                return;
            }
            
            res.json(resultado);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

module.exports = AsientoController;
