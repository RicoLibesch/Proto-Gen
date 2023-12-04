import { pool } from '../config/postgresConfig';
import { AttendanceCategory } from '../models/attendanceCategoryModel';

export const updateCategories = async (categories: AttendanceCategory[]): Promise<void> => {
    try {
        console.log("Update Attendance Categories");
        
        await pool.query('BEGIN');
        await pool.query('DELETE FROM attendance_categories');
        const insertQuery = 'INSERT INTO attendance_categories(title, "order") VALUES($1, $2)';
        for (const category of categories) {
            const attendanceValues = [category.title, category.order];
            await pool.query(insertQuery, attendanceValues);
        }

        await pool.query('COMMIT');
    } catch (err) {
        console.log(err);
        throw new Error("Error updating Categories");
    }
};

export const selectCategories = async (): Promise<AttendanceCategory[]> => {
    try {
        console.log("Get Attendance Categories");
        const result = await pool.query('SELECT * FROM attendance_categories');
        const categories: AttendanceCategory[] = [];
        if (result.rows.length > 0)
            result.rows.forEach(row => categories.push(new AttendanceCategory(row.title, row.order)));
        return categories;
    } catch (err) {
        console.log(err);
        throw new Error("Error retrieving Attendance Categories");
    }
};