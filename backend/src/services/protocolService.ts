import { pool } from '../config/postgresConfig';
import { Protocol } from '../models/protocolModel';
import { AttendanceList } from '../models/attendanceListModel';
import {insertProtocolAttendance, selectProtocolAttendance} from './protocolAttendanceService';
import {insertProtocolTopics, selectProtocolTopics} from './protocolTopicService';
import { stopSession } from '../services/sessionService';

export const selectProtocolById = async (protocolId: number): Promise<Protocol> => {
    console.log("Select Protocol ID ", protocolId);
    try {
        const result = await pool.query('SELECT * FROM protocols WHERE id = $1', [protocolId]);

        if (result.rows.length > 0) {
            const attendanceList: AttendanceList = await selectProtocolAttendance(result.rows[0].id);
            const topics: string[] = await selectProtocolTopics(result.rows[0].id);

            const protocol: Protocol = new Protocol(
                result.rows[0].protocol_type,
                result.rows[0].start_timestamp,
                result.rows[0].end_timestamp,
                result.rows[0].content,
                topics,
                attendanceList,
                result.rows[0].id
            );
            return protocol;
        } else {
            return null;
        }
    } catch (err) {
        console.log(`Error selecting protocol with ID ${protocolId}: ${err}`);
        throw new Error("SQL Error");
    }
}

export const selectProtocols = async (page: number, pageSize: number): Promise<Protocol[]> => {
    try {
        const protocols: Protocol[] = [];
        const offset: number = (page - 1) * pageSize;
        const protocolsData = await pool.query('SELECT * FROM protocols ORDER BY id DESC OFFSET $1 LIMIT $2', [offset, pageSize]);
        if(protocolsData.rows.length > 0) {
            for(const row of protocolsData.rows) {
                const attendanceList: AttendanceList = await selectProtocolAttendance(row.id);
                const topics: string[] = await selectProtocolTopics(row.id);

                const protocol: Protocol = new Protocol(
                    row.protocol_type,
                    row.start_timestamp,
                    row.end_timestamp,
                    row.content,
                    topics,
                    attendanceList,
                    row.id
                );
                protocols.push(protocol);
            }
        }
        return protocols;
    } catch(err) {
        console.log(`Error selecting protocols: ${err}`);
        throw new Error("SQL Error");
    }
};

export const selectAllProtocols = async (): Promise<Protocol[]> => {
    try {
        const protocols: Protocol[] = [];
        const protocolsData = await pool.query('SELECT * FROM protocols ORDER BY id DESC');
        if(protocolsData.rows.length > 0) {
            for(const row of protocolsData.rows) {
                const attendanceList: AttendanceList = await selectProtocolAttendance(row.id);
                const topics: string[] = await selectProtocolTopics(row.id);

                const protocol: Protocol = new Protocol(
                    row.protocol_type,
                    row.start_timestamp,
                    row.end_timestamp,
                    row.content,
                    topics,
                    attendanceList,
                    row.id
                );
                protocols.push(protocol);
            }
        }
        return protocols;
    } catch(err) {
        console.log(`Error selecting protocols: ${err}`);
        throw new Error("SQL Error");
    }
};

export const insertProtocol = async (protocol: Protocol): Promise<void> => {
    console.log("Inserting new Procotol")
    try {
        protocol.id = await insertProtocolData(protocol);
        await insertProtocolTopics(protocol.id, protocol.topics);
        await insertProtocolAttendance(protocol.id, protocol.attendanceList);
        await stopSession();
    } catch (err) {
        console.log(`Error inserting protocol: ${err}`);
        throw new Error("SQL Error");
    }
};

const insertProtocolData = async (protocol: Protocol): Promise<number> => {
    try {
        const result = await pool.query(
            'INSERT INTO protocols(protocol_type, start_timestamp, end_timestamp, content) VALUES ($1, $2, $3, $4) RETURNING id', 
            [protocol.protocol_type, protocol.start_timestamp, protocol.end_timestamp, protocol.content]);
        return result.rows[0].id;
    } catch (err) {
        console.log(`Error inserting protocol data: ${err}`);
        throw new Error("SQL Error");
    }
};