//Importing the controllers and the services
import {Protocol} from '../src/models/protocolModel';
import {AttendanceList} from '../src/models/attendanceListModel'
import {Request, Response} from "express";
import {insertProtocol, selectProtocolById, selectProtocols} from '../src/services/protocolService';
import {createProtocol, getProtocol, getProtocols} from '../src/controllers/protocolController';

//mocking the  Services
jest.mock("../src/services/protocolService");

describe('Testing of the functions of the protocolController', () => {

    it('getProtocols - should send status 200 if Protocol found', async () => {
        const mockSelectProtocols = selectProtocols as jest.Mock;
        mockSelectProtocols.mockResolvedValue([]);

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;

        await getProtocols({query: {}} as unknown as Request, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([]);
    });

    it('getProtocols - should send status 500 if Protocol not found', async () => {
        const mockSelectProtocols = selectProtocols as jest.Mock;

        mockSelectProtocols.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;

        await getProtocols({query: {}} as unknown as Request, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('getProtocols - should send status 400 if Protocol not found(page is not an int)', async () => {
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;

        const req = {
            query: {
                page: "AAAAAAAAAAAAAaa",
                pageSize: '10'
            }
        } as unknown as Request;

        await getProtocols(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: 'Query Parameters must be an Integer.'});
    });

    it('getProtocols - should send status 400 if Protocol not found(pagesize is not an int)', async () => {
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;

        const req = {
            query: {
                page: 10,
                pageSize: "AAAAAAAAAAAAAaa"
            }
        } as unknown as Request;

        await getProtocols(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: 'Query Parameters must be an Integer.'});
    });

    it('createProtocol - should send a valid Protocol', async () => {
        const mockInsertProtocol = insertProtocol as jest.Mock;

        const req = {
            body: {
                "protocol_type": "Fachschaftssitzung",
                "start_timestamp": "11111",
                "end_timestamp": "55555",
                "content": "Protokol 3",
                "topics": [
                    "Aktueller Stand",
                    "Mergen",
                    "Offene Tickets",
                    "Zeiten buchen"
                ],
                "attendanceList": {
                    "Entschuldigt": ["Jonas", "Aziz", "Mert"],
                    "Unentschuldigt": ["Konrad", "Jamin", "Rico"]
                }
            }
        } as unknown as Request

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response

        mockInsertProtocol.mockResolvedValue(req);
        await createProtocol(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({message: "Created new Protocol"});
    });

    it('createProtocol - should send Invalid payload on create Protocol when Protocol is empty', async () => {
        const req = {
            body: {}
        } as unknown as Request

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await createProtocol(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Invalid payload"});
    });

    it('createProtocol - should send invalid payload on create Protocol when a attribute is missing', async () => {
        const req = {
            body: {
                "start_timestamp": "11111",
                "end_timestamp": "55555",
                "content": "Protokol 3",
                "topics": [
                    "Aktueller Stand",
                    "Mergen",
                    "Offene Tickets",
                    "Zeiten buchen"
                ],
                "attendanceList": {
                    "Entschuldigt": ["Jonas", "Aziz", "Mert"],
                    "Unentschuldigt": ["Konrad", "Jamin", "Rico"]
                }
            }
        } as unknown as Request

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await createProtocol(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Invalid payload"});
    });

    it('createProtocol - should send An unknown error occurred while sending a valid protocol', async () => {
        const mockinsertProtocol = insertProtocol as jest.Mock;

        mockinsertProtocol.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });


        const req = {
            body: {
                "protocol_type": "Fachschaftssitzung",
                "start_timestamp": "11111",
                "end_timestamp": "55555",
                "content": "Protokol 3",
                "topics": [
                    "Aktueller Stand",
                    "Mergen",
                    "Offene Tickets",
                    "Zeiten buchen"
                ],
                "attendanceList": {
                    "Entschuldigt": ["Jonas", "Aziz", "Mert"],
                    "Unentschuldigt": ["Konrad", "Jamin", "Rico"]
                }
            }
        } as unknown as Request;


        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await createProtocol(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('getProtocol - should return get Protocol 200 id with the id of the protocol that is returned', async () => {
        const mockSelectProtocolById = selectProtocolById as jest.Mock;

        const testProtocol = new Protocol(
            "Fachschaftssitzung",
            11111,
            55555,
            "Protokol 3",
            ["Aktueller Stand", "Mergen", "Offene Tickets", "Zeiten buchen"],
            new AttendanceList({
                "Entschuldigt": ["Jonas", "Aziz", "Mert"],
                "Unentschuldigt": ["Konrad", "Jamin", "Rico"]
            })
        );

        const req = {
            params: {
                id: "1"
            }
        } as unknown as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response

        mockSelectProtocolById.mockResolvedValue(testProtocol);

        await getProtocol(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('getProtocol - should return get Protocol 400 id with the id of the protocol that is not found', async () => {
        const req = {
            params: {
                id: "abc"
            }
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response

        await getProtocol(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Protocol ID must be an Integer."});
    });

    it('getProtocol - should return get Protocol 404 id with the id of the protocol that is not found', async () => {
        const mockSelectProtocolById = selectProtocolById as jest.Mock;

        const req = {
            params: {
                id: '1'
            }
        } as unknown as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;

        mockSelectProtocolById.mockResolvedValue(null);

        await getProtocol(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: `Protocol with ID ${req.params.id} not found`});
    });

    it('getProtocol - should return get Protocol 500 id with the id of the protocol that is not found', async () => {
        const mockSelectProtocolById = selectProtocolById as jest.Mock;

        mockSelectProtocolById.mockImplementation(() => {
            throw new Error("Internal Server Error");
        });

        const req = {
            params: {
                id: '1'
            }
        } as unknown as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        } as unknown as Response;

        await getProtocol(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

});