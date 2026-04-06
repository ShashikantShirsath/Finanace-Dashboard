import userRepo from '../repositories/user.repository.js';
import { registerSchema } from '../utils/validation.js';

const getAllUsers = async () => {
    return await userRepo.getAllUsers();
};

const updateUser = async (id, updates) => {
    // Validate role and status if provided
    if (updates.role && !['viewer', 'analyst', 'admin'].includes(updates.role)) {
        throw new Error('Invalid role. Must be viewer, analyst, or admin');
    }
    if (updates.status && !['active', 'inactive'].includes(updates.status)) {
        throw new Error('Invalid status. Must be active or inactive');
    }

    return await userRepo.updateUser(id, updates);
};

const deleteUser = async (id) => {
    return await userRepo.deleteUser(id);
};

export default {
    getAllUsers,
    updateUser,
    deleteUser
};