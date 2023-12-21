import { pool } from '../config/postgresConfig';

export const hasRole = async (userId: string, roleId: number): Promise<boolean> => {
    try {
        console.log("Get Role");
        const result = await pool.query('SELECT role_id FROM user_roles WHERE user_id = $1 AND role_id = $2', [userId, roleId]);
        return result.rows.length > 0 ? true : false;
    } catch (err) {
        console.log(`Error reading user: ${err}`);
        throw new Error("SQL Error");
    }
}