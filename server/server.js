const express = require("express");

const clienteRoutes = require("./routes/clienteRoutes");
const tarjetaRoutes = require("./routes/tarjetaRoutes");
const boletaRoutes = require("./routes/boletaRoutes");
const lugarRoutes = require("./routes/lugarRoutes");
const asientoRoutes = require("./routes/asientoRoutes");

const app = express();
app.use(express.json());


app.use("/cliente", clienteRoutes);
app.use("/tarjeta", tarjetaRoutes);
app.use("/boleta", boletaRoutes);
app.use("/asiento", asientoRoutes);
app.use("/lugar", lugarRoutes);

app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
});
