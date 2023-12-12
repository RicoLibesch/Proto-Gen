import { pool } from '../config/postgresConfig';
import { ProtocolType } from '../models/protocolTypeModel';

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
        console.log(`Error reading protocol types: ${err}`);
        throw new Error("SQL Error");
    }
};

export const updateProtocolTypes = async (protocolTypes: ProtocolType[]): Promise<void> => {
    try {
        console.log("Update Protocol Types");
        await pool.query('BEGIN');
        await pool.query('DELETE FROM protocol_types');
        const insertQuery = 'INSERT INTO protocol_types(title, template) VALUES ($1, $2)';
        for(const protocolType of protocolTypes) {
            await pool.query(insertQuery, [protocolType.title, protocolType.template]);
        }

        await pool.query('COMMIT');
    } catch (err) {
        console.log(`Error updating protocol types: ${err}`);
        throw new Error("SQL Error");
    }
};