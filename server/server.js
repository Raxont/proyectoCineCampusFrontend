const express = require("express");
const app = express();
const path = require("path");
require('dotenv').config();

// Rutas de diferentes módulos
const clienteRoutes = require("./routes/clienteRoutes");
const tarjetaRoutes = require("./routes/tarjetaRoutes");
const boletaRoutes = require("./routes/boletaRoutes");
const lugarRoutes = require("./routes/lugarRoutes");
const asientoRoutes = require("./routes/asientoRoutes");
const peliculaRoutes = require("./routes/peliculaRoutes");

// Middleware para analizar el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Configura el middleware para servir archivos estáticos

//! Ruta para servir archivos CSS
app.use("/css", express.static(path.join(__dirname, "../public/css")));

//! Ruta para servir archivos JS
app.use("/js", express.static(path.join(__dirname, "../public/js")));

//! Ruta para servir archivos en storage
app.use("/storage", express.static(path.join(__dirname, "../public/storage")));

// Rutas para los diferentes módulos de la aplicación
app.use("/cliente", clienteRoutes);
app.use("/tarjeta", tarjetaRoutes);
app.use("/boleta", boletaRoutes);
app.use("/lugar", lugarRoutes);
app.use("/asiento", asientoRoutes);
app.use("/pelicula", peliculaRoutes);

// Configuración de la ruta para exponer la variable de entorno
app.get('/api/config', (req, res) => {
    res.json({
        nick: process.env.MONGO_USER, 
    });
});

// Middleware para añadir __dirname a cada solicitud
app.use((req, res, next) => {
    req.__dirname = __dirname;
    next();
});

// Configuración del servidor y puerto
const config = {
    port: process.env.PORT || 3000,  // Render asigna dinámicamente este puerto
    host: process.env.HOST || "localhost", // Render usa localhost en caso de no recibir una variable de entorno
};

// Inicia el servidor y muestra el mensaje de éxito en la consola
app.listen(config.port, () => {
    console.log(`Servidor escuchando en el puerto ${config.port}`);
});