import { pool } from '../config/postgresConfig';

export const isMailDispatchEnabled = async (): Promise<boolean> => {
    try {
        const result = await pool.query('SELECT status FROM mail_dispatch_settings');
        return result.rows[0].status === 1 ? true : false;
    } catch (err) {
        console.log(`Error reading mail dispatch status: ${err}`);
        throw new Error("SQL Error");
    }
};

export const updateMailDispatch = async (isEnabled: boolean): Promise<void> => {
    try {
        const value = isEnabled ? 1 : 0;
        const result = await pool.query('UPDATE mail_dispatch_settings SET status = $1', [value]);
        if(result.rowCount === 0) {
            throw new Error("SQL Error");
        }
    } catch (err) {
        console.log(`Error updating mail dispatch status: ${err}`);
        throw new Error("SQL Error");
    }
};