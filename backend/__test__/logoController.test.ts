//Importing the Controller
import {Request, Response} from 'express';
import * as logoController from "../src/controllers/logoController";
import {selectLogo, updateLogo} from '../src/services/logoService';

//mocking the  Service
jest.mock("../src/services/logoService");

describe('Testing of the functions of the logoController', () => {

    it('getLogo - should return 200 when the new Logo is displayed successfully in the header', async () => {
        const mockSelectLogo = selectLogo as jest.Mock;
        const test = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore"
        const req = {} as Request;
        const res = {
            setHeader: jest.fn(),
            status: jest.fn(() => res),
            send: jest.fn(),
            json: jest.fn()
        } as unknown as Response;

        mockSelectLogo.mockResolvedValue(test)

        await logoController.getLogo(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
        expect(res.send).toHaveBeenCalledWith(test);
    });

    it('getLogo - should return 500 when there is a problem with receiving the new Logo', async () => {
        const mockSelectLogo = selectLogo as jest.Mock;

        mockSelectLogo.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        const req = {} as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await logoController.getLogo(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('getLogo - should return 404 when there is a problem with receiving the new Logo', async () => {
        const mockSelectLogo = selectLogo as jest.Mock;

        mockSelectLogo.mockResolvedValue(null);


        const req = {} as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await logoController.getLogo(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: 'No Logo found'});
    });

    it('getLogsfao - should return 500 when there is an internal server error', async () => {
        const mockSelectLogo = selectLogo as jest.Mock;

        // Simulate selectLogo throwing an error
        mockSelectLogo.mockImplementation(() => {
            throw new Error('Internal Server Error');
        });

        const req = {} as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await logoController.getLogo(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: 'Internal Server Error'});
    });

    it('editLogo - should return 200 when the new Logo is displayed successfully in the header', async () => {
        const mockUpdateLogo = updateLogo as jest.Mock;
        const req = {
            body: {
                image: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore"
            }
        } as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await logoController.editLogo(req, res);

        expect(mockUpdateLogo).toHaveBeenCalledWith(req.body.image);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: "Logo updated"});
    });

    it('editLogo - should return 500 when there is a problem with updating the new Logo', async () => {
        const mockUpdateLogo = updateLogo as jest.Mock;

        mockUpdateLogo.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        const req = {
            body: {
                image: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore"
            }
        } as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await logoController.editLogo(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

});