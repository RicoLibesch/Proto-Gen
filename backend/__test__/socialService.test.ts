//Importing the Controller
import {pool} from '../src/config/postgresConfig';
import {selectSocials, updateSocial} from "../src/services/socialService";
import {Social} from "../src/models/socialModel";

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

describe('Testing of the functions of the socialService', () => {
    const mockPoolQuery = pool.query as jest.Mock;

    beforeEach(() => {
        mockPoolQuery.mockClear();
    });

    it('updateSocial - should correctly update the socials (empty update)', async () => {
        const testval = "";
        const testid = 1;

        mockPoolQuery.mockResolvedValueOnce({rowCount: 1});
        await updateSocial(testid, testval);

        expect(mockPoolQuery).toHaveBeenCalledWith('UPDATE socials SET value = $1 WHERE id = $2', [testval, testid]);
    });

    it('updateSocial - should correctly update the socials', async () => {
        const testval = 'https://instagram2.com/';
        const testid = 1;

        mockPoolQuery.mockResolvedValueOnce({rowCount: 1});
        await updateSocial(testid, testval);

        expect(mockPoolQuery).toHaveBeenCalledWith('UPDATE socials SET value = $1 WHERE id = $2', [testval, testid]);
    });

    it('updateSocial - should throw Error updating Socials', async () => {
        const testval = 'https://instagram2.com/';
        const testid = 1;

        mockPoolQuery.mockRejectedValue(new Error("Error updating Socials"));

        let error;
        try {
            await updateSocial(testid, testval)
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('updateSocial - should throw Error updating Socials bot found rowcount 0', async () => {
        const testval = 'https://instagram2.com/';
        const testid = 1;

        mockPoolQuery.mockResolvedValue({rowCount: 0});

        let error;
        try {
            await updateSocial(testid, testval)
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("Not found");
    });

    it('updateSocial - should throw Error Not found"', async () => {
        const testval = 'https://instagram2.com/';
        const testid = 1;

        mockPoolQuery.mockRejectedValue(new Error("Not found"));

        let error;
        try {
            await updateSocial(testid, testval)
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("Not found");
    });

    it('selectSocials - should correctly return the socials (empty)', async () => {
        mockPoolQuery.mockResolvedValueOnce({rows: []});
        const res = await selectSocials();

        expect(res).toEqual([])
        expect(mockPoolQuery).toHaveBeenCalledWith('SELECT * FROM socials');
    });

    it('selectSocials - should correctly return the socials', async () => {
        const testSocials = [
            {id: 1, title: 'Instagram', value: 'https://instagram2.com/'}];

        mockPoolQuery.mockResolvedValueOnce({rows: testSocials});

        const res = await selectSocials();

        const expres = testSocials.map(f => new Social(f.id, f.title, f.value));

        expect(res).toEqual(expres);
        expect(mockPoolQuery).toHaveBeenCalledWith('SELECT * FROM socials');
    });

    it('selectSocials - should throw Error retrieving Socials', async () => {
        mockPoolQuery.mockRejectedValue(new Error("Error retrieving Socials"));

        let error;
        try {
            await selectSocials();
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

});