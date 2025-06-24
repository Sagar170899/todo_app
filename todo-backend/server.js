const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const connectDB = require("./db")
const todoRoutes = require("./routes/todoRoutes")


dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())

app.use("/api", todoRoutes)

connectDB()

// const express = require("express")
// const cors = require("cors")
// const bodyParser = require("body-parser")
// const dotenv = require("dotenv")
// const connectDB = require("./db")
// const todoRoutes = require("./routes/todoRoutes")

// // ADD THIS CONSOLE.LOG
// console.log("Type of todoRoutes:", typeof todoRoutes);
// console.log("Is todoRoutes an Express router instance?", todoRoutes.stack); // Check if it has router properties


// dotenv.config()

// const app = express()
// app.use(cors())
// app.use(bodyParser.json())
// app.use(express.json()) // You only need one of bodyParser.json() or express.json()

// app.use("/api", todoRoutes) // This is where the error is thrown

// connectDB()

// const PORT = process.env.PORT || 3001
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`)
// })


module.exports = app