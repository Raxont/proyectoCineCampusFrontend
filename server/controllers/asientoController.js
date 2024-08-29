const { validationResult } = require("express-validator");
const AsientoModel = require("../models/asientoModel");
const AsientoDTO = require("../dto/asientoDto");
const LugarModel = require("../models/lugarModel");
const { ObjectId } = require('mongodb');

/**
 * Controlador para manejar las solicitudes relacionadas con asientos.
 * Ejecuta las acciones correspondientes basadas en la URL y método HTTP.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const AsientoController = async (req, res) => {
    const errors = validationResult(req); // Valida los datos del request
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Retorna errores de validación
    }

    let { idLugarq } = req.query; // Obtiene el idLugar desde los query params
    let { idAsiento, idLugar, identificacionCliente } = req.body; // Obtiene los datos del body de la solicitud
    const asientoModel = new AsientoModel(); // Instancia el modelo de asiento
    const asientoDto = new AsientoDTO(); // Instancia el DTO de asiento

    try {
        await asientoModel.init(); // Inicializa el modelo de asiento

        if (req.url.includes('getReserva')) {
            // Acción para obtener reservas
            const idAsientos = idAsiento.map(id => new ObjectId(id)); // Convierte los IDs de los asientos a ObjectId
            idLugar= new ObjectId(idLugar)
            // Verifica si el usuario existe en la colección boleta
            const boleta = await asientoModel.findBoletaByCliente(identificacionCliente,idLugar);
            if (!boleta) {
                return res.status(404).json(asientoDto.templateInvalidClient()); // Retorna error si no se encuentra el cliente
            }
        
            // Actualiza los asientos en la boleta
            const resultado = await asientoModel.updateAsientoInBoleta(idAsientos, idLugar, identificacionCliente);
            if (resultado.asientosModificados && resultado.boletaModificada) {
                return res.status(200).json(asientoDto.templateUpdateSuccess()); // Retorna éxito si se actualizan los asientos
            } else {
                return res.status(400).json(asientoDto.templateInvalidAction("Error al actualizar los asientos en la boleta.")); // Retorna error si falla la actualización
            }
        } else if (req.url.includes('returnReserva')) {
            // Acción para devolver reservas
            const idAsientos = idAsiento.map(id => new ObjectId(id)); // Convierte los IDs de los asientos a ObjectId
            const boleta = await asientoModel.findBoletaByCliente(identificacionCliente);
            if (!boleta) {
                return res.status(404).json(asientoDto.templateInvalidClient()); // Retorna error si no se encuentra el cliente
            }
            
            // Verifica si los asientos no están en la boleta
            const asientosNoExistentes = idAsientos.filter(id => 
                !(boleta.id_asiento && boleta.id_asiento.some(asiento => asiento.equals(id)))
            );
            if (asientosNoExistentes.length > 0) {
                return res.status(400).json(asientoDto.templateAsientoNotInBoleta()); // Retorna error si los asientos no están en la boleta
            }
            
            // Revertir los asientos en la boleta
            const resultado = await asientoModel.revertAsientoInBoleta(idAsientos, idLugar, identificacionCliente);

            if (resultado.asientosModificados && resultado.boletaModificada) {
                return res.status(200).json(asientoDto.templateRevertSuccess()); // Retorna éxito si se revierten los asientos
            } else {
                return res.status(400).json(asientoDto.templateInvalidAction("Error al revertir los asientos en la boleta.")); // Retorna error si falla la reversión
            }
        } else if (req.url.includes("asientosDisponibles")) {
            // Obtener asientos disponibles en un lugar específico
            const resultados = await asientoModel.getAsientosAvailable(idLugarq);
            if (resultados.length > 0) {
                return res.status(200).json(asientoDto.templateSuccess(resultados)); // Retorna asientos disponibles si existen
            } else {
                return res.status(404).json(asientoDto.templateNoSeatsAvailable()); // Retorna error si no hay asientos disponibles
            }
        } else if (req.url.includes("getAsientos")) {
            // Obtener todos los asientos
            const resultados = await asientoModel.getAllAsiento();
            if (resultados.length > 0) {
                return res.status(200).json(asientoDto.templateSuccess(resultados)); // Retorna todos los asientos si existen
            } else {
                return res.status(404).json(asientoDto.templateNoSeatsAvailable()); // Retorna error si no hay asientos
            }
        } else {
            return res.status(400).json(asientoDto.templateInvalidAction("Acción no válida")); // Retorna error si la acción no es válida
        }
    } catch (error) {
        console.error("Error en el controlador de asientos:", error);
        return res.status(500).json(asientoDto.templateErrorInternal()); // Manejo de errores internos
    }
}

/**
 * Función para manejar la vista HTML de asientos.
 * Obtiene los lugares por película y fecha, y renderiza la vista HTML correspondiente.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const renderasiento = async (req, res) => {
    const lugarModel = new LugarModel();
    try {
        await lugarModel.init(); // Inicializa el modelo de lugar
        const { idPelicula, fechaInicioFiltro } = req.query; // Obtiene los parámetros de consulta
      
        const lugar = await lugarModel.getLugaresByPelicula(idPelicula, fechaInicioFiltro);
  
        if (lugar.length === 0) {
            return res.status(404).send('Lugar no encontrado'); // Retorna error si no se encuentra el lugar
        }
        res.sendFile(path.join(__dirname, "../../", process.env.STATIC, "views/asiento.html")); // Envia el archivo HTML
    } catch (error) {
        console.error("Error al renderizar el asiento:", error);
        res.status(500).send("Error interno del servidor"); // Manejo de errores internos
    }
};

module.exports = { AsientoController, renderasiento };
