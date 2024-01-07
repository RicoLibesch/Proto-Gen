import { pool } from '../config/postgresConfig';

export const updateTemplate = async (type: string, value: string): Promise<void> => {
    try {
        const result = await pool.query('UPDATE mail_templates SET value = $1 WHERE type = $2', [value, type]);
        if(result.rowCount === 0) {
            throw new Error("SQL Error");
        }
    } catch (err) {
        console.log(`Error updating mail subject: ${err}`);
        throw new Error("SQL Error");
    }
};

export const selectTemplate = async (type: string): Promise<string> => {
    try {
        const result = await pool.query('SELECT value FROM mail_templates WHERE type = $1', [type]);
        return result.rows[0].value;
    } catch (err) {
        console.log(`Error reading mail template ${type}: ${err}`);
        throw new Error("SQL Error");
    }
};