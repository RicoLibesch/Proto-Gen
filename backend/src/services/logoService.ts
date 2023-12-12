import { pool } from '../config/postgresConfig';

export const updateLogo = async (image: string): Promise<void> => {
    try {
        console.log("Update Logo");
        const base64Image = image.replace(/^data:image\/png;base64,/, '');
        const result = await pool.query('UPDATE logo SET image = decode($1, \'base64\') WHERE id = $2', [base64Image, 1]);
        if(result.rowCount === 0) {
            throw new Error("SQL Error");
        }
    } catch (err) {
        console.log(`Error updating the logo: ${err}`);
        throw new Error("SQL Error");
    }
};

export const selectLogo = async (): Promise<string> => {
    try {
        console.log("Get Logo");
        const result = await pool.query('SELECT encode(image, \'base64\') FROM logo WHERE id = $1', [1]);

        if (result.rows.length > 0 && result.rows[0].encode != null) {
            return `data:image/png;base64,${result.rows[0].encode}`;
        } else {
            return null;
        }
    } catch (err) {
        console.log(`Error reading logo: ${err}`);
        throw new Error("SQL Error");
    }
};