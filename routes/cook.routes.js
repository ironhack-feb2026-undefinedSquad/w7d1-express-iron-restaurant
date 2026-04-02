const router = require("express").Router()

const Cook = require("../models/Cook.model")


// POST /cooks -- Create a new cook
router.post('/cooks', async (req, res, next) => {
    const newCook = req.body
    try {
        const cookFromDB = await Cook.create(newCook)
        res.status(201).json(cookFromDB)
    } catch (err) {
        console.log("Error creating a new cook in the DB...", err)
        res.status(500).json({ error: "Failed to create a new cook" })
    }
})


module.exports = router