
//Hier Tests schreiben Mert :)
//okay abi ('-'*ゞ

const { getProtocols, createProtocol, getProtocol } = require("../src/controllers/protocolController");

jest.mock("../src/services/protocolService");

describe('Testing of the functions of ProtocolController', () => {

    it('should send status 200 if Protocol found', async () => {
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await getProtocols({}, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should send a valid Protocol', async() => {
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
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await createProtocol(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({message: "Created new Protocol"});
    });

    it('should send Invalid payload on create Protocol', async() => {
        const req = {
            body: {}
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await createProtocol(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Invalid payload"});
    });

    it('should send invalid payload on create Protocol when a attribute is missing', async() => {
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
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await createProtocol(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Invalid payload"});
    });

    it('should return get Protocol id with the id of the protocol that is returned', async() => {
        const req = {
            params: {
                id: "1"
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await getProtocol(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return get Protocol id with the id of the protocol that is not found', async() => {
        require("../src/services/protocolService").selectProtocolById.mockRejectedValueOnce(new Error("Simulated error"));

        const req = {
            params: {
                id: "abc"
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await getProtocol(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: `Protocol with ID ${req.params.id} not found`});
        expect(require("../src/services/protocolService").selectProtocolById).toHaveBeenCalledWith(req.params.id);
    });

});