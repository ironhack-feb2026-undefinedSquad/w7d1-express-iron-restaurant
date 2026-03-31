const express = require("express")
const logger = require("morgan")

const pizzasArr = require("./data/pizzas")


const app = express()


// Make the static files inside of the `public/` folder publicly accessible
app.use(express.static("public"))

// Setup the request logger to run on each request
app.use(logger("dev"))

// JSON middleware to parse incoming HTTP requests that contain JSON
app.use(express.json());




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


// GET /pizzas -- all pizzas
// GET /pizzas?maxPrize=16 -- all pizzas with a max price of 16
app.get("/pizzas", (req, res, next) => {

    let { maxPrice } = req.query

    // if maxPrice is undefined, return an array with all the pizzas
    if (maxPrice === undefined) {
        res.json(pizzasArr)
        return
    }

    // if we have maxPrice, then we return only the pizzas with that maxPrice
    const result = pizzasArr.filter((element, i, arr) => {
        return element.price <= parseFloat(maxPrice)
    })

    res.json(result)
})


// GET /pizzas/:pizzaId
app.get("/pizzas/:pizzaId", (req, res, next) => {

    let { pizzaId } = req.params // note: we get pizzaId as a string
    pizzaId = parseInt(pizzaId) // convert to an integer

    const result = pizzasArr.find((element, i, arr) => {
        return element.id === pizzaId
    })
    
    res.json(result)
})




/****************/
/* START SERVER */
/****************/

app.listen(3000, () => { console.log("Server listening on port 3000....") })
