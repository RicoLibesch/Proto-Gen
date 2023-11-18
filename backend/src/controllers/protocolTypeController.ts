const { ProtocolType } = require('../models/protocolTypeModel');
const { insertProtocolType, selectProtocolTypeById, selectProtocolTypes, updateProtocolType } = require('../services/protocolTypeService');

const getProtocolTypes = async (req, res) => {
    console.log("Get Protocol Types");
    try {
        const protocolTypes: typeof ProtocolType[] = await selectProtocolTypes();
        res.status(200).json(protocolTypes);
    } catch(err) {
        return res.status(404).json({message: `No Protocol Types found`});
    }
};

const getProtocolType = async (req, res) => {
    console.log(req.params);
    console.log(`Get Protocol Type with ID ${req.params.id}`);
    try {
        const protocolType: typeof ProtocolType = await selectProtocolTypeById(req.params.id);
        res.status(200).json(protocolType);
    } catch(err) {
        return res.status(404).json({message: `Protocol Type with ID ${req.params.id} not found`});
    }
};

const createProtocolType = async (req, res) => {
    const title: string = req.body.title;
    const template: string = req.body.template;
    const protocolType = new ProtocolType(title, template);    
    console.log("Create Protocol Type");

    try {
        await insertProtocolType(protocolType);
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: `An unknown error occured`});
    }
    res.status(201).json({message: "Created new Protocol Type"});
};

const editProtocolType = async (req, res) => {
    console.log(`Update Protocol Type with ID ${req.params.id}`);
    const title: string = req.body.title;
    const template: string = req.body.template;
    const protocolType = new ProtocolType(title, template);
    try {
        console.log(req.params.id);
        await updateProtocolType(req.params.id, protocolType);
        res.status(200).json({message: "Protocol Type updated"});
    } catch(err) {
        console.log(err);
        return res.status(404).json({message: `Protocol Typ with ID ${req.params.id} not found`});
    }
};


module.exports = { 
    getProtocolTypes,
    getProtocolType,
    createProtocolType,
    editProtocolType
}