import { pool } from '../config/postgresConfig';
import { AttendanceCategory } from '../models/attendanceCategoryModel';

export const updateCategories = async (categories: AttendanceCategory[]): Promise<void> => {
    try {        
        await pool.query('BEGIN');
        await pool.query('DELETE FROM attendance_categories');
        const insertQuery = 'INSERT INTO attendance_categories(title, "order") VALUES($1, $2)';
        for (const category of categories) {
            const attendanceValues = [category.title, category.order];
            await pool.query(insertQuery, attendanceValues);
        }
        await pool.query('COMMIT');
    } catch (err) {
        console.log(`Error updating Attendance Categories: ${err}`);
        throw new Error("SQL Error");
    }
};

export const selectCategories = async (): Promise<AttendanceCategory[]> => {
    try {
        const result = await pool.query('SELECT * FROM attendance_categories');
        const categories: AttendanceCategory[] = [];
        if (result.rows.length > 0)
            result.rows.forEach(row => categories.push(new AttendanceCategory(row.title, row.order)));
        return categories;
    } catch (err) {
        console.log(`Error retrieving Attendance Categories: ${err}`);
        throw new Error("SQL Error");
    }
};