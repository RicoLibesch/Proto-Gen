import { pool } from "../config/postgresConfig";
import { User } from "../models/userModel";
import { hasRole, insertPermission } from "./userRoleService";

export const userExists = async (id: string): Promise<boolean> => {
  try {
    const result = await pool.query("SELECT id FROM users WHERE id = $1", [id]);
    return result.rows.length > 0 ? true : false;
  } catch (err) {
    console.log(`Error reading user: ${err}`);
    throw new Error("SQL Error");
  }
};

export const insertUser = async (user: User): Promise<void> => {
  try {
    const firstUserCheck: boolean = await isFirstUser();

    await pool.query(
      "INSERT INTO users(id, first_name, last_name, display_name, mail) VALUES ($1, $2, $3, $4, $5)",
      [user.id, user.firstName, user.lastName, user.displayName, user.mail]
    );

    if (firstUserCheck) {
      await insertPermission(user.id, 1);
      console.log(
        `${user.id} was the first user and received the Administrator role.`
      );
    }
  } catch (err) {
    console.log(`Error inserting new User: ${err}`);
    throw new Error("SQL Error");
  }
};

export const selectAllUsers = async (
  page: number,
  pageSize: number,
  query: string,
  roleId: number
): Promise<User[]> => {
  try {
    const users: User[] = [];
    const offset: number = (page - 1) * pageSize;
    let userData;

    if (roleId) {
      userData = await pool.query(
        "SELECT * FROM users WHERE LOWER(id) LIKE $1 OR LOWER(display_name) LIKE $1 OR LOWER(first_name) LIKE $1 OR LOWER(last_name) LIKE $1 OR LOWER(mail) LIKE $1 AND id IN (SELECT user_id FROM user_roles WHERE role_id = $2) ORDER BY id DESC OFFSET $3 LIMIT $4",
        [`%${query}%`, roleId, offset, pageSize]
      );
    } else {
      userData = await pool.query(
        "SELECT * FROM users WHERE LOWER(id) LIKE $1 OR LOWER(display_name) LIKE $1 OR LOWER(first_name) LIKE $1 OR LOWER(last_name) LIKE $1 OR LOWER(mail) LIKE $1 ORDER BY id DESC OFFSET $2 LIMIT $3",
        [`%${query}%`, offset, pageSize]
      );
    }

    if (userData.rows.length > 0) {
      for (const row of userData.rows) {
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
  } catch (err) {
    console.log(`Error selecting users: ${err}`);
    throw new Error("SQL Error");
  }
};

const isFirstUser = async (): Promise<boolean> => {
  try {
    const result = await pool.query("SELECT * FROM users LIMIT 1");
    return result.rows.length === 0 ? true : false;
  } catch (err) {
    console.log(`Error selecting users: ${err}`);
    throw new Error("SQL Error");
  }
};
