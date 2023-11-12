/*const selectProtocolTypeId = async (title: string): Promise<number> => {
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
};*/