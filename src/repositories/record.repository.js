import { executeQuerySingle, executeQueryMultiple } from '../utils/db.js';

const createRecord = async (data, userId) => {
    const query = `
        INSERT INTO records (id, user_id, amount, type, category, date, notes)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

    const values = [userId, data.amount, data.type, data.category, data.date, data.description];
    return await executeQuerySingle(query, values);
};

const getRecords = async (filters) => {
    let query = `SELECT * FROM records WHERE deleted_at IS NULL`;
    const values = [];
    let paramCount = 1;

    if (filters.type) {
        values.push(filters.type);
        query += ` AND type = $${paramCount}`;
        paramCount++;
    }

    if (filters.category) {
        values.push(filters.category);
        query += ` AND category = $${paramCount}`;
        paramCount++;
    }

    if (filters.startDate && filters.endDate) {
        values.push(filters.startDate, filters.endDate);
        query += ` AND date BETWEEN $${paramCount} AND $${paramCount + 1}`;
        paramCount += 2;
    }

    if (filters.search) {
        values.push(`%${filters.search}%`);
        query += ` AND (notes ILIKE $${paramCount} OR category ILIKE $${paramCount})`;
        paramCount++;
    }

    query += ` ORDER BY date DESC`;

    // Add pagination
    if (filters.limit && filters.pageNumber) {
        const offset = (filters.pageNumber - 1) * filters.limit;
        values.push(filters.limit);
        query += ` LIMIT $${paramCount}`;
        paramCount++;
        values.push(offset);
        query += ` OFFSET $${paramCount}`;
        paramCount++;
    }

    return await executeQueryMultiple(query, values);
};

const updateRecord = async (id, data) => {
    const query = `
        UPDATE records
        SET amount=$1, type=$2, category=$3, date=$4, notes=$5
        WHERE id=$6
        RETURNING *;
    `;

    const values = [data.amount, data.type, data.category, data.date, data.description, id];

    return await executeQuerySingle(query, values);
};

const deleteRecord = async (id) => {
    // Soft delete - set deleted_at timestamp
    return await executeQuerySingle(
        `UPDATE records SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *`,
        [id]
    );
};

const getRecordsCount = async (filters = {}) => {
    let query = `SELECT COUNT(*) as total FROM records WHERE deleted_at IS NULL`;
    const values = [];
    let paramCount = 1;

    if (filters.type) {
        values.push(filters.type);
        query += ` AND type = $${paramCount}`;
        paramCount++;
    }

    if (filters.category) {
        values.push(filters.category);
        query += ` AND category = $${paramCount}`;
        paramCount++;
    }

    if (filters.startDate && filters.endDate) {
        values.push(filters.startDate, filters.endDate);
        query += ` AND date BETWEEN $${paramCount} AND $${paramCount + 1}`;
        paramCount += 2;
    }

    if (filters.search) {
        values.push(`%${filters.search}%`);
        query += ` AND (notes ILIKE $${paramCount} OR category ILIKE $${paramCount})`;  
        paramCount++;
    }

    const result = await executeQuerySingle(query, values);
    return parseInt(result.total);
};

export default {
    createRecord,
    getRecords,
    getRecordsCount,
    updateRecord,
    deleteRecord
};