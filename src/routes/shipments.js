import { Router } from 'express';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const routerShipment = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const shipmentsFilePath = path.join(_dirname, "../../data/shipments.json");

const readShipmentsFs = async () => {
    try{
        const shipment = await fs.readFile(shipmentsFilePath);
        return JSON.parse(shipment);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`);
    }
};

const writeShipmentsFs = async(shipment) => 
    await fs.writeFile(shipmentsFilePath,JSON.stringify(shipment,null,2));


//POST
routerShipment.post("/postShipments" , async(req,res) => {
    const shipments = await readShipmentsFs();
    const newShipment = {
        id : shipments.length + 1,
        item : req.body.item,
        quantity : req.body.quantity,
        warehouseId : req.body.warehouseId
    }

    shipments.push(newShipment);
    await writeShipmentsFs(shipments);
    const response = {
        message: "Shipment created successfully",
        shipment: {
            id : newShipment.id,
            item : newShipment.item,
            quantity : newShipment.quantity,
            warehouseId : newShipment.warehouseId
        }
    }
    res.status(201).send(JSON.stringify(response));
});

//GET
routerShipment.get("/" , async (req,res) => {
    const shipments = await readShipmentsFs()
    const response = {
        shipments
    }
    res.status(200).send(JSON.stringify(response));
});

//GET BY ID
routerShipment.get("/:shipmentId" , async (req,res) => {
    const shipments = await readShipmentsFs();
    const shipment = shipments.find(s => s.id === parseInt(req.params.shipmentId));
    if(!shipment) return res.status(404).send("Shipment not found");
    const response = {
        shipment
    }
    res.status(200).send(JSON.stringify(response));
});

//PUT
routerShipment.put("/:id" , async (req,res) => {
    const shipments = await readShipmentsFs();
    const indexShipment = shipments.findIndex(s => s.id === parseInt(req.params.id));
    if(indexShipment === -1) return res.status(404).send("Shipment not found");
    const updateShipment = {
        ...shipments[indexShipment],
        item : req.body.item,
        quantity : req.body.quantity,
        warehouseId : req.body.warehouseId
    }

    shipments[indexShipment] = updateShipment;
    await writeShipmentsFs(shipments);
    res.status(200).send(JSON.stringify(updateShipment));
});

//DELETE
routerShipment.delete("/delete/:id" , async(req,res) => {
    let shipments = await readShipmentsFs();
    const shipment = shipments.find(s => s.id === parseInt(req.params.id));
    if(!shipment) return res.status(404).send("Shipment not found");
    shipments = shipments.filter(s => s.id !== shipment.id);

    await writeShipmentsFs(shipments);
    let response = {
        message : "Shipment deleted successfully"
    }
    res.status(200).send(JSON.stringify(response));
});

export default routerShipment;
