const AsientoUseCases = require("../usecases/asientoUseCases");

class AsientoController {
  constructor() {
    this.asientoUseCases = new AsientoUseCases();
  }

  async handleRequest(req, res) {
    const { action } = req.params;
    const informacion = req.body;

    try {
      await this.asientoUseCases.mainAsientos(action, informacion);
      res.status(200).send("Operación completada.");
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = AsientoController;
