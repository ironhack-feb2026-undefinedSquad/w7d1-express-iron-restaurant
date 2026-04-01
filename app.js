const express = require("express")
const mongoose = require("mongoose")
const logger = require("morgan")

const Pizza = require("./models/Pizza.model")
const Cook = require("./models/Cook.model.js")

mongoose.set('runValidators', true);

const app = express()


// Make the static files inside of the `public/` folder publicly accessible
app.use(express.static("public"))

// Setup the request logger to run on each request
app.use(logger("dev"))

// JSON middleware to parse incoming HTTP requests that contain JSON
app.use(express.json());


/*********************/
/* Connect to the DB */
/*********************/

mongoose.connect("mongodb://127.0.0.1:27017/express-restaurant")
    .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
    .catch(err => console.error("Error connecting to mongo", err));



/**********/
/* ROUTES */
/**********/

// app.get(path, code)
// app.get(path, (req, res, next) => {})


// GET /
app.get("/", (req, res, next) => {
    console.log("we received a GET request for the HOME page...");
    // res.send("")    
    res.sendFile(__dirname + "/views/home.html")
})

// GET /contact
app.get("/contact", (req, res, next) => {
    console.log("we received a GET request for the CONTACT page...");
    // res.send("")
    res.sendFile(__dirname + "/views/contact.html")
})


// POST /pizzas -- Create a new pizza
app.post("/pizzas", async (req, res, next) => {
    
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
app.get("/pizzas", async (req, res, next) => {

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
app.get("/pizzas/:pizzaId", async (req, res, next) => {

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
app.put("/pizzas/:pizzaId", async function (req, res, next) {

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
app.delete("/pizzas/:pizzaId", async (req, res, next) => {
    const {pizzaId} = req.params;

    try {
        const response = await Pizza.findByIdAndDelete(pizzaId)
        res.json(response)
    } catch (err) {
        console.error("Error deleting pizza...", err);
        res.status(500).json({ error:  "Failed to delete a pizza" });
    }
})



// POST /cooks -- Create a new cook
app.post('/cooks', async (req, res, next) => {

    const newCook = req.body

    try {
        const cookFromDB = await Cook.create(newCook)
        res.status(201).json(cookFromDB)
    } catch (err) {
        console.log("Error creating a new cook in the DB...", err)
        res.status(500).json({ error: "Failed to create a new cook" })
    }
})



/****************/
/* START SERVER */
/****************/

app.listen(3000, () => { console.log("Server listening on port 3000....") })
