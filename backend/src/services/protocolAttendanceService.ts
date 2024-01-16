import { pool } from '../config/postgresConfig';
import { AttendanceList } from '../models/attendanceListModel';

export const insertProtocolAttendance = async (protocolId: number, attendanceList: AttendanceList): Promise<void> => {
    try {
        const attendanceQuery = 'INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)';
        for (const role in attendanceList) {
            const names = attendanceList[role];
            for (const name of names) {
                const attendanceValues = [protocolId, name, role];
                await pool.query(attendanceQuery, attendanceValues);
            }
        }
    }catch (err) {
        console.log(`Error inserting protocol attendees: ${err}`);
        throw new Error("SQL Error");
    }
};

export const selectProtocolAttendance = async (protocolId: number): Promise<AttendanceList> => {
    try {
        const attendanceData = await pool.query("SELECT * FROM protocol_attendances WHERE protocol_id = $1", [protocolId]);
        const attendanceList = {};
        attendanceData.rows.forEach(attendance => {
            const role = attendance.role_name;
            const name = attendance.user_name;
    
            if (!attendanceList[role])
                attendanceList[role] = [];
    
            attendanceList[role].push(name);
        });
        return new AttendanceList(attendanceList);
    } catch (err) {
        console.log(`Error selecting protocol attendees: ${err}`);
        throw new Error("SQL Error");
    }
};