//Importing the Controller
import {Request, Response} from 'express';
// import * as mailReceiverController from "../src/controllers/mailReceiverController";
import {selectReceiver, updateReceiver} from '../src/services/mailReceiverService';

//mocking the  Service
jest.mock("../src/services/mailReceiverService");

describe('Testing of the functions of the mailReceiverController', () => {

    it('getReceiver', async () => {

    });
    // it('getReceiver - should return 200 when the list of Mails is received', async () => {
    //     const mockSelectReceiver = selectReceiver as jest.Mock;

    //     const test = [
    //         "email1@example.com",
    //         "email2@example.com",
    //         "email3@example.com"
    //     ];
    //     mockSelectReceiver.mockResolvedValue(test);

    //     const req = {
    //         body: {}
    //     } as Request;
    //     const res = {
    //         status: jest.fn(() => res),
    //         json: jest.fn()
    //     } as unknown as Response;

    //     await mailReceiverController.getReceiver(req, res);
    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith(test);
    // });

    // it('getReceiver - should return 200 when the list of Mails is received (empty list)', async () => {
    //     const req = {
    //         body: {}
    //     } as Request;
    //     const res = {
    //         status: jest.fn(() => res),
    //         json: jest.fn()
    //     } as unknown as Response;

    //     await mailReceiverController.getReceiver(req, res);
    //     expect(res.status).toHaveBeenCalledWith(200);
    // });

    // it('getReceiver - should return 500 when there is a problem with receiving the mail list', async () => {
    //     const mockSelectReceiver = selectReceiver as jest.Mock;

    //     mockSelectReceiver.mockImplementation(() => {
    //         throw new Error("Internal Server Error");
    //     });

    //     const req = {} as Request;
    //     const res = {
    //         status: jest.fn(() => res),
    //         json: jest.fn()
    //     } as unknown as Response;

    //     await mailReceiverController.getReceiver(req, res);
    //     expect(res.status).toHaveBeenCalledWith(500);
    //     expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    // });

    // it('editReceiver - should return 400 when the list of Mails is received with invalid mail', async () => {
    //     const req = {
    //         body: ["mail1rwasde", "mail13@irwas.de", "mail15@irwas.de"]
    //     } as Request;
    //     const res = {
    //         status: jest.fn(() => res),
    //         json: jest.fn()
    //     } as unknown as Response;
    //     await mailReceiverController.editReceiver(req, res);
    //     expect(res.status).toHaveBeenCalledWith(400);
    //     expect(res.json).toHaveBeenCalledWith({message: "Payload must be valid email adresses"});
    // });

    // it('editReceiver - should return 400 when the list of Mails is received with duplicates', async () => {
    //     const req = {
    //         body: ["mail13@irwas.de", "mail13@irwas.de", "mail15@irwas.de"]
    //     } as Request;
    //     const res = {
    //         status: jest.fn(() => res),
    //         json: jest.fn()
    //     } as unknown as Response;
    //     await mailReceiverController.editReceiver(req, res);
    //     expect(res.status).toHaveBeenCalledWith(400);
    //     expect(res.json).toHaveBeenCalledWith({message: "The request contains duplicate entries. Duplicate values are not allowed."});
    // });

    // it('editReceiver - should return 200 when the list of Mails is received ', async () => {
    //     const req = {
    //         body: ["mail13@irwas.de", "mail15@irwas.de"]
    //     } as Request;
    //     const res = {
    //         status: jest.fn(() => res),
    //         json: jest.fn()
    //     } as unknown as Response;
    //     await mailReceiverController.editReceiver(req, res);
    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith({message: "Mails updated"});
    // });

    // it('editReceiver - should return 500 when the list of Mails is received but an error occurred ', async () => {
    //     const mockUpdateReceiver = updateReceiver as jest.Mock;

    //     mockUpdateReceiver.mockImplementation(() => {
    //         throw new Error("Internal Server Error");
    //     });

    //     const req = {
    //         body: ["mail13@irwas.de", "mail15@irwas.de"]
    //     } as Request;
    //     const res = {
    //         status: jest.fn(() => res),
    //         json: jest.fn()
    //     } as unknown as Response;
    //     await mailReceiverController.editReceiver(req, res);
    //     expect(res.status).toHaveBeenCalledWith(500);
    //     expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    // });

});