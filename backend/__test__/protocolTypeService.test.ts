//Importing the Controller
import {pool} from '../src/config/postgresConfig';
import {selectProtocolTypes, updateProtocolTypes} from "../src/services/protocolTypeService";

//mocking the  Service
jest.mock('pg', () => {
    const mPool = {
        query: jest.fn(),
        on: jest.fn(),
        connect: jest.fn(),
        end: jest.fn(),
    };
    return {Pool: jest.fn(() => mPool)};
});

describe('Testing of the functions of the protocolTypeService', () => {
    const mockPoolQuery = pool.query as jest.Mock;

    beforeEach(() => {
        mockPoolQuery.mockClear();
    });

    it('selectProtocolTypes - should correctly return the protocol types (no type)', async () => {
        mockPoolQuery.mockResolvedValueOnce({rows: []});
        const res = await selectProtocolTypes();

        expect(res).toEqual([]);
        expect(mockPoolQuery).toHaveBeenCalledWith('SELECT * FROM protocol_types');
    });

    it('selectProtocolTypes - should correctly return the protocol types', async () => {
        const testTypes = [{
            params: {id: 1},
            body: [{
                title: "test",
                template: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed"
            }]
        }];

        mockPoolQuery.mockResolvedValueOnce({rows: testTypes})

        const res = await selectProtocolTypes();

        expect(res).toEqual(testTypes);
        expect(mockPoolQuery).toHaveBeenCalledWith('SELECT * FROM protocol_types');
    });

    it('selectProtocolTypes - should throw an error because an error occurred', async () => {
        mockPoolQuery.mockRejectedValue(new Error("ERROR"));

        let error;
        try {
            await selectProtocolTypes();
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('updateProtocolTypes - should correctly update the protocol types (no type)', async () => {
        const testTypes = [];
        mockPoolQuery.mockResolvedValue({rowCount: 4});

        await updateProtocolTypes(testTypes);

        expect(mockPoolQuery).toHaveBeenCalledWith('BEGIN');
        expect(mockPoolQuery).toHaveBeenCalledWith('DELETE FROM protocol_types');
        for (const type of testTypes) {
            expect(mockPoolQuery).toHaveBeenCalledWith(
                'INSERT INTO protocol_types(title, template) VALUES ($1, $2)',
                [type.title, type.template]
            );
        }
        expect(mockPoolQuery).toHaveBeenCalledWith('COMMIT');
    });

    it('updateProtocolTypes - should correctly update the protocol types', async () => {
        const testTypes = [
            {
                id: 1,
                title: "test",
                template: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed"
            }

        ];

        mockPoolQuery.mockResolvedValue({rowCount: 4});

        await updateProtocolTypes(testTypes);

        expect(mockPoolQuery).toHaveBeenCalledWith('BEGIN');
        expect(mockPoolQuery).toHaveBeenCalledWith('DELETE FROM protocol_types');
        for (const type of testTypes) {
            expect(mockPoolQuery).toHaveBeenCalledWith(
                'INSERT INTO protocol_types(title, template) VALUES ($1, $2)',
                [type.title, type.template]
            );
        }
        expect(mockPoolQuery).toHaveBeenCalledWith('COMMIT');
    });

    it('updateProtocolTypes - should throw an error because an error occurred', async () => {
        const testTypes = [
            {
                id: 1,
                title: "test",
                template: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed"
            }

        ];
        mockPoolQuery.mockRejectedValue(new Error("Error updating protocol types"));

        let error;
        try {
            await updateProtocolTypes(testTypes);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

});