//Importing the Controller
import {Request, Response} from 'express';
import * as mailReceiverController from "../src/controllers/mailController";
import {selectReceiver, updateReceiver} from '../src/services/mailReceiverService';
import {isMailDispatchEnabled, updateMailDispatch} from "../src/services/mailDispatchService";
import {selectTemplate, updateTemplate} from '../src/services/mailTemplateService';


//mocking the  Service
jest.mock("../src/services/mailReceiverService");
jest.mock("../src/services/mailDispatchService");
jest.mock("../src/services/mailTemplateService");


describe('Testing of the functions of the mailReceiverController', () => {

    it('getReceiver - should return 200 when the list of Mails is received', async () => {
        const mockSelectReceiver = selectReceiver as jest.Mock;

        const test = [
            "email1@example.com",
            "email2@example.com",
            "email3@example.com"
        ];
        mockSelectReceiver.mockResolvedValue(test);

        const req = {
            body: {}
        } as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await mailReceiverController.getReceiver(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(test);
    });

    it('getReceiver - should return 200 when the list of Mails is received (empty list)', async () => {
        const req = {
            body: {}
        } as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await mailReceiverController.getReceiver(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('getReceiver - should return 500 when there is a problem with receiving the mail list', async () => {
        const mockSelectReceiver = selectReceiver as jest.Mock;

        mockSelectReceiver.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        const req = {} as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await mailReceiverController.getReceiver(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('editReceiver - should return 400 when the list of Mails is received with invalid mail', async () => {
        const req = {
            body: ["mail1rwasde", "mail13@irwas.de", "mail15@irwas.de"]
        } as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;
        await mailReceiverController.editReceiver(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Payload must be valid email adresses"});
    });

    it('editReceiver - should return 400 when the list of Mails is received with duplicates', async () => {
        const req = {
            body: ["mail13@irwas.de", "mail13@irwas.de", "mail15@irwas.de"]
        } as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;
        await mailReceiverController.editReceiver(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "The request contains duplicate entries. Duplicate values are not allowed."});
    });

    it('editReceiver - should return 200 when the list of Mails is received ', async () => {
        const req = {
            body: ["mail13@irwas.de", "mail15@irwas.de"]
        } as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;
        await mailReceiverController.editReceiver(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: "Mails updated"});
    });

    it('editReceiver - should return 500 when the list of Mails is received but an error occurred ', async () => {
        const mockUpdateReceiver = updateReceiver as jest.Mock;

        mockUpdateReceiver.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        const req = {
            body: ["mail13@irwas.de", "mail15@irwas.de"]
        } as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;
        await mailReceiverController.editReceiver(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('getDispatchStatus - should return 500 when an error occurred', async () => {
        const mockGetDispatchStatus = isMailDispatchEnabled as jest.Mock;

        mockGetDispatchStatus.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        const req = {} as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await mailReceiverController.getDispatchStatus(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('getDispatchStatus - should return 200 ', async () => {
        const mockGetDispatchStatus = isMailDispatchEnabled as jest.Mock;

        mockGetDispatchStatus.mockResolvedValue(true);

        const req = {} as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await mailReceiverController.getDispatchStatus(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('setDispatchStatus - should return 500 when an error occurred', async () => {
        const mockUpdateMailDispatch = updateMailDispatch as jest.Mock;

        mockUpdateMailDispatch.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        const req = {} as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await mailReceiverController.setDispatchStatus(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('setDispatchStatus - should return 200 true', async () => {
        const mockUpdateMailDispatch = updateMailDispatch as jest.Mock;
        mockUpdateMailDispatch.mockResolvedValue(true);

        const req = {
            body: {
                setEnabled: true,
            }
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await mailReceiverController.setDispatchStatus(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: 'Sending mails activated'});
    });

    it('setDispatchStatus - should return 200 false', async () => {
        const mockUpdateMailDispatch = updateMailDispatch as jest.Mock;

        mockUpdateMailDispatch.mockResolvedValue(false);
        const req = {
            body: {
                setEnabled: false,
            }
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;

        await mailReceiverController.setDispatchStatus(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: "Sending mails deactivated"});
    });

    it('setDispatchStatus - should throw a 400 no boolean', async () => {
        const req = {
            body: {
                setEnabled: 'AAAAAAAAAA',
            }
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;

        await mailReceiverController.setDispatchStatus(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: 'Status must be a Boolean.'});
    });

    it('getTemplates - should return 200', async () => {
        const mockSelectTemplate = selectTemplate as jest.Mock;

        mockSelectTemplate.mockResolvedValue(true);
        const req = {} as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await mailReceiverController.getTemplates(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('getTemplates - should return 500 when an error occurred', async () => {
        const mockSelectTemplate = selectTemplate as jest.Mock;

        mockSelectTemplate.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        const req = {} as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await mailReceiverController.getTemplates(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('setTemplate - should return a 200 subject', async () => {
        const req = {
            body: {
                type: 'subject',
                value: 'Test Template',
            }
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;

        await mailReceiverController.setTemplate(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: 'Template for subject updated'});
    });

    it('setTemplate - should return a 200 body', async () => {
        const req = {
            body: {
                type: 'body',
                value: 'Test Template',
            }
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;

        await mailReceiverController.setTemplate(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: 'Template for body updated'});
    });

    it('setTemplate - should return a 400 empty', async () => {
        const req = {
            body: {
                // Missing type or value
            }
        } as unknown as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;

        await mailReceiverController.setTemplate(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: 'type and value must be set as body attributes'});
    });

    it('setTemplate - should return a 400 type is invalid', async () => {
        const req = {
            body: {
                type: 'KAAAAAAAA',
                value: 'Lorem',
            }
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;

        await mailReceiverController.setTemplate(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: 'Type must be subject or body'});
    });

    it('setTemplate - should return 500 when an error occurred subject', async () => {
        const mockUpdateTemplate = updateTemplate as jest.Mock;

        mockUpdateTemplate.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        const req = {
            body: {
                type: "subject",
                value: "a"
            }
        } as unknown as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await mailReceiverController.setTemplate(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('setTemplate - should return 500 when an error occurred body', async () => {
        const mockUpdateTemplate = updateTemplate as jest.Mock;

        mockUpdateTemplate.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        const req = {
            body: {
                type: "body",
                value: "a"
            }
        } as unknown as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await mailReceiverController.setTemplate(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

});