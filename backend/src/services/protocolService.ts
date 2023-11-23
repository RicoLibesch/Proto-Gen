import { pool } from '../config/postgresConfig';
import { Protocol } from '../models/protocolModel';
import { AttendanceList } from '../models/attendanceListModel';
import {insertProtocolAttendance, selectProtocolAttendance} from './protocolAttendanceService';
import {insertProtocolTopics, selectProtocolTopics} from './protocolTopicService';
import {selectProtocolTypeId, selectProtocolTypeTitle} from './protocolTypeService';

export const selectProtocolById = async (protocolId: number): Promise<Protocol> => {
    console.log("Select Protocol ID ", protocolId);
    try {
        const result = await pool.query('SELECT * FROM protocols WHERE id = $1', [protocolId]);

        if (result.rows.length > 0) {
            const attendanceList: AttendanceList = await selectProtocolAttendance(result.rows[0].id);
            const topics: string[] = await selectProtocolTopics(result.rows[0].id);
            const type: string = await selectProtocolTypeTitle(result.rows[0].protocol_type_id);

            const protocol: Protocol = new Protocol(
                type,
                result.rows[0].start_timestamp,
                result.rows[0].end_timestamp,
                result.rows[0].content,
                topics,
                attendanceList,
                result.rows[0].id
            );

            return protocol;
        } else {
            throw new Error(`Protocol with ID '${protocolId}' not found`);
        }

    } catch (err) {
        console.log(err);
        throw new Error(`Protocol with ID '${protocolId}' not found`);
    }
}

export const selectProtocols = async (): Promise<Protocol[]> => {
    try {
        const protocols: Protocol[] = [];
        const protocolsData = await pool.query('SELECT * FROM protocols');
        if(protocolsData.rows.length > 0) {
            for(const row of protocolsData.rows) {
                const attendanceList: AttendanceList = await selectProtocolAttendance(row.id);
                const topics: string[] = await selectProtocolTopics(row.id);
                const type: string = await selectProtocolTypeTitle(row.protocol_type_id);

                const protocol: Protocol = new Protocol(
                    type,
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
        console.log(err);
    }
};

export const insertProtocol = async (protocol: Protocol): Promise<void> => {
    console.log("Inserting new Procotol")
    try {
        const protocolTypeId = await selectProtocolTypeId(protocol.protocol_type);

        const protocolId = await insertProtocolData(protocol, protocolTypeId);
        await insertProtocolTopics(protocolId, protocol.topics);
        await insertProtocolAttendance(protocolId, protocol.attendanceList);

    } catch (err) {
        throw new Error("Inserting Error");
    }
};

const insertProtocolData = async (protocol: Protocol, protocolTypeId: number): Promise<number> => {
    try {
        const result = await pool.query(
            'INSERT INTO protocols(protocol_type_id, start_timestamp, end_timestamp, content) VALUES ($1, $2, $3, $4) RETURNING id', 
            [protocolTypeId, protocol.start_timestamp, protocol.end_timestamp, protocol.content]);

        return result.rows[0].id;

    } catch (err) {
        console.log(err);
        throw new Error("Error inserting protocol data");
    }
};