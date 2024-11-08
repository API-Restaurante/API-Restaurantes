const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require('method-override');

const reservaRoutes = require("./routes/reservaRoutes");
const userRoutes = require("./routes/authRoutes");

require("dotenv").config();

// Middleware para permitir o uso do _method
app.use(methodOverride('_method'));
// Suas rotas e outras configurações
app.delete('/api/auth/delete/:id', authController.delete);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require("./config/db");
connectDB();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', userRoutes);
app.use('/api/reservas', reservaRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Rodando em http://localhost:${PORT}`));
