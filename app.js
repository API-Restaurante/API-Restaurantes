const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require('method-override');

const reservaRoutes = require("./routes/reservaRoutes");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

// Middleware para permitir o uso do _method
app.use(methodOverride('_method'));

const connectDB = require("./config/db");
connectDB()

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));



// Uso das rotas de usuário e reserva
app.use('/api/auth', authRoutes);
app.use("/reserva", reservaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Rodando em http://localhost:${PORT}`));