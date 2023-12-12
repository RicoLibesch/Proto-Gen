import { Request, Response } from "express";
import { updateLogo, selectLogo } from '../services/logoService';

export const getLogo = async (req: Request, res: Response) => {
    try {
        const logo: string = await selectLogo();

        if(logo === null)
            return res.status(404).json({message: 'No Logo found'});

        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(logo);
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const editLogo = async (req: Request, res: Response) => {
    const image: string = req.body.image;

    try {
        await updateLogo(image);
        res.status(200).json({message: "Logo updated"});
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};