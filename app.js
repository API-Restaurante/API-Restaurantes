const express = require("express")
const bodyParser = require("body-parser")

const reservaRoutes = require("./routes/reservaRoutes")
const userRoutes = require('./routes/userRoutes');


const app = express()

require('dotenv').config();

const connectDB = require('./config/db')
connectDB()

app.use(bodyParser.json());
app.use(express.json())


app.use('/reserva', reservaRoutes)
app.use('/login', userRoutes)


//app.use(express.static('public'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>  console.log(`rodano em http://localhost:${PORT}`))

