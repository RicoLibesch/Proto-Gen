import { Pool } from 'pg';

export const pool: Pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

pool.on('error', (err) => {
    console.error('Database connection error:', err);
});