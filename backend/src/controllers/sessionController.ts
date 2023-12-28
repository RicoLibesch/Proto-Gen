import { Request, Response } from "express";
import { isSessionActive, startSession, stopSession } from '../services/sessionService';
import { addAttendee, selectAttendees } from '../services/sessionAttendanceService';

export const getSessionStatus = async (req: Request, res: Response) => {
    try {
        const isActive: boolean = await isSessionActive();
        const status = isActive ? "active" : "inactive";
        res.status(200).json({status: status});
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const postSession = async (req: Request, res: Response) => {
    try {
        if(await isSessionActive())
            return res.status(409).json({message: "Session started already"});

        await startSession();    
        res.status(200).json({message: "Session started"});
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const deleteSession = async (req: Request, res: Response) => {
    try {
        await stopSession();
        res.status(200).json({message: "Session stopped"});
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }    
};

export const getAttendees = async (req: Request, res: Response) => {
    try {
        if(!await isSessionActive())
            return res.status(404).json({message: "No running Session"});

        const attendees: string[] = await selectAttendees();
        res.status(200).json({attendees: attendees});
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const postAttendee = async (req: Request, res: Response) => {
    if(!req.body.name)
        return res.status(400).json({message: "Request body must contain a name to add to the session"});
    
    try {
        if(!await isSessionActive())
            return res.status(404).json({message: "No running Session"});

        const name: string = req.body.name;
        await addAttendee(name);
        res.status(201).json({message: "User added to Session"});
    } catch(err) {
    return res.status(500).json({message: "Internal Server Error"});
    }
};