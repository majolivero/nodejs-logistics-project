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
    const warehouses = await readWarehousesFs();
    const newWarehouse = {
        id : warehouses.length + 1,
        name : req.body.name,
        location : req.body.location
    }

    warehouses.push(newWarehouse);
    await writeWarehousesFs(warehouses);
    const response = {
        message: "Warehouse created successfully",
        warehouse: {
            id : newWarehouse.id,
            name : newWarehouse.name,
            location : newWarehouse.location
        }
    }
    res.status(201).send(JSON.stringify(response));
});

//GET
routerWarehouse.get("/" , async (req,res) => {
    const warehouses = await readWarehousesFs()
    const response = {
        warehouses
    }
    res.status(200).send(JSON.stringify(response));
});

//GET BY ID
routerWarehouse.get("/:warehouseId" , async (req,res) => {
    const warehouses = await readWarehousesFs();
    const warehouse = warehouses.find(w => w.id === parseInt(req.params.warehouseId));
    if(!warehouse) return res.status(404).send("Warehouse not found");
    const response = {
        warehouse
    }
    res.status(200).send(JSON.stringify(response));
})

//PUT BY ID
routerWarehouse.put("/:id" , async (req,res) => {
    const warehouses = await readWarehousesFs();
    const indexWarehouse = warehouses.findIndex(w => w.id === parseInt(req.params.id));
    if(indexWarehouse === -1) return res.status(404).send("Warehouse not found");
    const updateWarehouse = {
        ...warehouses[indexWarehouse],
        name : req.body.name,
        location: req.body.location
    }

    warehouses[indexWarehouse] = updateWarehouse;
    await writeWarehousesFs(warehouses);
    res.status(200).send(JSON.stringify(updateWarehouse));
});

//DELETE BY ID
routerWarehouse.delete("/delete/:id" , async(req,res) => {
    let warehouses = await readWarehousesFs();
    const warehouse = warehouses.find(w => w.id === parseInt(req.params.id));
    if(!warehouse) return res.status(404).send("Warehouse not found");
    warehouses = warehouses.filter(w => w.id !== warehouse.id);

    await writeWarehousesFs(warehouses);
    let response = {
        message : "Warehouse deleted successfully"
    }
    res.status(200).send(JSON.stringify(response));
});

export default routerWarehouse;