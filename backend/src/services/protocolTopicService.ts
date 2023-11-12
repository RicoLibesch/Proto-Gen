const connection = require('../config/postgresConfig');

const selectProtocolTopics = async (protocolId: number): Promise<string[]> => {
    const topicData = await connection.query("SELECT * FROM protocol_topics WHERE protocol_id = $1", [protocolId]);
    const topics = [];
    topicData.rows.forEach(topic => topics.push(topic.topic_name));
    return topics;
};

const insertProtocolTopics = async (protocolId: number, topics: string[]): Promise<void> => {
    try {
        const topicInsertPromises = topics.map(topic => {
            return connection.query('INSERT INTO protocol_topics(protocol_id, topic_name) VALUES ($1, $2)', [protocolId, topic]);
        });

        await Promise.all(topicInsertPromises);

    } catch (err) {
        console.log(err);
        throw new Error("Error inserting protocol topics");
    }
};

module.exports = {selectProtocolTopics, insertProtocolTopics};