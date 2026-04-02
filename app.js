const express = require("express")
const mongoose = require("mongoose")
const logger = require("morgan")

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


//
// Mount routes
//
app.use("/", require("./routes/pizza.routes.js"))
app.use("/", require("./routes/cook.routes.js"))



/****************/
/* START SERVER */
/****************/

app.listen(3000, () => { console.log("Server listening on port 3000....") })
