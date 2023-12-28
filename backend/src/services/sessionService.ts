import { pool } from '../config/postgresConfig';
import { removeAttendees } from './sessionAttendanceService';

export const isSessionActive = async (): Promise<boolean> => {
    try {
        const result = await pool.query('SELECT status FROM session');
        return result.rows[0].status === 1 ? true : false;
    } catch (err) {
        console.log(`Error reading session status: ${err}`);
        throw new Error("SQL Error");
    }
};

export const startSession = async (): Promise<void> => {
    try {
        const result = await pool.query('UPDATE session SET status = $1', [1]);
        if(result.rowCount === 0) {
            throw new Error("SQL Error");
        }
    } catch (err) {
        console.log(`Error starting session: ${err}`);
        throw new Error("SQL Error");
    }
};

export const stopSession = async (): Promise<void> => {
    try {
        const result = await pool.query('UPDATE session SET status = $1', [0]);
        if(result.rowCount === 0) {
            throw new Error("SQL Error");
        }
        await removeAttendees();
    } catch (err) {
        console.log(`Error stopping session: ${err}`);
        throw new Error("SQL Error");
    }
};