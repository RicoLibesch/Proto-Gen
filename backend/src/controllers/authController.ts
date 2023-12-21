import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { authenticateUser } from "../services/ldapService";
import { userExists, insertUser } from '../services/userService';
import { selectPermissions } from '../services/userRoleService';
import { User } from '../models/userModel';

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
        const accessToken: string = jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3h'});
        return res.status(200).json({token: accessToken, user: userObject});
    } catch(err) {
        if(err.message === "Invalid Credentials") {
            return res.status(401).json({message: "Invalid Credentials"});
        }
        console.log(`Error generating JWT: ${err}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}