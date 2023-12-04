import { selectSocials, updateSocial } from '../services/socialService';
import { Social } from '../models/socialModel'

export const getSocials = async (req, res) => {
    try {
        const socials: Social[] = await selectSocials();
        res.status(200).send(socials);
    } catch(err) {
        return res.status(500).json({message: "Error retrieving Socials"});
    }
};

export const editSocial = async (req, res) => {
    const id: number = req.params.id;
    const value: string = req.body.value;

    try {
        await updateSocial(id, value);
        res.status(200).json({message: `Social with ID ${req.params.id} updated`});
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: `Social with ID ${req.params.id} not found`});
    }
};