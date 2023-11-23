import { ProtocolType } from '../models/protocolTypeModel';
import { insertProtocolType, selectProtocolTypeById, selectProtocolTypes, updateProtocolType } from '../services/protocolTypeService';

export const getProtocolTypes = async (req, res) => {
    console.log("Get Protocol Types");
    try {
        const protocolTypes: ProtocolType[] = await selectProtocolTypes();
        res.status(200).json(protocolTypes);
    } catch(err) {
        return res.status(404).json({message: `No Protocol Types found`});
    }
};

export const getProtocolType = async (req, res) => {
    console.log(`Get Protocol Type with ID ${req.params.id}`);
    try {
        const protocolType: ProtocolType = await selectProtocolTypeById(req.params.id);
        res.status(200).json(protocolType);
    } catch(err) {
        return res.status(404).json({message: `Protocol Type with ID ${req.params.id} not found`});
    }
};

export const createProtocolType = async (req, res) => {
    const title: string = req.body.title;
    const template: string = req.body.template;
    const protocolType: ProtocolType = new ProtocolType(title, template);    
    console.log("Create Protocol Type");

    try {
        await insertProtocolType(protocolType);
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: `An unknown error occured`});
    }
    res.status(201).json({message: "Created new Protocol Type"});
};

export const editProtocolType = async (req, res) => {
    console.log(`Update Protocol Type with ID ${req.params.id}`);
    const title: string = req.body.title;
    const template: string = req.body.template;
    const protocolType: ProtocolType = new ProtocolType(title, template);
    try {
        await updateProtocolType(req.params.id, protocolType);
        res.status(200).json({message: "Protocol Type updated"});
    } catch(err) {
        console.log(err);
        return res.status(404).json({message: `Protocol Typ with ID ${req.params.id} not found`});
    }
};