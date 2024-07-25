import { Router } from 'express';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const routerVehicle = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const vehiclesFilePath = path.join(_dirname, "../../data/vehicles.json");

const readVehiclesFs = async () => {
    try{
        const vehicle = await fs.readFile(vehiclesFilePath);
        return JSON.parse(vehicle);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`);
    }
};

const writeVehiclesFs = async(vehicle) => 
    await fs.writeFile(vehiclesFilePath,JSON.stringify(vehicle,null,2));


//POST
routerVehicle.post("/postVehicles" , async(req,res) => {
    const vehicles = await readVehiclesFs();
    const newVehicle = {
        id : vehicles.length + 1,
        model : req.body.model,
        year : req.body.year
    }

    vehicles.push(newVehicle);
    await writeVehiclesFs(vehicles);
    const response = {
        message: "Vehicle created successfully",
        vehicle: {
            id : newVehicle.id,
            model : newVehicle.model,
            year : newVehicle.year
        }
    }
    res.status(201).send(JSON.stringify(response));
});

//GET
routerVehicle.get("/" , async (req,res) => {
    const vehicles = await readVehiclesFs()
    const response = {
        vehicles
    }
    res.status(200).send(JSON.stringify(response));
});

//GET BY ID
routerVehicle.get("/:vehicleId" , async (req,res) => {
    const vehicles = await readVehiclesFs();
    const vehicle = vehicles.find(v => v.id === parseInt(req.params.vehicleId));
    if(!vehicle) return res.status(404).send("Vehicle not found");
    const response = {
        vehicle
    }
    res.status(200).send(JSON.stringify(response));
});

//PUT
routerVehicle.put("/:id" , async (req,res) => {
    const vehicles = await readVehiclesFs();
    const indexVehicle = vehicles.findIndex(v => v.id === parseInt(req.params.id));
    if(indexVehicle === -1) return res.status(404).send("Vehicle not found");
    const updateVehicle = {
        ...vehicles[indexVehicle],
        model : req.body.model,
        year : req.body.year
    }

    vehicles[indexVehicle] = updateVehicle;
    await writeVehiclesFs(vehicles);
    res.status(200).send(JSON.stringify(updateVehicle));
});

//DELETE
routerVehicle.delete("/delete/:id" , async(req,res) => {
    let vehicles = await readVehiclesFs();
    const vehicle = vehicles.find(v => v.id === parseInt(req.params.id));
    if(!vehicle) return res.status(404).send("Vehicle not found");
    vehicles = vehicles.filter(v => v.id !== vehicle.id);

    await writeVehiclesFs(vehicles);
    let response = {
        message : "Vehicle deleted successfully"
    }
    res.status(200).send(JSON.stringify(response));
});












export default routerVehicle;