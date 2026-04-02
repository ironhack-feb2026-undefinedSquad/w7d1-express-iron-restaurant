const router = require("express").Router()

const pizzaController = require("../controllers/pizza.controller")


router.post("/pizzas", pizzaController.create)
router.get("/pizzas", pizzaController.getAll)
router.get("/pizzas/:pizzaId", pizzaController.getById)
router.put("/pizzas/:pizzaId", pizzaController.update)
router.delete("/pizzas/:pizzaId", pizzaController.remove)


module.exports = router