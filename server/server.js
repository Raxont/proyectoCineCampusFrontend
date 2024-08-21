const express = require("express");
const app = express();
const path = require("path")

const clienteRoutes = require("./routes/clienteRoutes");
const tarjetaRoutes = require("./routes/tarjetaRoutes");
const boletaRoutes = require("./routes/boletaRoutes");
const lugarRoutes = require("./routes/lugarRoutes");
const asientoRoutes = require("./routes/asientoRoutes");

app.use(express.json());

// Configura el middleware para servir archivos estáticos
// Ruta para servir archivos CSS
app.use("/css", express.static(path.join(__dirname, "../public/css")));

// Ruta para servir archivos JS
app.use("/js", express.static(path.join(__dirname, "../public/js")));

// Ruta para servir archivos en storage
app.use("/storage", express.static(path.join(__dirname, "../public/storage")));

app.use("/cliente", clienteRoutes);
app.use("/tarjeta", tarjetaRoutes);
app.use("/boleta", boletaRoutes);
app.use("/lugar", lugarRoutes);
app.use("/asiento", asientoRoutes);

app.use((req, res, next) => {
    req.__dirname = __dirname;
    next();
});

let config ={
    host: process.env.HOST || "localhost",
    port: process.env.PORT || 3000,
};

app.listen(config, () => {
    console.log(`Servidor escuchando en http://${config.host}:${config.port}`);	
});
