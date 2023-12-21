import { pool } from '../config/postgresConfig';
import { User } from '../models/userModel';

export const userExists = async (id: string): Promise<boolean> => {
    try {
        console.log("Get User");
        const result = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
        return result.rows.length > 0 ? true : false;
    } catch (err) {
        console.log(`Error reading user: ${err}`);
        throw new Error("SQL Error");
    }
}

export const insertUser = async (user: User): Promise<void> => {
    try {
        console.log(`Inserting new User: ${user.id}`);
        await pool.query('INSERT INTO users(id, first_name, last_name, mail) VALUES ($1, $2, $3, $4)', [user.id, user.firstName, user.lastName, user.mail]);
    } catch (err) {
        console.log(`Error inserting new User: ${err}`);
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