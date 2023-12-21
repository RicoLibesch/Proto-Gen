import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { authenticateUser } from "../services/ldapService";
import { userExists, insertUser, selectPermissions } from '../services/userService'
import { User } from '../models/userModel'

export const loginUser = async (req: Request, res: Response) => {
    try {
        if(!req.body.username || !req.body.password)
            return res.status(400).json({message: "Payload must contain username and password"});

        const user: User = await authenticateUser(req.body.username, req.body.password);
        
        if(!(await userExists(user.id)))
            await insertUser(user);    
        
        //Update the current User Object
        await selectPermissions(user);

        const userObject = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            mail: user.mail,
            isAdmin: user.isAdmin,
            isRecorder: user.isRecorder
        };
        const accessToken = await generateAccessToken(userObject);
        return res.status(200).json({token: accessToken})
    } catch(err) {
        if(err.message === "Invalid Credentials") {
            return res.status(401).json({message: "Invalid Credentials"});
        }
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const generateAccessToken = async(user: User): Promise<string> => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3h'})
}