import { Request, Response } from "express";
import { selectReceiver, updateReceiver } from '../services/mailReceiverService';
import { isMailDispatchEnabled, updateMailDispatch } from '../services/mailDispatchService';
import { selectTemplate, updateTemplate } from '../services/mailTemplateService';
import { isBoolean } from "util";







/**
 * Controller function to handle the retrieval of receiver email addresses.
 * @async
 * @function
 * @name getReceiver
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const getReceiver = async (req: Request, res: Response) => {
    
    try {
            /**
     * Array of email addresses representing receivers.
     * @type {string[]}
     */
        const mails: string[] = await selectReceiver();
        res.status(200).json(mails);
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};






/**
 * Controller function to handle the editing of receiver email addresses.
 * @async
 * @function
 * @name editReceiver
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const editReceiver = async (req: Request, res: Response) => {
      /**
   * Array of email addresses provided in the request body.
   * @type {string[]}
   */
    const mails: string[] = req.body;

    //Check if mails are valid
    const validMail = /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)*$/;
    if(!mails.every((mail) => validMail.test(mail)))
        return res.status(400).json({message: "Payload must be valid email adresses"});

    //Check for duplicates
    if(new Set(mails).size !== mails.length)
        return res.status(400).json({message: "The request contains duplicate entries. Duplicate values are not allowed."});

    try {
        await updateReceiver(mails);
        res.status(200).json({message: "Mails updated"});
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};



/**
 * Controller function to handle the retrieval of the mail dispatch status.
 * @async
 * @function
 * @name getDispatchStatus
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const getDispatchStatus = async (req: Request, res: Response) => {
    try {
            /**
     * Object indicating whether mail dispatch is enabled or not.
     * @type {{ isEnabled: boolean }}
     */
        res.status(200).json({isEnabled: await isMailDispatchEnabled()});
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }    
};


/**
 * Controller function to handle the setting of mail dispatch status.
 * @async
 * @function
 * @name setDispatchStatus
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const setDispatchStatus = async (req: Request, res: Response) => {
    try {
            /**
     * Boolean indicating whether mail dispatch should be enabled or disabled.
     * @type {boolean}
     */
        const setEnabled: boolean = req.body.setEnabled;
        if(!isBoolean(setEnabled))
            return res.status(400).json({message: 'Status must be a Boolean.'});

        await updateMailDispatch(setEnabled);

        const message = setEnabled ? "Sending mails activated" : "Sending mails deactivated";

        res.status(200).json({message: message});
    } catch(err) {
    return res.status(500).json({message: "Internal Server Error"});
    }
};



/**
 * Controller function to handle the retrieval of email templates.
 * @async
 * @function
 * @name getTemplates
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const getTemplates = async (req: Request, res: Response) => {
    try {
            /**
     * The email subject template retrieved from the database.
     * @type {string}
     */
        const subject = await selectTemplate("subject");
            /**
     * The email body template retrieved from the database.
     * @type {string}
     */
        const body = await selectTemplate("body");
        res.status(200).json({subject: subject, body: body});
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};


/**
 * Controller function to handle the setting of email templates.
 * @async
 * @function
 * @name setTemplate
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const setTemplate = async (req: Request, res: Response) => {
      /**
   * The type of email template (subject or body) provided in the request body.
   * @type {string}
   */
    const type: string = req.body.type;
      /**
   * The updated value for the email template provided in the request body.
   * @type {string}
   */
    const value: string = req.body.value;

    //Check for required fields
    if(!type || !value)
        return res.status(400).json({message: "type and value must be set as body attributes"});

    //Check if type is valid
    if(type !== "subject" && type !== "body")
        return res.status(400).json({message: "Type must be subject or body"});

    try {
        await updateTemplate(type, value);
        res.status(200).json({message: `Template for ${type} updated`});
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};