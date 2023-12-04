import { selectReceiver, updateReceiver } from '../services/mailReceiverService';

export const getReceiver = async (req, res) => {
    try {
        const mails: string[] = await selectReceiver();
        res.status(200).json(mails);
    } catch(err) {
        return res.status(500).json({message: "Error retrieving Mails"});
    }
};

export const editReceiver = async (req, res) => {
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
        return res.status(500).json({message: "Error updating Mail Receivers"});
    }
};