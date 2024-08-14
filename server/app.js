const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use('/ptoquienmelea',express.static(path.join(__dirname,process.env.STATIC,'css')));
app.use('/js',express.static(path.join(__dirname,process.env.STATIC,'js')));
app.use('/storage',express.static(path.join(__dirname,process.env.STATIC,'storage')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,process.env.STATIC,'index.html'));
});

app.get("/servicio", (req, res) => {
    res.sendFile(path.join(__dirname,process.env.STATIC,'views/servicio.html'));
});

app.use((req, res) => {
    res.status(404).send("Página no encontrada");
})

let config = {
    port: process.env.PORT,
    host: process.env.HOST
}

app.listen(config, () => {
    console.log(`Servidor iniciado en http://${config.host}:${config.port}`);
});

