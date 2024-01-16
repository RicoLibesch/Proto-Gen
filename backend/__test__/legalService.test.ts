//Importing the Controller
import {pool} from '../src/config/postgresConfig';
import {Legal} from '../src/models/legalModel';
import {selectLegals, updateLegal} from "../src/services/legalService";

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

describe('Testing of the functions of the legalService', () => {
    const mockPoolQuery = pool.query as jest.Mock;

    beforeEach(() => {
        mockPoolQuery.mockClear();
    });

    it('updateLegal - should update legal successfully', async () => {
        mockPoolQuery.mockResolvedValue({rowCount: 1});

        await expect(updateLegal(1, "test")).resolves.toBeUndefined();

        expect(pool.query).toHaveBeenCalledWith('UPDATE legals SET value = $1 WHERE id = $2', ["test", 1]);
    });

    it('updateLegal - should throw "Not found" error for non-existent legal', async () => {
        mockPoolQuery.mockResolvedValue({rowCount: 0});

        await expect(updateLegal(666, "miau")).rejects.toThrow("Not found");

        expect(pool.query).toHaveBeenCalledWith('UPDATE legals SET value = $1 WHERE id = $2', ["miau", 666]);
    });

    it('updateLegal - should throw the error Not found', async () => {

        mockPoolQuery.mockRejectedValue(new Error("Not found"));

        let error;
        try {
            await updateLegal(1, "test");
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("Not found");
    });

    it('updateLegal - should throw the error that is a random ERROR', async () => {

        mockPoolQuery.mockRejectedValue(new Error("ERROR"));

        let error;
        try {
            await updateLegal(1, "test");
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('selectLegals - should return the legals successfully without data', async () => {
        const mockLegalsData = [];

        mockPoolQuery.mockResolvedValue({rows: mockLegalsData});

        const res = await selectLegals();

        expect(res).toEqual([]);
    });

    it('selectLegals - should return the legals successfully with data', async () => {
        const mockLegalsData = [
            {id: 1, title: 'Legal 1', value: 'Value 1'},
            {id: 2, title: 'Legal 2', value: 'Value 2'}
        ];

        mockPoolQuery.mockResolvedValue({rows: mockLegalsData});

        const res = await selectLegals();

        expect(res).toHaveLength(mockLegalsData.length);
        expect(res[0]).toBeInstanceOf(Legal);
        expect(res[0].id).toEqual(mockLegalsData[0].id);
        expect(res[0].title).toEqual(mockLegalsData[0].title);
        expect(res[0].value).toEqual(mockLegalsData[0].value);
    });

    it('selectLegals - should throw the error that is a random ERROR', async () => {

        mockPoolQuery.mockRejectedValue(new Error("SQL Error"));

        let error;
        try {
            await selectLegals();
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

});