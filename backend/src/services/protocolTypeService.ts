import { pool } from '../config/postgresConfig';
import { ProtocolType } from '../models/protocolTypeModel';

export const insertProtocolType = async (protocolType: ProtocolType): Promise<void> => {
    try {
        await pool.query(
            'INSERT INTO protocol_types(title, template) VALUES ($1, $2)', 
            [protocolType.title, protocolType.template]);
    } catch (err) {
        console.log(err);
        throw new Error("Error inserting protocol type");
    }
};

export const selectProtocolTypeById = async (protocolTypeId: number): Promise<ProtocolType> => {
    console.log(`Select Protocol Type ID ${protocolTypeId}`);
    try {
        const result = await pool.query('SELECT * FROM protocol_types WHERE id = $1', [protocolTypeId]);

        if (result.rows.length > 0) {
            const protocolType: ProtocolType = result.rows[0];
            return protocolType;
        } else {
            throw new Error(`Protocol Type with ID '${protocolTypeId}' not found`);
        }
    } catch (err) {
        console.log(err);
        throw new Error(`Protocol Type with ID '${protocolTypeId}' not found`);
    }
}

export const selectProtocolTypes = async (): Promise<ProtocolType[]> => {
    try {
        const protocolTypes: ProtocolType[] = [];
        const protocolTypesData = await pool.query('SELECT * FROM protocol_types');
        if(protocolTypesData.rows.length > 0) {   
            for(const row of protocolTypesData.rows) {
                const protocolType: ProtocolType = row;                
                protocolTypes.push(protocolType);
            }
        }
        return protocolTypes;      
    } catch(err) {
        console.log(err);
    }
};

export const updateProtocolType = async (protocolTypeId: number, protocolType: ProtocolType): Promise<void> => {
    try {
        console.log("Update Protocol Type ID: ", protocolTypeId);
        const result = await pool.query(
            'UPDATE protocol_types SET title = $1, template = $2 WHERE id = $3',
            [protocolType.title, protocolType.template, protocolTypeId]);
        if(result.rowCount === 0) {
            throw new Error("No rows updated.");
        }
    } catch (err) {
        console.log(err);
        throw new Error("Error inserting protocol type");
    }
};

export const selectProtocolTypeId = async (title: string): Promise<number> => {
    try {
        const result = await pool.query('SELECT id FROM protocol_types WHERE title = $1', [title]);

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

export const selectProtocolTypeTitle = async (id: number): Promise<string> => {
    try {
        const result = await pool.query('SELECT title FROM protocol_types WHERE id = $1', [id]);

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