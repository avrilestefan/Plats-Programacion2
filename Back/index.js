const mongoose = require("mongoose")
const cors = require ("cors")
const express = require ("express")



const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hola Mundo")
})