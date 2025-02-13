const express = require("express");
const router = express.Router();
const appUserController = require("../controllers/appUserController");

router.post("/register", appUserController.registerAppUser);

module.exports = router;
