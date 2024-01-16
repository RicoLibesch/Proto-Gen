//Importing the Controller
import {Request, Response} from "express";
import {isSessionActive, startSession, stopSession} from '../src/services/sessionService';
import * as sessionController from "../src/controllers/sessionController";
import {addAttendee, selectAttendees} from "../src/services/sessionAttendanceService";

//mocking the Service
jest.mock('../src/services/sessionService');
jest.mock('../src/services/sessionAttendanceService');

describe('Testing of the functions of the sessionController', () => {

    it('getSessionStatus - should return status active', async () => {
        const mockIsSessionActive = isSessionActive as jest.Mock;

        mockIsSessionActive.mockResolvedValue(true);

        const req = {} as Request;
        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        await sessionController.getSessionStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({status: "active"});
    });

    it('getSessionStatus - should return status inactive', async () => {
        const mockIsSessionActive = isSessionActive as jest.Mock;

        mockIsSessionActive.mockResolvedValue(false);

        const req = {} as Request;
        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        await sessionController.getSessionStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({status: "inactive"});
    });

    it('getSessionStatus - should send status 500 with error message Internal Server Error', async () => {
        const mockIsSessionActive = isSessionActive as jest.Mock;
        const req = {
            body: {}
        } as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        mockIsSessionActive.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        await sessionController.getSessionStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('postSession - should send status 409 with error message Session started already', async () => {
        const mockIsSessionActive = isSessionActive as jest.Mock;
        const req = {} as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        mockIsSessionActive.mockResolvedValue(true);

        await sessionController.postSession(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({message: "Session started already"});
    });

    it('postSession - should return status 200 when session is successfully started', async () => {
        const mockIsSessionActive = isSessionActive as jest.Mock;
        const mockStartSession = startSession as jest.Mock;

        mockIsSessionActive.mockResolvedValue(false);

        mockStartSession.mockResolvedValue(undefined);

        const req = {} as Request;
        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        await sessionController.postSession(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: "Session started"});
    });

    it('postSession - should send status 500 with error message Internal Server Error', async () => {
        const mockIsSessionActive = isSessionActive as jest.Mock;
        const req = {
            body: {}
        } as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        mockIsSessionActive.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        await sessionController.postSession(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('deleteSession - should send status 200 with error message Session started', async () => {
        const req = {} as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        await sessionController.deleteSession(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: "Session stopped"});
    });

    it('deleteSession - should send status 500 with error message Internal Server Error', async () => {
        const mockStopSession = stopSession as jest.Mock;
        const req = {} as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        mockStopSession.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        await sessionController.deleteSession(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('getAttendees - should send status 500 with error message Internal Server Error', async () => {
        const mockIsSessionActive = isSessionActive as jest.Mock;
        const req = {} as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        mockIsSessionActive.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        await sessionController.getAttendees(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('getAttendees - should send status 404 with error message No running Session', async () => {
        const mockIsSessionActive = isSessionActive as jest.Mock;
        const req = {} as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        mockIsSessionActive.mockResolvedValue(false);

        await sessionController.getAttendees(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: "No running Session"});
    });

    it('getAttendees - should send status 200 with a list of attendees', async () => {
        const mockIsSessionActive = isSessionActive as jest.Mock;
        const mockSelectAttendees = selectAttendees as jest.Mock;

        mockIsSessionActive.mockResolvedValue(true);
        mockSelectAttendees.mockResolvedValue(['Attendee1', 'Attendee2']);

        const req = {} as Request;
        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        await sessionController.getAttendees(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({attendees: ['Attendee1', 'Attendee2']});
    });

    it('postAttendee - should return status 400 when name there is no name provided', async () => {
        const req = {
            body: {}
        } as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        await sessionController.postAttendee(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Request body must contain a name to add to the session"});
    });

    it('postAttendee - should send status 404 with error message No running Session', async () => {
        const mockIsSessionActive = isSessionActive as jest.Mock;

        const req = {
            body: {name: 'AAAAAAAAAAAAAA'}
        } as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        mockIsSessionActive.mockResolvedValue(false);

        await sessionController.postAttendee(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: "No running Session"});
    });

    it('postAttendee - should send status 500 with error message Internal Server Error', async () => {
        const mockIsSessionActive = isSessionActive as jest.Mock;

        const req = {
            body: {name: 'AAAAAAAAAAA'}
        } as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        mockIsSessionActive.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });
        await sessionController.postAttendee(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('postAttendee - should return status 201 when User added to Session', async () => {
        const mockIsSessionActive = isSessionActive as jest.Mock;
        const mockAddAttendee = addAttendee as jest.Mock;

        mockIsSessionActive.mockResolvedValue(true);
        mockAddAttendee.mockResolvedValue("AAAAAAAAA");

        const req = {
            body: {name: 'AAAAAAAAAAAAAA'}
        } as Request;

        const res = {
            status: jest.fn(() => res), json: jest.fn()
        } as unknown as Response;

        await sessionController.postAttendee(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({message: "User added to Session"});
    });

});