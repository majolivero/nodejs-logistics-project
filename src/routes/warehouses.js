//Importar módulos
import { Router } from 'express';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

//Configuración del router y rutas de archivos
const routerWarehouse = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const warehousesFilePath = path.join(_dirname, "../../data/warehouses.json");

//Funciones para leer y escribir en el archivo JSON
const readWarehousesFs = async () => {
    try{
        const warehouse = await fs.readFile(warehousesFilePath);
        return JSON.parse(warehouse);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`);
    }
};

const writeWarehousesFs = async(warehouse) => 
    await fs.writeFile(warehousesFilePath,JSON.stringify(warehouse,null,2));


// //Rutas del router
// //POST
routerWarehouse.post("/postWarehouses" , async(req,res) => {
    const warehouse = await readWarehousesFs();
    const newWarehouse = {
        id : warehouse.length + 1,
        name : req.body.name,
        location : req.body.location
    }

    warehouse.push(newWarehouse);
    await writeWarehousesFs(warehouse);
    const response = {
        message: "Warehouse created successfully",
        warehouse: {
            id : newWarehouse.id,
            name : newWarehouse.name,
            location : newWarehouse.location
        }
    }
    res.status(201).send(`Warehouse created successfully ${JSON.stringify(response)}`);
});







export default routerWarehouse;