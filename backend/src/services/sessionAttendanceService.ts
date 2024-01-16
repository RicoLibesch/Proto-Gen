import { pool } from '../config/postgresConfig';

export const removeAttendees = async (): Promise<void> => {
    try {
        await pool.query('DELETE FROM session_attendees');
    } catch (err) {
        console.log(`Error deleting attendees of current session: ${err}`);
        throw new Error("SQL Error");
    }
};

export const addAttendee = async (name: string): Promise<void> => {
    try {
        await pool.query('INSERT INTO session_attendees(attendee) VALUES ($1)', [name]);
    } catch (err) {
        console.log(`Error adding attendee ${name} to current session: ${err}`);
        throw new Error("SQL Error");
    }
};

export const selectAttendees = async (): Promise<string[]> => {
    try {
        const attendees: string[] = [];
        const attendeesData = await pool.query("SELECT * FROM session_attendees");
        attendeesData.rows.forEach(attendee => attendees.push(attendee.attendee));
        return attendees;
    } catch (err) {
        console.log(`Error selecting attendees of current session: ${err}`);
        throw new Error("SQL Error");
    }
};