// src/infrastructure/server/server.js

const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const dotenv     = require('dotenv');
const connectDB  = require('../database/database');

const userController            = require('../controllers/UserController');
const bookController            = require('../controllers/BookController');
const authorController          = require('../controllers/AuthorController');
const editorialController       = require('../controllers/EditorialController');
const userBookController        = require('../controllers/UserBookController');
const searchBookController      = require('../controllers/SearchBookController');
const readingSessionsController = require('../controllers/ReadingSessionsController');
const reviewBookController      = require('../controllers/ReviewBookController');

const path = require('path');
const PATH_UPLOADS = path.join(__dirname, '../../../uploads');

dotenv.config();

const app = express();
const port = process.env.PORT || 3005;

// Conectar a la base de datos
connectDB();

// Configura CORS para permitir solicitudes desde http://localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(bodyParser.json());

// DESCARGA DE ARCHIVOS ESTATICOS
app.use('/uploads', express.static(PATH_UPLOADS));

//RUTA DE API BOOK
app.use('/api/book', bookController);

//RUTA DE API USER
app.use('/api/users', userController);

//RUTA DE API AUTHOR
app.use('/api/author', authorController);

//RUTA DE API EDITORIAL
app.use('/api/editorial', editorialController);

//RUTA DE API USERBOOK
app.use('/api/userbook', userBookController);

// RUTA API PARA BUSQUEDA DE LIBROS
app.use('/api/search', searchBookController);

// RUTA API PARA REGISTRO DE SESIONES DE LECTURA
app.use('/api/reading-sessions',readingSessionsController);

// RUTA API PARA REGISTRO DE REVIEWS
app.use('/api/review', reviewBookController);

// RUTA API PARA EL REGISTRO DE METAS DE USUARIO
app.use('/api/usergoal', require('../controllers/UserGoalController'));

app.listen(port, () => {
  console.info(`Servidor escuchando en http://localhost:${port}`);
});