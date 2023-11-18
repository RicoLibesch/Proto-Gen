const connection = require('../config/postgresConfig');
const { ProtocolType } = require('../models/protocolTypeModel');

const insertProtocolType = async (protocolType: typeof ProtocolType): Promise<void> => {
    try {
        await connection.query(
            'INSERT INTO protocol_types(title, template) VALUES ($1, $2)', 
            [protocolType.title, protocolType.template]);
    } catch (err) {
        console.log(err);
        throw new Error("Error inserting protocol type");
    }
};

const selectProtocolTypeById = async (protocolTypeId: number): Promise<typeof ProtocolType> => {
    console.log(`Select Protocol Type ID ${protocolTypeId}`);
    try {
        const result = await connection.query('SELECT * FROM protocol_types WHERE id = $1', [protocolTypeId]);

        if (result.rows.length > 0) {
            const protocolType: typeof ProtocolType = result.rows[0];
            return protocolType;
        } else {
            throw new Error(`Protocol Type with ID '${protocolTypeId}' not found`);
        }
    } catch (err) {
        console.log(err);
        throw new Error(`Protocol Type with ID '${protocolTypeId}' not found`);
    }
}

const selectProtocolTypes = async (): Promise<typeof ProtocolType[]> => {
    try {
        const protocolTypes: typeof ProtocolType[] = [];
        const protocolTypesData = await connection.query('SELECT * FROM protocol_types');
        if(protocolTypesData.rows.length > 0) {   
            for(const row of protocolTypesData.rows) {
                const protocolType: typeof ProtocolType = row;                
                protocolTypes.push(protocolType);
            }
        }
        return protocolTypes;      
    } catch(err) {
        console.log(err);
    }
};

const updateProtocolType = async (protocolTypeId: number, protocolType: typeof ProtocolType): Promise<void> => {
    try {
        console.log("Update Protocol Type ID: ", protocolTypeId);
        const result = await connection.query(
            'UPDATE protocol_types SET title = $1, template = $2 WHERE id = $3',
            [protocolType.title, protocolType.template, protocolTypeId]);
        if(result.rowCount === 0) {
            throw new Error("No rows updated.");
        }
        console.log(result);
    } catch (err) {
        console.log(err);
        throw new Error("Error inserting protocol type");
    }
};

const selectProtocolTypeId = async (title: string): Promise<number> => {
    try {
        const result = await connection.query('SELECT id FROM protocol_types WHERE title = $1', [title]);

        if (result.rows.length > 0) {
            return result.rows[0].id;
        } else {
            throw new Error(`Type with title '${title}' not found`);
        }

    } catch (err) {
        console.log(err);
        throw new Error("Error retrieving type ID");
    }
};

const selectProtocolTypeTitle = async (id: number): Promise<string> => {
    try {
        const result = await connection.query('SELECT title FROM protocol_types WHERE id = $1', [id]);

        if (result.rows.length > 0) {
            return result.rows[0].title;
        } else {
            throw new Error(`Type with ID '${id}' not found`);
        }
    } catch (err) {
        console.log(err);
        throw new Error("Error retrieving type Name");
    }
};

module.exports = {insertProtocolType, selectProtocolTypeById, selectProtocolTypes, updateProtocolType, selectProtocolTypeId, selectProtocolTypeTitle};