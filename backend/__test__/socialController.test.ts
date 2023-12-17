//Importing the Controller
import {Request, Response} from 'express';
import {editSocial, getSocials} from "../src/controllers/socialController";
import {selectSocials, updateSocial} from '../src/services/socialService';
import {Social} from '../src/models/socialModel'

//mocking the  Service
jest.mock("../src/services/socialService");

describe('Testing of the functions of the socialController', () => {

    it('getSocials - should return 200 when social media data is returned successfully', async () => {
        const mockSelectSocials = selectSocials as jest.Mock;

        const testSocials = [
            new Social(1, 'Instagram', 'https://instagram.com/'),
            new Social(2, 'Twitter', 'https://twitter.com/')
        ];
        const req = {} as Request;
        const res = {
            status: jest.fn(() => res),
            send: jest.fn()
        } as unknown as Response;

        mockSelectSocials.mockResolvedValue(testSocials);

        await getSocials(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(testSocials);
    });

    it('getSocials - should return 500 when social media data is not returned successfully', async () => {
        const mockSelectSocials = selectSocials as jest.Mock;

        mockSelectSocials.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        const req = {} as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;


        await getSocials(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('editSocial - should return 200 when social media data is returned successfully', async () => {
        const mockUpdateSocial = updateSocial as jest.Mock;
        const req = {
            params: {
                id: 1
            },
            body: {
                value: 'https://instagram2.com/'
            }
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        mockUpdateSocial.mockResolvedValue(req);

        await editSocial(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: `Social with ID ${req.params.id} updated`});
    });

    it('editSocial - should return 400 when social media data is not returned successfully', async () => {
        const mockUpdateSocial = updateSocial as jest.Mock;
        const req = {
            params: {
                id: "lorem"
            },
            body: {
                value: 'https://instagram2.com/'
            }
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;


        mockUpdateSocial.mockImplementation(() => {
            throw new Error('Social ID must be an Integer.');
        });

        await editSocial(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: 'Social ID must be an Integer.'});
    });

    it('editSocial - should return 404 when social media data is not returned successfully', async () => {
        const mockUpdateSocial = updateSocial as jest.Mock;
        const req = {
            params: {
                id: 1
            },
            body: {
                value: 'https://instagram2.com/'
            }
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;


        mockUpdateSocial.mockImplementation(() => {
            throw new Error("Not found");
        });

        await editSocial(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: `Social with ID ${req.params.id} found`});
    });

    it('editSocial - should return 500 when social media data is not returned successfully', async () => {
        const mockUpdateSocial = updateSocial as jest.Mock;
        const req = {
            params: {
                id: 1
            },
            body: {
                value: 'https://instagram2.com/'
            }
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;


        mockUpdateSocial.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        await editSocial(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

});