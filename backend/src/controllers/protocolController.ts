const { Protocol } = require('../models/protocolModel');
const { AttendanceList } = require('../models/attendanceListModel');
const { insertProtocol, selectProtocolById, selectProtocols } = require('../services/protocolService');

const getProtocols = async (req, res) => {
    console.log("Get all Protocols");
    try {
        const protocols: typeof Protocol[] = await selectProtocols();
        res.status(200).json(protocols);
    } catch(err) {
        console.log(err);
        return res.status(404).json({message: `No Protocol found`});
    }
};

const createProtocol = async (req, res) => {
    const protocol_type: string = req.body.protocol_type;
    const start_timestamp: string = req.body.start_timestamp;
    const end_timestamp: string = req.body.end_timestamp;
    const content: string = req.body.content;
    const topics: string[] = req.body.topics;
    const attendanceData: { [role: string]: string[] } = req.body.attendanceList;

    const protocol = new Protocol(protocol_type, start_timestamp, end_timestamp, content, topics, attendanceData);

    if(!protocol.isValidPayload()){
        console.log("Invalid payload on create Protocol");
        return res.status(400).json({message: "Invalid payload"});
    }

    try {
        await insertProtocol(protocol);
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: "An unknown error occured"});
    }
    
    res.status(201).json({message: "Created new Protocol"});
};

const getProtocol = async (req, res) => {
    console.log(`Get Protocol ID ${req.params.id}`);
    try {
        const protocol: typeof Protocol = await selectProtocolById(req.params.id);
        res.status(200).json(protocol);
    } catch(err) {
        return res.status(404).json({message: `Protocol with ID ${req.params.id} not found`});
    }
    
    
};


module.exports = { 
    getProtocols,
    createProtocol,
    getProtocol
}