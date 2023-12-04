import { ProtocolType } from '../models/protocolTypeModel';
import { selectProtocolTypes, updateProtocolTypes } from '../services/protocolTypeService';

export const getProtocolTypes = async (req, res) => {
    try {
        const protocolTypes: ProtocolType[] = await selectProtocolTypes();
        res.status(200).json(protocolTypes);
    } catch(err) {
        return res.status(500).json({message: "An unknown error occured"});
    }
};

export const editProtocolTypes = async (req, res) => {
    const protocolTypes: ProtocolType[] = req.body;

    //Check for name duplicates
    const titles: string[] = protocolTypes.map((type) => type.title);
    if(new Set(titles).size !== titles.length)
        return res.status(400).json({message: "The request contains duplicate titles. Duplicate values are not allowed."});

    try {
        await updateProtocolTypes(protocolTypes);
        res.status(200).json({message: "Protocol Types updated"});
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: "Error updating Protocol Types"});
    }
};