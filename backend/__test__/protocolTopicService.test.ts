//Importing the Controller
import {insertProtocolTopics, selectProtocolTopics} from "../src/services/protocolTopicService";
import {pool} from "../src/config/postgresConfig";

//mocking the  Service
jest.mock('pg', () => {
    const mPool = {
        query: jest.fn(),
        on: jest.fn(),
        connect: jest.fn(),
        end: jest.fn(),
    };
    return {Pool: jest.fn(() => mPool)};
});

describe('Testing of the functions of the protocolTopicService', () => {
    const mockPoolQuery = pool.query as jest.Mock;

    beforeEach(() => {
        mockPoolQuery.mockClear();
    });

    it('selectProtocolTopics - should correctly return the topics', async () => {
        const testTopics = [
            {topic_name: "Aktueller Stand"},
            {topic_name: "Mergen"},
            {topic_name: "Offene Tickets"},
            {topic_name: "Zeiten buchen"}
        ];
        mockPoolQuery.mockResolvedValue({rows: testTopics});

        const res = await selectProtocolTopics(1);

        expect(mockPoolQuery).toHaveBeenCalledWith("SELECT * FROM protocol_topics WHERE protocol_id = $1", [1]);
        expect(res).toEqual(testTopics.map(topic => topic.topic_name));
    });

    it('selectProtocolTopics - should correctly return the topics and throw an error', async () => {
        const testTopics = ["Aktueller Stand", "Mergen", "Offene Tickets", "Zeiten buchen"];

        let error;
        mockPoolQuery.mockRejectedValue(new Error(`Error inserting protocol topics: ${error}`));
        try {
            await selectProtocolTopics(1)
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('insertProtocolTopics - should insert the Topics correctly', async () => {
        const testTopics = [
            {topic_name: "Aktueller Stand"},
            {topic_name: "Mergen"},
            {topic_name: "Offene Tickets"},
            {topic_name: "Zeiten buchen"}
        ];
        mockPoolQuery.mockResolvedValue({rows: testTopics});
        const topicNames = testTopics.map(topic => topic.topic_name);
        const res = await insertProtocolTopics(1, topicNames);

        topicNames.forEach(topicName => {
            expect(mockPoolQuery).toHaveBeenCalledWith(
                'INSERT INTO protocol_topics(protocol_id, topic_name) VALUES ($1, $2)',
                [1, topicName]
            );
        });
    });

    it('insertProtocolTopics - should not insert the Topics correctly and throw an error', async () => {
        const testTopics = ["Aktueller Stand", "Mergen", "Offene Tickets", "Zeiten buchen"];

        let error;
        mockPoolQuery.mockRejectedValue(new Error(`Error inserting protocol topics: ${error}`));
        try {
            await insertProtocolTopics(1, testTopics)
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

});