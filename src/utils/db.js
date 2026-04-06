import pool from '../config/db.js';

const executeQuery = async (query, values = []) => {
    try {
        const result = await pool.query(query, values);
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error(`Database operation failed: ${error.message}`);
    }
};

const executeQuerySingle = async (query, values = []) => {
    const result = await executeQuery(query, values);
    return result.rows[0];
};

const executeQueryMultiple = async (query, values = []) => {
    const result = await executeQuery(query, values);
    return result.rows;
};

const ensureSoftDeleteMigration = async () => {
    await executeQuery(`ALTER TABLE records ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ`);
};

export { executeQuery, executeQuerySingle, executeQueryMultiple, ensureSoftDeleteMigration };