import {Request, Response} from 'express';
import * as protocolTypeService from '../src/services/protocolTypeService';
import * as protocolTypeController from "../src/controllers/protocolTypeController";

jest.mock("../src/services/protocolTypeService");

describe('Testing of the functions of the protocolTypeController', () => {

    it('getProtocolTypes - should send status 200 when protocolType is successfully returned', async () => {
        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;


        await protocolTypeController.getProtocolTypes({} as Request, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('getProtocolTypes - should send status 500 when an error occurs', async () => {
        const mockSelectProtocolTypes = protocolTypeService.selectProtocolTypes as jest.Mock;

        mockSelectProtocolTypes.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        await protocolTypeController.getProtocolTypes({} as Request, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('editProtocolTypes - should send status 200 when protocolType is successfully edited', async () => {
        const req = {
            params: {id: 1}, body: [{
                title: "test",
                template: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed"
            }]
        } as unknown as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        await protocolTypeController.editProtocolTypes(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('editProtocolTypes - should send status 500 when an error got thrown', async () => {
        const mockupdateProtocolType = protocolTypeService.updateProtocolTypes as jest.Mock;

        mockupdateProtocolType.mockImplementation(() => {
            throw new Error('Error inserting protocol type');
        });

        const req = {
            params: {id: 1}, body: [{
                title: "test",
                template: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed"
            }]
        } as unknown as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        await protocolTypeController.editProtocolTypes(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('editProtocolTypes - should send status 400 because  duplicate titles or duplicate values are not allowed', async () => {
        const mockupdateProtocolType = protocolTypeService.updateProtocolTypes as jest.Mock;

        mockupdateProtocolType.mockImplementation(() => {
            throw new Error('Error inserting protocol type');
        });

        const req = {
            params: {id: 1}, body: [{
                title: "test",
                template: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed"
            }, {
                title: "test",
                template: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed"
            }]
        } as unknown as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        await protocolTypeController.editProtocolTypes(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

});