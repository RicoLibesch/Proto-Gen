import { Request, Response } from "express";
import { Protocol } from '../models/protocolModel';
import { AttendanceList } from '../models/attendanceListModel'
import { insertProtocol, selectProtocolById, selectProtocols, selectAllProtocols } from '../services/protocolService';
import { isMailDispatchEnabled } from '../services/mailDispatchService';
import { sendMail } from '../services/sendMailService';

export const getProtocols = async (req: Request, res: Response) => {
    console.log("Get all Protocols");
    try {
        //Check if Query Parameters are an Integer
        if(req.query.page && isNaN(Number(req.query.page)))
            return res.status(400).json({message: 'Query Parameters must be an Integer.'});
        if(req.query.pageSize && isNaN(Number(req.query.pageSize)))
            return res.status(400).json({message: 'Query Parameters must be an Integer.'});

        const page: number = Number(req.query.page) || 1; 
        const pageSize: number = Number(req.query.pageSize) || 10;
        const protocols: Protocol[] = await selectProtocols(page, pageSize);
        res.status(200).json(protocols);
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const getAllProtocols = async (req: Request, res: Response) => {
    console.log("Export all Protocols");
    try {
        const protocols: Protocol[] = await selectAllProtocols();
        res.status(200).json(protocols);
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const createProtocol = async (req: Request, res: Response) => {
    const protocol_type: string = req.body.protocol_type;
    const start_timestamp: number = req.body.start_timestamp;
    const end_timestamp: number = req.body.end_timestamp;
    const content: string = req.body.content;
    const topics: string[] = req.body.topics;
    const attendanceData: AttendanceList = req.body.attendanceList;

    const protocol = new Protocol(protocol_type, start_timestamp, end_timestamp, content, topics, attendanceData);

    if(!protocol.isValidPayload()){
        return res.status(400).json({message: "Invalid payload"});
    }

    try {
        await insertProtocol(protocol);
        res.status(201).json({message: "Created new Protocol"});

        if(await isMailDispatchEnabled()) {
            sendMail(protocol);
        }
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const getProtocol = async (req: Request, res: Response) => {
    const protocolId: number = Number(req.params.id);
    try {
        //Check if Protocol ID is an Integer
        if(isNaN(protocolId))
            return res.status(400).json({message: 'Protocol ID must be an Integer.'});

        const protocol: Protocol = await selectProtocolById(protocolId);

        if(protocol === null)
            return res.status(404).json({message: `Protocol with ID ${protocolId} not found`});

        res.status(200).json(protocol);
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};