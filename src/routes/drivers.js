import { Router } from 'express';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const routerDriver = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const driversFilePath = path.join(_dirname, "../../data/drivers.json");

const readDriversFs = async () => {
    try{
        const driver = await fs.readFile(driversFilePath);
        return JSON.parse(driver);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`);
    }
};

const writeDriversFs = async(driver) => 
    await fs.writeFile(driversFilePath,JSON.stringify(driver,null,2));

//POST
routerDriver.post("/postDrivers" , async(req,res) => {
    const drivers = await readDriversFs();
    const newDriver = {
        id : drivers.length + 1,
        name : req.body.name
    }

    drivers.push(newDriver);
    await writeDriversFs(drivers);
    const response = {
        message: "Driver created successfully",
        driver: {
            id : newDriver.id,
            name : newDriver.name
        }
    }
    res.status(201).send(JSON.stringify(response));
});


//GET
routerDriver.get("/" , async (req,res) => {
    const drivers = await readDriversFs()
    const response = {
        drivers
    }
    res.status(200).send(JSON.stringify(response));
});

//GET BY ID
routerDriver.get("/:driverId" , async (req,res) => {
    const drivers = await readDriversFs();
    const driver = drivers.find(d => d.id === parseInt(req.params.driverId));
    if(!driver) return res.status(404).send("Driver not found");
    const response = {
        driver
    }
    res.status(200).send(JSON.stringify(response));
});

//PUT
routerDriver.put("/:id" , async (req,res) => {
    const drivers = await readDriversFs();
    const indexDriver = drivers.findIndex(d => d.id === parseInt(req.params.id));
    if(indexDriver === -1) return res.status(404).send("Driver not found");
    const updateDriver = {
        ...drivers[indexDriver],
        name : req.body.name
    }

    drivers[indexDriver] = updateDriver;
    await writeDriversFs(drivers);
    res.status(200).send(JSON.stringify(updateDriver));
});

//DELETE
routerDriver.delete("/delete/:id" , async(req,res) => {
    let drivers = await readDriversFs();
    const driver = drivers.find(d => d.id === parseInt(req.params.id));
    if(!driver) return res.status(404).send("Driver not found");
    drivers = drivers.filter(d => d.id !== driver.id);

    await writeDriversFs(drivers);
    let response = {
        message : "Driver deleted successfully"
    }
    res.status(200).send(JSON.stringify(response));
});

export default routerDriver;