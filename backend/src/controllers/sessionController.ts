import { Request, Response } from "express";
import { isSessionActive, startSession, stopSession } from '../services/sessionService';
import { addAttendee, selectAttendees } from '../services/sessionAttendanceService';


/**
 * Controller function to handle the retrieval of session status.
 * @async
 * @function
 * @name getSessionStatus
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const getSessionStatus = async (req: Request, res: Response) => {
    try {
            /**
     * Boolean indicating whether the session is currently active.
     * @type {boolean}
     */
        const isActive: boolean = await isSessionActive();
            /**
     * The status string based on the session's active status.
     * @type {string}
     */
        const status = isActive ? "active" : "inactive";
        res.status(200).json({status: status});
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};


/**
 * Controller function to handle the starting of a new session.
 * @async
 * @function
 * @name postSession
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
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





/**
 * Controller function to handle the stopping of the current session.
 * @async
 * @function
 * @name deleteSession
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const deleteSession = async (req: Request, res: Response) => {
    try {
        await stopSession();
        res.status(200).json({message: "Session stopped"});
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }    
};




/**
 * Controller function to handle the retrieval of attendees during an active session.
 * @async
 * @function
 * @name getAttendees
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
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



/**
 * Controller function to handle the addition of an attendee to the active session.
 * @async
 * @function
 * @name postAttendee
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
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