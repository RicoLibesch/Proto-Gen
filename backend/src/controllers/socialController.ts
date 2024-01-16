import { Request, Response } from "express";
import { selectSocials, updateSocial } from '../services/socialService';
import { Social } from '../models/socialModel'







/**
 * Controller function to handle the retrieval of social media information.
 * @async
 * @function
 * @name getSocials
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const getSocials = async (req: Request, res: Response) => {
    try {
            /**
     * Array of social media information retrieved from the database.
     * @type {Social[]}
     */
        const socials: Social[] = await selectSocials();
        res.status(200).send(socials);
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};






/**
 * Controller function to handle the editing of social media information.
 * @async
 * @function
 * @name editSocial
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const editSocial = async (req: Request, res: Response) => {
      /**
   * The ID of the social media information to update, extracted from the request parameters.
   * @type {number}
   */
    const socialId: number = Number(req.params.id);
      /**
   * The updated value for the social media information, extracted from the request body.
   * @type {string}
   */
    const value: string = req.body.value;

    try {
        //Check if Protocol ID is an Integer
        if(isNaN(socialId))
            return res.status(400).json({message: 'Social ID must be an Integer.'});

        await updateSocial(socialId, value);
        res.status(200).json({message: `Social with ID ${req.params.id} updated`});
    } catch(err) {
        if(err.message === "Not found") {
            return res.status(404).json({message: `Social with ID ${socialId} found`});
        }

        return res.status(500).json({message: "Internal Server Error"});
    }
};