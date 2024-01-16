import { Request, Response } from "express";
import { updateLogo, selectLogo } from '../services/logoService';





/**
 * Controller function to handle the retrieval of the logo.
 * @async
 * @function
 * @name getLogo
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const getLogo = async (req: Request, res: Response) => {
    
    try {
            /**
     * The logo content retrieved from the database.
     * @type {string}
     */
        const logo: string = await selectLogo();

        if(logo === null)
            return res.status(404).json({message: 'No Logo found'});

        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(logo);
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};





/**
 * Controller function to handle the editing of the logo.
 * @async
 * @function
 * @name editLogo
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const editLogo = async (req: Request, res: Response) => {
      /**
   * The base64-encoded image content provided in the request body.
   * @type {string}
   */
    const image: string = req.body.image;

    try {
        await updateLogo(image);
        res.status(200).json({message: "Logo updated"});
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};