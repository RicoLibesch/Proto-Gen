import { Request, Response } from "express";
import { ProtocolType } from '../models/protocolTypeModel';
import { selectProtocolTypes, updateProtocolTypes } from '../services/protocolTypeService';




/**
 * Controller function to handle the retrieval of available protocol types.
 * @async
 * @function
 * @name getProtocolTypes
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const getProtocolTypes = async (req: Request, res: Response) => {
    try {
            /**
     * Array of available protocol types retrieved from the database.
     * @type {ProtocolType[]}
     */
        const protocolTypes: ProtocolType[] = await selectProtocolTypes();
        res.status(200).json(protocolTypes);
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};


/**
 * Controller function to handle the editing of protocol types.
 * @async
 * @function
 * @name editProtocolTypes
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const editProtocolTypes = async (req: Request, res: Response) => {
      /**
   * Array of protocol types with updated information provided in the request body.
   * @type {ProtocolType[]}
   */
    const protocolTypes: ProtocolType[] = req.body;

    //Check for name duplicates
    const titles: string[] = protocolTypes.map((type) => type.title);
    if(new Set(titles).size !== titles.length)
        return res.status(400).json({message: "The request contains duplicate titles. Duplicate values are not allowed."});

    try {
        await updateProtocolTypes(protocolTypes);
        res.status(200).json({message: "Protocol Types updated"});
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};