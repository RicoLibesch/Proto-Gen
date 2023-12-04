import { updateLogo, selectLogo } from '../services/logoService';

export const getLogo = async (req, res) => {
    try {
        const logo: string = await selectLogo();
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(logo);

        //res.status(200).json(logoData);

    } catch(err) {
        return res.status(500).json({message: "Error retrieving Logo"});
    }
};

export const editLogo = async (req, res) => {
    const image: string = req.body.image;

    try {
        await updateLogo(image);
        res.status(200).json({message: "Logo updated"});
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: "Error updating Logo"});
    }
};