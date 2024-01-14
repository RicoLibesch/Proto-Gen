//Importing the Controller
import {Request, Response} from "express";
import {authenticateUser} from "../src/services/ldapService";
import {insertUser, userExists} from '../src/services/userService';
import {selectPermissions} from '../src/services/userRoleService';
import * as authController from "../src/controllers/authController";

//mocking the Service
jest.mock("../src/services/ldapService");
jest.mock("../src/services/userService");
jest.mock("../src/services/userRoleService");


describe('Testing of the functions of the authController', () => {

    it('loginUser - should send status 400 with error message when username or password is missing', async () => {
        const req = {
            body: {}
        } as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        await authController.loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Payload must contain username and password"});
    });

    it('loginUser - should send status 401 with error message Invalid Credential', async () => {
        const req = {
            body: {
                username: "test", password: "pw1"
            }
        } as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        (authenticateUser as jest.Mock).mockRejectedValue(new Error("Invalid Credentials"));

        await authController.loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({message: "Invalid Credentials"});
    });

    it('loginUser - should succeed', async () => {
        process.env.ACCESS_TOKEN_SECRET = 'LoremIpsum';

        const req = {
            body: {
                username: "test", password: "pw1"
            }
        } as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        (authenticateUser as jest.Mock).mockResolvedValue({
            id: '123',
            firstName: 'Wass',
            lastName: 'Auch',
            displayName: 'WassA',
            mail: 'Wass.Auch@test.de',
            isAdmin: false,
            isRecorder: false
        });

        (userExists as jest.Mock).mockResolvedValue(false);
        (insertUser as jest.Mock).mockResolvedValue(undefined);
        (selectPermissions as jest.Mock).mockResolvedValue(undefined);

        await authController.loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('loginUser - should fail and return Internal Server Error', async () => {
        const req = {
            body: {
                username: "test", password: "pw1"
            }
        } as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        (authenticateUser as jest.Mock).mockRejectedValue(new Error("Internal Server Error"));

        await authController.loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

});