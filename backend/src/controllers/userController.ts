import { Request, Response } from "express";
import { User } from '../models/userModel';
import { selectAllUsers } from '../services/userService';
import { deletePermission, insertPermission } from '../services/userRoleService';

export const getUsers = async (req: Request, res: Response) => { 
    try {
        //Check if Pagination Parameters are an Integer
        if(req.query.page && isNaN(Number(req.query.page)))
            return res.status(400).json({message: 'Pagination Parameters must be an Integer.'});
        if(req.query.pageSize && isNaN(Number(req.query.pageSize)))
            return res.status(400).json({message: 'Pagination Parameters must be an Integer.'});
        if(req.query.roleId && isNaN(Number(req.query.roleId)))
            return res.status(400).json({message: 'Role Parameters must be an Integer.'});

        const page: number = Number(req.query.page) || 1; 
        const pageSize: number = Number(req.query.pageSize) || 20;
        const userId: string = (req.query.id as string) || '';
        const roleId: number = Number(req.query.roleId);

        const users: User[] = await selectAllUsers(page, pageSize, userId.toLowerCase(), roleId);
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