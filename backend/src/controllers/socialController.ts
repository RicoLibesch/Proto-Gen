import { Request, Response } from "express";
import { selectSocials, updateSocial } from '../services/socialService';
import { Social } from '../models/socialModel'

export const getSocials = async (req: Request, res: Response) => {
    try {
        const socials: Social[] = await selectSocials();
        res.status(200).send(socials);
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const editSocial = async (req: Request, res: Response) => {
    const socialId: number = Number(req.params.id);
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