const express = require("express");
const AsientoController = require("../controllers/asientoController");

const router = express.Router();
const asientoController = new AsientoController();

router.post("/:action", asientoController.handleRequest.bind(asientoController));

module.exports = router;
