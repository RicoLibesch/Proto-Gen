const connection = require('../config/postgresConfig');
const { Protocol } = require('../models/protocolModel');
const {insertProtocolAttendance, selectProtocolAttendance} = require('./protocolAttendanceService');
const {insertProtocolTopics, selectProtocolTopics} = require('./protocolTopicService');

const selectProtocolById = async (protocolId: number): Promise<typeof Protocol> => {
    console.log("Select Protocol ID ", protocolId);
    try {
        const result = await connection.query('SELECT * FROM protocols WHERE id = $1', [protocolId]);

        if (result.rows.length > 0) {
            const protocol: typeof Protocol = result.rows[0];
            protocol.attendanceList = await selectProtocolAttendance(protocol.id);
            protocol.topics = await selectProtocolTopics(protocol.id);

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
                const protocol: typeof Protocol = row;
                protocol.attendanceList = await selectProtocolAttendance(protocol.id);
                protocol.topics = await selectProtocolTopics(protocol.id);
                protocols.push(protocol);
            }
        }
        return protocols;        
    } catch(err) {
        console.log(err);
    }
};

const insertProtocol = async (protocol: typeof Protocol): Promise<void> => {
    console.log("Inserting Procotol: ")
    console.log(protocol);

    try {
        //const protocolTypeId = await selectProtocolTypeId(protocol.protocol_type);

        const protocolId = await insertProtocolData(protocol);
        await insertProtocolTopics(protocolId, protocol.topics);
        await insertProtocolAttendance(protocolId, protocol.attendanceList);

    } catch (err) {
        throw new Error(`Inserting Error`);
    }
};

const insertProtocolData = async (protocol: typeof Protocol): Promise<number> => {
    try {
        const result = await connection.query(
            'INSERT INTO protocols(protocol_type, start_timestamp, end_timestamp, content) VALUES ($1, $2, $3, $4) RETURNING id', 
            [protocol.protocol_type, protocol.start_timestamp, protocol.end_timestamp, protocol.content]);

        return result.rows[0].id;

    } catch (err) {
        console.log(err);
        throw new Error("Error inserting protocol data");
    }
};

module.exports = {insertProtocol, selectProtocolById, selectProtocols};