import { pool } from '../config/postgresConfig';

export const updateLogo = async (image: string): Promise<void> => {
    try {
        console.log("Update Logo");
        const base64Image = image.replace(/^data:image\/png;base64,/, '');
        const result = await pool.query('UPDATE logo SET image = decode($1, \'base64\') WHERE id = $2', [base64Image, 1]);
        if(result.rowCount === 0) {
            throw new Error("Error updating Logo");
        }
    } catch (err) {
        console.log(err);
        throw new Error("Error updating Logo");
    }
};

export const selectLogo = async (): Promise<string> => {
    try {
        console.log("Get Logo");
        const result = await pool.query('SELECT encode(image, \'base64\') FROM logo WHERE id = $1', [1]);

        if (result.rows.length > 0) {
            return `data:image/png;base64,${result.rows[0].encode}`;
        } else {
            throw new Error("Error retrieving Logo");
        }

    } catch (err) {
        console.log(err);
        throw new Error("Error retrieving Logo");
    }
};