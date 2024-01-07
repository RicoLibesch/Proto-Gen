import { pool } from '../config/postgresConfig';
import { Legal } from '../models/legalModel';

export const updateLegal = async (id: number, value: string): Promise<void> => {
    try {
        console.log("Update Legal");
        const result = await pool.query('UPDATE legals SET value = $1 WHERE id = $2', [value ,id]);
        if(result.rowCount === 0) {
            throw new Error("Not found");
        }
    } catch (err) {
        if(err.message === "Not found") {
            throw new Error("Not found");
        }
        console.log(`Error updating legal: ${err}`);
        throw new Error("SQL Error");
    }
};

export const selectLegals = async (): Promise<Legal[]> => {
    try {
        console.log("Get Legals");
        const legals: Legal[] = [];
        const result = await pool.query('SELECT * FROM legals');        
        if (result.rows.length > 0)
            result.rows.forEach(row => legals.push(new Legal(row.id, row.title, row.value)));        
        return legals;
    } catch (err) {
        console.log(`Error reading legals: ${err}`);
        throw new Error("SQL Error");
    }
};