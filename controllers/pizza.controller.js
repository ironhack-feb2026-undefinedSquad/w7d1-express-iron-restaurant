const Pizza = require("../models/Pizza.model")


// Create a new pizza
const create = async (req, res, next) => {
    const newPizza = req.body

    try {
        const pizzaFromDB = await Pizza.create(newPizza)
        res.status(201).json(pizzaFromDB)
    } catch (err) {
        console.log("error creating a new pizza...\n\n", err)
        res.status(500).json({ error: "Error creating a new pizza in the DB..." })
    }
}


// Get the list of pizzas
// (also allows to filter with a query string, like "?maxPrice=16")
const getAll = async (req, res, next) => {
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
}


// Get the details for one pizza
const getById = async (req, res, next) => {
    const { pizzaId } = req.params

    try {
        const pizzaFromDB = await Pizza.findById(pizzaId).populate("cook")
        res.json(pizzaFromDB)
    } catch (err) {
        console.log("Error getting pizza details from DB...\n\n", err);
        res.status(500).json({ error: "Failed to get pizza details" });
    }
}


// Update one pizza
const update = async (req, res, next) => {
    const { pizzaId } = req.params;
    const newDetails = req.body;

    try {
        const pizzaFromDB = await Pizza.findByIdAndUpdate(pizzaId, newDetails, { new: true })
        res.json(pizzaFromDB)
    } catch (err) {
        console.error("Error updating pizza...", err);
        res.status(500).json({ error: "Failed to update a pizza" });
    }
}


// Delete one pizza
const remove = async (req, res, next) => {
    const { pizzaId } = req.params;

    try {
        const response = await Pizza.findByIdAndDelete(pizzaId)
        res.json(response)
    } catch (err) {
        console.error("Error deleting pizza...", err);
        res.status(500).json({ error: "Failed to delete a pizza" });
    }
}


module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
}
