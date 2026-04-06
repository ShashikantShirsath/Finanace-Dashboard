import { executeQuerySingle, executeQueryMultiple } from '../utils/db.js';

const createUser = async (user) => {
    const query = `
        INSERT INTO users (id, name, email, password, role, status) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id, name, email, role, status;`;

    const values = [ user.id, user.name, user.email, user.password, user.role, user.status || 'active'];

    return await executeQuerySingle(query, values);
};

const findByEmail = async (email) => {
    return await executeQuerySingle(`SELECT * FROM users WHERE email = $1`, [email]);
};

const getAllUsers = async () => {
    return await executeQueryMultiple(`SELECT id, name, email, role, status FROM users`);
};

const updateUser = async (id, updates) => {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.name) {
        fields.push(`name = $${paramCount}`);
        values.push(updates.name);
        paramCount++;
    }
    if (updates.role) {
        fields.push(`role = $${paramCount}`);
        values.push(updates.role);
        paramCount++;
    }
    if (updates.status) {
        fields.push(`status = $${paramCount}`);
        values.push(updates.status);
        paramCount++;
    }

    if (fields.length === 0) {
        throw new Error('No fields to update');
    }

    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id, name, email, role, status`;

    return await executeQuerySingle(query, values);
};

const deleteUser = async (id) => {
    return await executeQuerySingle(`DELETE FROM users WHERE id = $1 RETURNING id, name, email, role, status`, [id]);
};

export default {
    createUser,
    findByEmail,
    getAllUsers,
    updateUser,
    deleteUser
};
