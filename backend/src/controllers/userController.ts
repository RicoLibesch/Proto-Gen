import { Request, Response } from "express";
import { User } from '../models/userModel';
import { selectAllUsers } from '../services/userService';

export const getUsers = async (req: Request, res: Response) => {
    console.log("Get all Users");
    try {
        //Check if Role ID is an Integer
        if(req.query.page && isNaN(Number(req.query.page)))
            return res.status(400).json({message: 'Role ID must be an Integer.'});

        const users: User[] = await selectAllUsers();
        res.status(200).json(users);
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};