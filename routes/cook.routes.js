const router = require("express").Router()

const cookController = require("../controllers/cook.controller")


router.post("/cooks", cookController.create)


module.exports = router