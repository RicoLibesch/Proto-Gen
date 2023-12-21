import { pool } from '../config/postgresConfig';
import { User } from '../models/userModel';
import { hasRole } from './userRoleService';

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
        await pool.query('INSERT INTO users(id, first_name, last_name, display_name, mail) VALUES ($1, $2, $3, $4, $5)', 
            [user.id, user.firstName, user.lastName, user.displayName, user.mail]);
    } catch (err) {
        console.log(`Error inserting new User: ${err}`);
        throw new Error("SQL Error");
    }
}

export const selectAllUsers = async (searchQuery: string): Promise<User[]> => {
    try {
        const users: User[] = [];
        const userData = await pool.query('SELECT * FROM users WHERE LOWER(display_name) LIKE $1 LIMIT 20', [`%${searchQuery}%`]);
        if(userData.rows.length > 0) {
            for(const row of userData.rows) {
                const user: User = new User(
                    row.id,
                    row.first_name,
                    row.last_name,
                    row.display_name,
                    row.mail        
                );

                user.isAdmin = await hasRole(user.id, 1);
                user.isRecorder = await hasRole(user.id, 2);

                users.push(user);
            }
        }
        return users;
    } catch(err) {
        console.log(`Error selecting users: ${err}`);
        throw new Error("SQL Error");
    }    
};