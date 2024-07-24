//Importar módulos
import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middlewares/error.handler.js';
import routerWarehouses from './routes/warehouses.js';

//Inicialización de la aplicación Express y configuración de dotenv
const app = express();
dotenv.config();

//Configuración del puerto
const PORT = process.env.PORT || 3010;

//Middlewares
app.use(express.json());
app.use('/warehouses', routerWarehouses);
app.use(errorHandler);

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`El puerto está siendo escuchado en http://localhost:${PORT}`);
});