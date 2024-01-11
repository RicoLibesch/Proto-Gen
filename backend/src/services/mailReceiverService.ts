import { pool } from '../config/postgresConfig';

export const updateReceiver = async (mails: string[]): Promise<void> => {
    try {      
        await pool.query('BEGIN');
        await pool.query('DELETE FROM mail_receiver');
        const insertQuery = 'INSERT INTO mail_receiver(mail) VALUES($1)';
        for (const mail of mails) {
            const attendanceValues = [mail];
            await pool.query(insertQuery, attendanceValues);
        }
        await pool.query('COMMIT');
    } catch (err) {
        console.log(`Error updating mail receivers: ${err}`);
        throw new Error("SQL Error");
    }
};

export const selectReceiver = async (): Promise<string[]> => {
    try {
        const result = await pool.query('SELECT mail FROM mail_receiver');
        const mails: string[] = [];
        if (result.rows.length > 0)
            result.rows.forEach(row => mails.push(row.mail));
        return mails;
    } catch (err) {
        console.log(`Error reading mail receivers: ${err}`);
        throw new Error("SQL Error");
    }
};