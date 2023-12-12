import { pool } from '../config/postgresConfig';
import { Social } from '../models/socialModel';

export const updateSocial = async (id: number, value: string): Promise<void> => {
    try {
        console.log("Update Social");
        const result = await pool.query('UPDATE socials SET value = $1 WHERE id = $2', [value ,id]);
        if(result.rowCount === 0) {
            throw new Error("Not found");
        }
    } catch (err) {
        if(err.message === "Not found") {
            throw new Error("Not found");
        }
        console.log(`Error updating socials: ${err}`);
        throw new Error("SQL Error");
    }
};

export const selectSocials = async (): Promise<Social[]> => {
    try {
        console.log("Get Socials");
        const socials: Social[] = [];
        const result = await pool.query('SELECT * FROM socials');        
        if (result.rows.length > 0)
            result.rows.forEach(row => socials.push(new Social(row.id, row.title, row.value)));        
        return socials;
    } catch (err) {
        console.log(`Error reading socials: ${err}`);
        throw new Error("SQL Error");
    }
};