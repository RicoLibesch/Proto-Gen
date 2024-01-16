//mocking the  Service
import {pool} from "../src/config/postgresConfig";
import {isMailDispatchEnabled, updateMailDispatch} from "../src/services/mailDispatchService";

jest.mock('pg', () => {
    const mPool = {
        query: jest.fn(),
        on: jest.fn(),
        connect: jest.fn(),
        end: jest.fn(),
    };
    return {Pool: jest.fn(() => mPool)};
});

describe('Testing of the functions of the mailDispatchService', () => {
    const mockPoolQuery = pool.query as jest.Mock;

    beforeEach(() => {
        mockPoolQuery.mockClear();
    });

    it('isMailDispatchEnabled - should throw  SQL Error', async () => {

        mockPoolQuery.mockRejectedValue(new Error("SQL Error"));

        let error;
        try {
            await isMailDispatchEnabled();
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('isMailDispatchEnabled - should return true', async () => {
        mockPoolQuery.mockResolvedValue({ rows: [{ status: 1 }] });

        const res = await isMailDispatchEnabled();

        expect(res).toBe(true);
    });

    it('isMailDispatchEnabled - should return false', async () => {
        mockPoolQuery.mockResolvedValue({ rows: [{ status: 0 }] });

        const res = await isMailDispatchEnabled();

        expect(res).toBe(false);
    });

    it('updateMailDispatch - should update mail dispatch', async () => {
        mockPoolQuery.mockResolvedValue({ rowCount: 1 });

        await expect(updateMailDispatch(true)).resolves.toBeUndefined();

        expect(mockPoolQuery).toHaveBeenCalledWith('UPDATE mail_dispatch_settings SET status = $1', [1]);
    });

    it('updateMailDispatch - should update mail dispatch', async () => {
        mockPoolQuery.mockResolvedValue({ rowCount: 1 });

        await expect(updateMailDispatch(true)).resolves.toBeUndefined();

        expect(mockPoolQuery).toHaveBeenCalledWith('UPDATE mail_dispatch_settings SET status = $1', [1]);
    });

    it('updateMailDispatch - should throw SQL Error', async () => {
        mockPoolQuery.mockResolvedValue({ rowCount: 0 });

        let error;
        try {
            await expect(updateMailDispatch(true)).resolves.toBeUndefined();
        } catch (e) {
            error = e;
        }

        expect(mockPoolQuery).toHaveBeenCalledWith('UPDATE mail_dispatch_settings SET status = $1', [1]);
    });

    it('updateMailDispatch - should throw SQL Error true', async () => {

        mockPoolQuery.mockRejectedValue(new Error("SQL Error"));

        let error;
        try {
            await updateMailDispatch(true);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('updateMailDispatch - should throw SQL Error false', async () => {

        mockPoolQuery.mockRejectedValue(new Error("SQL Error"));

        let error;
        try {
            await updateMailDispatch(false);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

});