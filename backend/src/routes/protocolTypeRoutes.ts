const express = require("express");
const router = express.Router();
const {getProtocolTypes,
    getProtocolType,
    createProtocolType,
    editProtocolType
} = require("../controllers/protocolTypeController");

router.route("/").get(getProtocolTypes);

router.route("/").post(createProtocolType);

router.route("/:id").get(getProtocolType);

router.route("/:id").put(editProtocolType);

module.exports = router;