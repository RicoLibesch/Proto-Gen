import { pool } from '../config/postgresConfig';
import { User } from '../models/userModel';

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

export const selectPermissions = async (user: User): Promise<void> => {
    try {
        const roles = await pool.query('SELECT role_id from user_roles WHERE user_id  = $1', [user.id]);
        roles.rows.forEach(role => {
            switch(role.role_id) {
                case 1: {
                    user.isAdmin = true;
                    break;
                }
                case 2: {
                    user.isRecorder = true;
                    break;
                }
            } 
        });
    } catch (err) {
        console.log(`Error reading permissions: ${err}`);
        throw new Error("SQL Error");
    }
};