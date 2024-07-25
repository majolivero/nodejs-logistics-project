//Importar módulos
import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middlewares/error.handler.js';
import routerWarehouses from './routes/warehouses.js';
import routerShipments from './routes/shipments.js';
import routerDrivers from './routes/drivers.js';
import routerVehicles from './routes/vehicles.js';

//Inicialización de la aplicación Express y configuración de dotenv
const app = express();
dotenv.config();

//Configuración del puerto
const PORT = process.env.PORT || 3010;

//Middlewares
app.use(express.json());
app.use('/warehouses', routerWarehouses);
app.use('/shipments', routerShipments);
app.use('/drivers', routerDrivers);
app.use('/vehicles', routerVehicles);
app.use(errorHandler);

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`El puerto está siendo escuchado en http://localhost:${PORT}`);
});