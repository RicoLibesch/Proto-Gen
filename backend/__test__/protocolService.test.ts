//Importing the Controller
import {pool} from '../src/config/postgresConfig';
import {insertProtocol, selectProtocolById, selectProtocols} from "../src/services/protocolService";
import {Protocol} from "../src/models/protocolModel";
import {AttendanceList} from "../src/models/attendanceListModel";

//mocking the  Service
jest.mock('../src/services/protocolAttendanceService', () => ({
    insertProtocolAttendance: jest.fn(),
    selectProtocolAttendance: jest.fn()
}));
jest.mock('../src/services/protocolTopicService', () => ({
    insertProtocolTopics: jest.fn(),
    selectProtocolTopics: jest.fn()
}));
jest.mock('pg', () => {
    const mPool = {
        query: jest.fn(),
        on: jest.fn(),
        connect: jest.fn(),
        end: jest.fn(),
    };
    return {Pool: jest.fn(() => mPool)};
});

describe('Testing of the functions of the protocolService', () => {
    const mockPoolQuery = pool.query as jest.Mock;

    beforeEach(() => {
        mockPoolQuery.mockClear();
    });

    it('insertProtocol - should insert a new protocol and its data correctly', async () => {
        const protocolData = {
            protocol_type: 'Meeting',
            start_timestamp: Date.now(),
            end_timestamp: Date.now() + 3600000,
            content: 'Meeting content',
            topics: ['Topic1', 'Topic2'],
            attendanceList: new AttendanceList({'Role1': ['User1', 'User2'], 'Role2': ['User3']}),
        };

        const protocol = new Protocol(
            protocolData.protocol_type,
            protocolData.start_timestamp,
            protocolData.end_timestamp,
            protocolData.content,
            protocolData.topics,
            protocolData.attendanceList
        );

        mockPoolQuery.mockResolvedValue({rows: [{id: 1}]});

        await insertProtocol(protocol);

        expect(mockPoolQuery).toHaveBeenNthCalledWith(
            1,
            'INSERT INTO protocols(protocol_type, start_timestamp, end_timestamp, content) VALUES ($1, $2, $3, $4) RETURNING id',
            [protocol.protocol_type, protocol.start_timestamp, protocol.end_timestamp, protocol.content]
        );

    });

    it('insertProtocol - should not insert the Data correctly and throw an error', async () => {
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

        mockPoolQuery.mockImplementation(() => {
            throw new Error('Error inserting protocol data');
        });

        let error;
        try {
            await insertProtocol(testProtocol);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('selectProtocols - should return all Protocols', async () => {
        const protocolRows = [
            {
                id: 0,
                protocol_type: "Fachschaftssitzung",
                start_timestamp: 11111,
                end_timestamp: 55555,
                content: "Protokol 3"
            },
            {
                id: 1,
                protocol_type: "Fachschaftssitzung",
                start_timestamp: 11111,
                end_timestamp: 55555,
                content: "Protokol 3"
            }
        ];

        mockPoolQuery.mockResolvedValueOnce({rows: protocolRows});

        const page = 1;
        const pageSize = 10;

        await selectProtocols(page, pageSize);
        expect(mockPoolQuery).toHaveBeenCalledWith('SELECT * FROM protocols ORDER BY id DESC OFFSET $1 LIMIT $2', [(page - 1) * pageSize, pageSize]);
    });

    it('selectProtocols - should not return all Protocols and throw an error', async () => {

        let error;
        try {
            await selectProtocols(1, 2);
        } catch (e) {
            error = e;
        }

        mockPoolQuery.mockImplementation(() => {
            throw new Error(`Error selecting protocols: ${error}`);
        });
        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('selectProtocolById - should return a specific Protocol', async () => {
        const protocolId = 0;
        const protocolRow = {
            id: protocolId,
            protocol_type: "Fachschaftssitzung",
            start_timestamp: 11111,
            end_timestamp: 55555,
            content: "Protokol 3"
        };

        mockPoolQuery.mockResolvedValueOnce({rows: [protocolRow]});

        await selectProtocolById(protocolId);

        expect(mockPoolQuery).toHaveBeenCalledWith('SELECT * FROM protocols WHERE id = $1', [protocolId]);
    });

    it('selectProtocolById - should not return a specific Protocol and throw an error', async () => {

        mockPoolQuery.mockImplementation((protocolId) => {
            throw new Error(`Protocol with ID '${protocolId}' not found`);
        });

        let error;
        try {
            await selectProtocolById(42);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('selectProtocolById - should return null if protocol not found', async () => {
        const protocolId = 42;

        mockPoolQuery.mockResolvedValueOnce({rows: []});

        const protocol = await selectProtocolById(protocolId);

        expect(protocol).toBeNull();
    });

});