// src/infrastructure/server/server.js

const express             = require('express');
const cors                = require('cors');
const bodyParser          = require('body-parser');
const dotenv              = require('dotenv');
const userController      = require('../controllers/UserController');
const bookController      = require('../controllers/BookController');
const authorController    = require('../controllers/AuthorController');
const editorialController = require('../controllers/EditorialController');
const connectDB           = require('../database/database');

dotenv.config();

const app = express();
const port = process.env.PORT || 3005;

// Conectar a la base de datos
connectDB();

// Configura CORS para permitir solicitudes desde http://localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(bodyParser.json());

//RUTA DE API BOOK
app.use('/api/book', bookController);

//RUTA DE API USER
app.use('/api/users', userController);

//RUTA DE API AUTHOR
app.use('/api/author', authorController);

//RUTA DE API EDITORIAL
app.use('/api/editorial', editorialController);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});