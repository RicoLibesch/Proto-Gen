const connection = require('../config/postgresConfig');
const { Protocol } = require('../models/protocolModel');
const { AttendanceList } = require('../models/attendanceListModel');
const {insertProtocolAttendance, selectProtocolAttendance} = require('./protocolAttendanceService');
const {insertProtocolTopics, selectProtocolTopics} = require('./protocolTopicService');
const {selectProtocolTypeId, selectProtocolTypeTitle} = require('./protocolTypeService');

const selectProtocolById = async (protocolId: number): Promise<typeof Protocol> => {
    console.log("Select Protocol ID ", protocolId);
    try {
        const result = await connection.query('SELECT * FROM protocols WHERE id = $1', [protocolId]);

        if (result.rows.length > 0) {
            const attendanceList: typeof AttendanceList = await selectProtocolAttendance(result.rows[0].id);
            const topics: string[] = await selectProtocolTopics(result.rows[0].id);
            const type: string = await selectProtocolTypeTitle(result.rows[0].protocol_type_id);

            const protocol: typeof Protocol = new Protocol(
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

const selectProtocols = async (): Promise<typeof Protocol[]> => {
    try {
        const protocols: typeof Protocol[] = [];
        const protocolsData = await connection.query('SELECT * FROM protocols');
        if(protocolsData.rows.length > 0) {
            for(const row of protocolsData.rows) {
                const attendanceList: typeof AttendanceList = await selectProtocolAttendance(row.id);
                const topics: string[] = await selectProtocolTopics(row.id);
                const type: string = await selectProtocolTypeTitle(row.protocol_type_id);

                const protocol: typeof Protocol = new Protocol(
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

const insertProtocol = async (protocol: typeof Protocol): Promise<void> => {
    console.log("Inserting new Procotol")
    console.log(protocol);
    try {
        const protocolTypeId = await selectProtocolTypeId(protocol.protocol_type);

        const protocolId = await insertProtocolData(protocol, protocolTypeId);
        await insertProtocolTopics(protocolId, protocol.topics);
        await insertProtocolAttendance(protocolId, protocol.attendanceList);

    } catch (err) {
        throw new Error("Inserting Error");
    }
};

const insertProtocolData = async (protocol: typeof Protocol, protocolTypeId: number): Promise<number> => {
    try {
        const result = await connection.query(
            'INSERT INTO protocols(protocol_type_id, start_timestamp, end_timestamp, content) VALUES ($1, $2, $3, $4) RETURNING id', 
            [protocolTypeId, protocol.start_timestamp, protocol.end_timestamp, protocol.content]);

        return result.rows[0].id;

    } catch (err) {
        console.log(err);
        throw new Error("Error inserting protocol data");
    }
};

module.exports = {insertProtocol, selectProtocolById, selectProtocols};