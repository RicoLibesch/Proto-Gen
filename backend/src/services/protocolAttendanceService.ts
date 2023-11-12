const connection = require('../config/postgresConfig');
const { AttendanceList } = require('../models/attendanceListModel');

const insertProtocolAttendance = async (protocolId: number, attendanceList: { [role: string]: string[] }): Promise<void> => {
    try {
        const attendanceQuery = 'INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)';
        for (const role in attendanceList) {
        const names = attendanceList[role];
        for (const name of names) {
            const attendanceValues = [protocolId, name, role];
            await connection.query(attendanceQuery, attendanceValues);
        }
        }
    }catch (err) {
        console.log(err);
    }
};

const selectProtocolAttendance = async (protocolId: number): Promise<typeof AttendanceList> => {
    const attendanceData = await connection.query("SELECT * FROM protocol_attendances WHERE protocol_id = $1", [protocolId]);
    const attendanceList = {};
    attendanceData.rows.forEach(attendance => {
        const role = attendance.role_name;
        const name = attendance.user_name;

        if (!attendanceList[role])
            attendanceList[role] = [];

        attendanceList[role].push(name);
    });
    return attendanceList;
};

module.exports = {insertProtocolAttendance, selectProtocolAttendance};