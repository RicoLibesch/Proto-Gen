const express = require("express");
const router = express.Router();
const {getProtocols, createProtocol, getProtocol} = require("../controllers/protocolController");

router.route("/").get(getProtocols);

router.route("/").post(createProtocol);

router.route("/:id").get(getProtocol);

module.exports = router;