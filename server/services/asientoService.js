const AsientoRepository = require("../repositories/asientoRepository");

class AsientoService {
  constructor() {
    this.asientoRepo = new AsientoRepository();
  }

  async updateAsientoInBoleta(informacion) {
    return this.asientoRepo.updateAsientoInBoleta(informacion);
  }

  async revertAsientoInBoleta(informacion) {
    return this.asientoRepo.revertAsientoInBoleta(informacion);
  }
}

module.exports = AsientoService;
