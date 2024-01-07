import { Request, Response } from "express";
import { selectReceiver, updateReceiver } from '../services/mailReceiverService';
import { isMailDispatchEnabled, updateMailDispatch } from '../services/mailDispatchService';
import { selectTemplate, updateTemplate } from '../services/mailTemplateService';
import { isBoolean } from "util";

export const getReceiver = async (req: Request, res: Response) => {
    try {
        const mails: string[] = await selectReceiver();
        res.status(200).json(mails);
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const editReceiver = async (req: Request, res: Response) => {
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

export const getDispatchStatus = async (req: Request, res: Response) => {
    try {
        res.status(200).json({isEnabled: await isMailDispatchEnabled()});
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }    
};

export const setDispatchStatus = async (req: Request, res: Response) => {
    try {
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

export const getTemplates = async (req: Request, res: Response) => {
    try {
        const subject = await selectTemplate("subject");
        const body = await selectTemplate("body");
        res.status(200).json({subject: subject, body: body});
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const setTemplate = async (req: Request, res: Response) => {
    const type: string = req.body.type;
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