const express = require("express");
const app = express();

require('dotenv').config();

const connectDB = require('./config/db')
connectDB()

app.use(express.json())

app.use(express.static('public'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>  console.log(`rodano em http://localhost:${PORT}`))

