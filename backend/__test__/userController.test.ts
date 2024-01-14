//Importing the Controller
import {Request, Response} from "express";
import {selectAllUsers} from '../src/services/userService';
import {deletePermission, insertPermission} from '../src/services/userRoleService';
import * as userController from "../src/controllers/userController";

//mocking the Service
jest.mock("../src/services/userService");
jest.mock("../src/services/userRoleService");

describe('Testing of the functions of the userController', () => {

    it('getUsers - should send status 400 with Pagination Parameters must be an Integer Page', async () => {
        const req = {
            query: { page: 'sad' }
        } as unknown as Request;


        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        await userController.getUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Pagination Parameters must be an Integer."});
    });

    it('getUsers - should send status 400 with Pagination Parameters must be an Integer PageSize', async () => {
        const req = {
            query: { pageSize: 'sad' }
        } as unknown as Request;


        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        await userController.getUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Pagination Parameters must be an Integer."});
    });

    it('getUsers - should send status 400 with Role Parameters must be an Integer', async () => {
        const req = {
            query: { roleId: 'invalid' }
        } as unknown as Request;


        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        await userController.getUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Role Parameters must be an Integer."});
    });

    it('getUsers - should send status 200', async () => {
        const req = {
            query: {
                page: 1 ,
                pageSize: 2 ,
                roleId: 1 }
        } as unknown as Request;


        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        await userController.getUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('getUsers - should send status 200 with none pagination values', async () => {
        const mockSelectAllUsers = selectAllUsers as jest.Mock;

        const req = {
            query: {}
        } as unknown as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        mockSelectAllUsers.mockResolvedValue([]);

        await userController.getUsers(req, res);

        expect(mockSelectAllUsers).toHaveBeenCalledWith(1, 20, '', NaN);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('getUsers - should send status 500 with error message Internal Server Error', async () => {
        const mockSelectAllUsers = selectAllUsers as jest.Mock;
        const req = {} as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        mockSelectAllUsers.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        await userController.getUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('removePermission - should send status 204', async () => {
        const mockDeletePermission = deletePermission as jest.Mock;

        const req = {
            params: {'user123': 1}
        } as unknown as Request;

        const res = {
            sendStatus: jest.fn()
        } as unknown as Response;

        mockDeletePermission.mockResolvedValue(undefined);

        await userController.removePermission(req, res);

        expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it('removePermission - should send status 409 with error message does not have the role', async () => {
        const mockDeletePermission = deletePermission as jest.Mock;
        const req = {
            params: {'user123': 1}
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        mockDeletePermission.mockImplementation(() => {
            throw new Error("No role");
        });

        await userController.removePermission(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({message: `User ${req.params.userId} does not have the role ${req.params.roleId}`});
    });

    it('removePermission - should send status 500 with error message Internal Server Error', async () => {
        const mockDeletePermission = deletePermission as jest.Mock;
        const req = {} as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        mockDeletePermission.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        await userController.removePermission(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('addPermission - should send status 204', async () => {
        const mockInsertPermission = insertPermission as jest.Mock;

        const req = {
            params: {'user123': 1}
        } as unknown as Request;

        const res = {
            sendStatus: jest.fn()
        } as unknown as Response;

        mockInsertPermission.mockResolvedValue(undefined);

        await userController.addPermission(req, res);

        expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it('addPermission - should send status 409 with error message already has the role', async () => {
        const mockInsertPermission = insertPermission as jest.Mock;

        const req = {
            params: {'user123': 1}
        } as unknown as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        mockInsertPermission.mockImplementation(() => {
            throw new Error("duplicate key");
        });

        await userController.addPermission(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({message: `User ${req.params.userId} already has the role ${req.params.roleId}`});
    });

    it('addPermission - should send status 500 with error message Internal Server Error', async () => {
        const mockInsertPermission = insertPermission as jest.Mock;
        const req = {} as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        mockInsertPermission.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        await userController.addPermission(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

});