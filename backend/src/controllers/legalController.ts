import { Request, Response } from "express";
import { selectLegals, updateLegal } from '../services/legalService';
import { Legal } from '../models/legalModel'



/**
 * Controller function to handle the retrieval of legal information.
 * @async
 * @function
 * @name getLegals
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const getLegals = async (req: Request, res: Response) => {
    try {
            /**
     * Array of legal information retrieved from the database.
     * @type {Legal[]}
     */
        const legals: Legal[] = await selectLegals();
        res.status(200).send(legals);
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};





/**
 * Controller function to handle the editing of legal information.
 * @async
 * @function
 * @name editLegal
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const editLegal = async (req: Request, res: Response) => {
      /**
   * The legal ID extracted from the request parameters.
   * @type {number}
   */
    const legalId: number = Number(req.params.id);
      /**
   * The updated value for the legal information extracted from the request body.
   * @type {string}
   */
    const value: string = req.body.value;

    try {
        //Check if Legal ID is an Integer
        if(isNaN(legalId))
            return res.status(400).json({message: 'Legal ID must be an Integer.'});

        await updateLegal(legalId, value);
        res.status(200).json({message: `Legal with ID ${req.params.id} updated`});
    } catch(err) {
        if(err.message === "Not found") {
            return res.status(404).json({message: `Legal with ID ${legalId} found`});
        }

        return res.status(500).json({message: "Internal Server Error"});
    }
};