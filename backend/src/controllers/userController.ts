import { Request, Response } from "express";
import { User } from '../models/userModel';
import { selectAllUsers } from '../services/userService';
import { deletePermission, insertPermission } from '../services/userRoleService';

export const getUsers = async (req: Request, res: Response) => {
    console.log("Get all Users");
    try {
        //Check if Role ID is an Integer
        if(req.query.page && isNaN(Number(req.query.page)))
            return res.status(400).json({message: 'Role ID must be an Integer.'});

        const searchQuery: string = (req.query.q as string) || '';

        const users: User[] = await selectAllUsers(searchQuery.toLowerCase());
        res.status(200).json(users);
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const removePermission = async (req: Request, res: Response) => {
    try {
        const userId: string = req.params.userId;
        const roleId: number = Number(req.params.roleId);

        await deletePermission(userId, roleId);
        res.sendStatus(204);
    } catch(err) {
        if(err.message === "No role") {
            return res.status(409).json({message: `User ${req.params.userId} does not have the role ${req.params.roleId}`});
        }
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const addPermission = async (req: Request, res: Response) => {
    try {
        const userId: string = req.params.userId;
        const roleId: number = Number(req.params.roleId);

        await insertPermission(userId, roleId);
        res.sendStatus(204);
    } catch(err) {
        if(err.message === "duplicate key") {
            return res.status(409).json({message: `User ${req.params.userId} already has the role ${req.params.roleId}`});
        }
        return res.status(500).json({message: "Internal Server Error"});
    }
};