const express = require("express");
const asientoRoutes = require("./routes/asientoRoutes");

const app = express();
app.use(express.json());
app.use("/asiento", asientoRoutes);

app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
});
