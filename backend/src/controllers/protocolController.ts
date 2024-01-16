import { Request, Response } from "express";
import { Protocol } from '../models/protocolModel';
import { AttendanceList } from '../models/attendanceListModel'
import { insertProtocol, selectProtocolById, selectProtocols, selectAllProtocols } from '../services/protocolService';
import { isMailDispatchEnabled } from '../services/mailDispatchService';
import { sendMail } from '../services/sendMailService';
import { selectReceiver } from '../services/mailReceiverService';


/**
 * Controller function to handle the retrieval of protocols.
 * @async
 * @function
 * @name getProtocols
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const getProtocols = async (req: Request, res: Response) => {
    try {
        //Check if Query Parameters are an Integer
        if(req.query.page && isNaN(Number(req.query.page)))
            return res.status(400).json({message: 'Query Parameters must be an Integer.'});
        if(req.query.pageSize && isNaN(Number(req.query.pageSize)))
            return res.status(400).json({message: 'Query Parameters must be an Integer.'});
    /**
     * The page number for pagination, defaulting to 1 if not provided.
     * @type {number}
     */
        const page: number = Number(req.query.page) || 1; 
            /**
     * The number of items per page for pagination, defaulting to 10 if not provided.
     * @type {number}
     */
        const pageSize: number = Number(req.query.pageSize) || 10;
            /**
     * Array of protocol objects retrieved from the database.
     * @type {Protocol[]}
     */
        const protocols: Protocol[] = await selectProtocols(page, pageSize);
        res.status(200).json(protocols);
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};


/**
 * Controller function to handle the retrieval of all protocols.
 * @async
 * @function
 * @name getAllProtocols
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const getAllProtocols = async (req: Request, res: Response) => {
    try {
            /**
     * Array of all protocol objects retrieved from the database.
     * @type {Protocol[]}
     */
        const protocols: Protocol[] = await selectAllProtocols();
        res.status(200).json(protocols);
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};


/**
 * Controller function to handle the creation of a new protocol.
 * @async
 * @function
 * @name createProtocol
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const createProtocol = async (req: Request, res: Response) => {
      /**
   * The type of the protocol provided in the request body.
   * @type {string}
   */
    const protocol_type: string = req.body.protocol_type;
      /**
   * The start timestamp of the protocol provided in the request body.
   * @type {number}
   */
    const start_timestamp: number = req.body.start_timestamp;
      /**
   * The end timestamp of the protocol provided in the request body.
   * @type {number}
   */
    const end_timestamp: number = req.body.end_timestamp;
      /**
   * The content of the protocol provided in the request body.
   * @type {string}
   */
    const content: string = req.body.content;
      /**
   * Array of topics associated with the protocol provided in the request body.
   * @type {string[]}
   */
    const topics: string[] = req.body.topics;
      /**
   * Object containing attendance data for the protocol provided in the request body.
   * @type {AttendanceList}
   */
    const attendanceData: AttendanceList = req.body.attendanceList;

    const protocol = new Protocol(protocol_type, start_timestamp, end_timestamp, content, topics, attendanceData);

    if(!protocol.isValidPayload()){
        return res.status(400).json({message: "Invalid payload"});
    }

    try {
        await insertProtocol(protocol);
        res.status(201).json({message: "Created new Protocol"});

        if(await isMailDispatchEnabled()) {
            const receiver: string[] = await selectReceiver();
            if(receiver.length > 0) {
                sendMail(protocol);
            }
        }
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};

/**
 * Controller function to handle the retrieval of a specific protocol by ID.
 * @async
 * @function
 * @name getProtocol
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const getProtocol = async (req: Request, res: Response) => {
      /**
   * The ID of the protocol to retrieve, extracted from the request parameters.
   * @type {number}
   */
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