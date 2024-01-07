import { Request, Response } from "express";
import { selectLegals, updateLegal } from '../services/legalService';
import { Legal } from '../models/legalModel'

export const getLegals = async (req: Request, res: Response) => {
    try {
        const legals: Legal[] = await selectLegals();
        res.status(200).send(legals);
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const editLegal = async (req: Request, res: Response) => {
    const legalId: number = Number(req.params.id);
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