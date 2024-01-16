//Importing the Controller
import {Request, Response} from "express";
import { selectLegals, updateLegal } from '../src/services/legalService';
import { Legal } from '../src/models/legalModel';
import * as legalController from "../src/controllers/legalController";

//mocking the Service
jest.mock("../src/services/legalService");


describe('Testing of the functions of the legalController', () => {

    it('getLegals - should return status 200', async () => {
        const mockSelectLegals = selectLegals as jest.Mock;
        const req = {} as Request;
        const res = {
            status: jest.fn(() => res),
            send: jest.fn()
        } as unknown as Response;

        const val = [{id: 1, name: 'Legal 1'}, {id: 2, name: 'Legal 2'}];

        mockSelectLegals.mockResolvedValue(val);

        await legalController.getLegals(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(val);
    });

    it('getLegals - should send status 500 with error message Internal Server Error', async () => {
        const mockSelectLegals = selectLegals as jest.Mock;
        const req = {
            body: {}
        } as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        mockSelectLegals.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        await legalController.getLegals(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('editLegal - should return status 200', async () => {
        const mockUpdateLegal = updateLegal as jest.Mock;

        const req = {
            params: { id: '1' },
            body: { value: 'test' }
        } as unknown as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        mockUpdateLegal.mockResolvedValue(undefined);

        await legalController.editLegal(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: `Legal with ID 1 updated`});
    });

    it('editLegal - should send status 400 when legalId is not an integer', async () => {
        const req = {
            params: { id: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAA' },
            body: { value: 'test' }
        } as unknown as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await legalController.editLegal(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: 'Legal ID must be an Integer.'});
    });

    it('editLegal - should send status 404 when Legal with ID Number not found', async () => {
        const mockUpdateLegal = updateLegal as jest.Mock;

        const req = {
            params: { id: '1' },
            body: { value: 'test' }
        } as unknown as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        mockUpdateLegal.mockImplementation(() => {
            throw new Error("Not found");
        });

        await legalController.editLegal(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: `Legal with ID ${req.params.id} found`});
    });

    it('editLegal - should send status 500 when internal server error occurred', async () => {
        const mockUpdateLegal = updateLegal as jest.Mock;

        const req = {
            params: { id: '123' },
            body: { value: 'test' }
        } as unknown as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        mockUpdateLegal.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        await legalController.editLegal(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

});