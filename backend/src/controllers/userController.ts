import { Request, Response } from "express";
import { User } from '../models/userModel';
import { selectAllUsers } from '../services/userService';
import { deletePermission, insertPermission } from '../services/userRoleService';





/**
 * Controller function to handle the retrieval of users with optional pagination and filtering.
 * @async
 * @function
 * @name getUsers
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const getUsers = async (req: Request, res: Response) => { 
    try {
        //Check if Pagination Parameters are an Integer
        if(req.query.page && isNaN(Number(req.query.page)))
            return res.status(400).json({message: 'Pagination Parameters must be an Integer.'});
        if(req.query.pageSize && isNaN(Number(req.query.pageSize)))
            return res.status(400).json({message: 'Pagination Parameters must be an Integer.'});
        if(req.query.roleId && isNaN(Number(req.query.roleId)))
            return res.status(400).json({message: 'Role Parameters must be an Integer.'});

            /**
     * The page number for pagination, defaults to 1 if not provided.
     * @type {number}
     */
        const page: number = Number(req.query.page) || 1; 
    /**
     * The number of users to include in each page, defaults to 20 if not provided.
     * @type {number}
     */
        const pageSize: number = Number(req.query.pageSize) || 20;
            /**
     * The query to filter the results, defaults to an empty string if not provided.
     * @type {string}
     */
        const query: string = (req.query.pattern as string) || '';
            /**
     * The role ID to filter the results, if provided.
     * @type {number}
     */
        const roleId: number = Number(req.query.roleId);

        const users: User[] = await selectAllUsers(page, pageSize, query.toLowerCase(), roleId);
        res.status(200).json(users);
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};




/**
 * Controller function to handle the removal of a permission for a user.
 * @async
 * @function
 * @name removePermission
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const removePermission = async (req: Request, res: Response) => {
    try {
            /**
     * The ID of the user from whom the permission will be removed.
     * @type {string}
     */
        const userId: string = req.params.userId;
            /**
     * The ID of the role for which the permission will be removed.
     * @type {number}
     */
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




/**
 * Controller function to handle the addition of a permission for a user.
 * @async
 * @function
 * @name addPermission
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const addPermission = async (req: Request, res: Response) => {
    try {
            /**
     * The ID of the user to whom the permission will be added.
     * @type {string}
     */
        const userId: string = req.params.userId;
            /**
     * The ID of the role for which the permission will be added.
     * @type {number}
     */
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