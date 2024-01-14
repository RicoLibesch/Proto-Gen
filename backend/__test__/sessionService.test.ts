//Importing the Controller
import { pool } from '../src/config/postgresConfig';
import {isSessionActive, startSession, stopSession} from "../src/services/sessionService";

//mocking the Service
jest.mock('pg', () => {
    const mPool = {
        query: jest.fn(),
        on: jest.fn(),
        connect: jest.fn(),
        end: jest.fn(),
    };
    return {Pool: jest.fn(() => mPool)};
});

describe('Testing of the functions of the sessionService', () => {
    const mockPoolQuery = pool.query as jest.Mock;

    beforeEach(() => {
        mockPoolQuery.mockClear();
    });

    it('isSessionActive - should return true ', async () => {
        mockPoolQuery.mockResolvedValue({ rows: [{ status: 1 }] });

        const res = await isSessionActive();

        expect(res).toBe(true);
    });

    it('isSessionActive - should return false ', async () => {
        mockPoolQuery.mockResolvedValue({ rows: [{ status: 0 }] });

        const res = await isSessionActive();

        expect(res).toBe(false);
    });

    it('isSessionActive - should throw SQL Error', async () => {
        mockPoolQuery.mockRejectedValue(new Error("SQL Error"));

        let error;
        try {
            await isSessionActive();
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('startSession - should start a Session', async () => {
        mockPoolQuery.mockResolvedValue({ rowCount: 1 });

        await expect(startSession()).resolves.toBeUndefined();

        expect(mockPoolQuery).toHaveBeenCalledWith('UPDATE session SET status = $1', [1]);
    });

    it('startSession - should throw SQL Error rowcount 0', async () => {
        mockPoolQuery.mockResolvedValue({ rowCount: 0 });

        let error;
        try {
            await expect(startSession()).resolves.toBeUndefined();
        } catch (e) {
            error = e;
        }

        expect(mockPoolQuery).toHaveBeenCalledWith('UPDATE session SET status = $1', [1]);
    });

    it('startSession - should throw SQL Error', async () => {
        mockPoolQuery.mockRejectedValue(new Error("SQL Error"));

        let error;
        try {
            await startSession();
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('stopSession - should stop a Session', async () => {
        mockPoolQuery.mockResolvedValue({ rowCount: 1 });

        await expect(stopSession()).resolves.toBeUndefined();

        expect(mockPoolQuery).toHaveBeenCalledWith('UPDATE session SET status = $1', [0]);
    });

    it('stopSession - should throw SQL Error rowcount 0', async () => {
        mockPoolQuery.mockResolvedValue({ rowCount: 0 });

        let error;
        try {
            await expect(stopSession()).resolves.toBeUndefined();
        } catch (e) {
            error = e;
        }

        expect(mockPoolQuery).toHaveBeenCalledWith('UPDATE session SET status = $1', [0]);
    });

    it('stopSession - should throw SQL Error', async () => {
        mockPoolQuery.mockRejectedValue(new Error("SQL Error"));

        let error;
        try {
            await stopSession();
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

});