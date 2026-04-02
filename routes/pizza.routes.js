const router = require("express").Router()

const Pizza = require("../models/Pizza.model")



// POST /pizzas -- Create a new pizza
router.post("/pizzas", async (req, res, next) => {

    const newPizza = req.body

    try {
        const pizzaFromDB = await Pizza.create(newPizza)
        res.status(201).json(pizzaFromDB)
    } catch (err) {
        console.log("error creating a new pizza...\n\n", err)
        res.status(500).json({ error: "Error creating a new pizza in the DB..." })
    }
})


// GET /pizzas -- Get the list of pizzas
// GET /pizzas?maxPrice=16 -- all pizzas with a max price of 16
router.get("/pizzas", async (req, res, next) => {

    let { maxPrice } = req.query

    let filter = {}

    if (maxPrice !== undefined) {
        filter = { price: { $lte: maxPrice } }
    }

    try {
        const pizzasFromDB = await Pizza.find(filter).populate("cook")
        res.json(pizzasFromDB)
    } catch (err) {
        console.log("Error getting pizzas from DB... \n\n", err)
        res.status(500).json({ error: "Failed to get list of pizzas" })
    }
})


// GET /pizzas/:pizzaId -- Get the details for one pizza
router.get("/pizzas/:pizzaId", async (req, res, next) => {

    const { pizzaId } = req.params

    try {
        const pizzaFromDB = await Pizza.findById(pizzaId).populate("cook")
        res.json(pizzaFromDB)
    } catch (err) {
        console.log("Error getting pizza details from DB...\n\n", err);
        res.status(500).json({ error: "Failed to get pizza details" });
    }
})


// PUT /pizzas/:pizzaId -- Update one pizza
router.put("/pizzas/:pizzaId", async function (req, res, next) {

    const { pizzaId } = req.params;
    const newDetails = req.body;

    try {
        const pizzaFromDB = await Pizza.findByIdAndUpdate(pizzaId, newDetails, { new: true })
        res.json(pizzaFromDB)
    } catch (err) {
        console.error("Error updating pizza...", err);
        res.status(500).json({ error: "Failed to update a pizza" });
    }
})


// DELETE /pizzas/:pizzaId -- Delete one pizza
router.delete("/pizzas/:pizzaId", async (req, res, next) => {
    const { pizzaId } = req.params;

    try {
        const response = await Pizza.findByIdAndDelete(pizzaId)
        res.json(response)
    } catch (err) {
        console.error("Error deleting pizza...", err);
        res.status(500).json({ error: "Failed to delete a pizza" });
    }
})



module.exports = router