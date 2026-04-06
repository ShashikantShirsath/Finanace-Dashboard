import recordRepo from '../repositories/record.repository.js';
import { createRecordSchema, updateRecordSchema } from '../utils/validation.js';

const create = async (data, userId) => {
    const { error, value } = createRecordSchema.validate(data);
    if (error) {
        throw new Error(error.details[0].message);
    }

    // Set default date if not provided
    if (!value.date) {
        value.date = new Date().toISOString().split('T')[0];
    }

    return await recordRepo.createRecord(value, userId);
};

const getAll = async (filters) => {
    // Set default pagination values
    const limit = Math.min(parseInt(filters.limit) || 10, 100); // Max 100 records per page
    const pageNumber = Math.max(parseInt(filters.pageNumber) || 1, 1); // Min page 1

    const queryFilters = {
        type: filters.type,
        category: filters.category,
        startDate: filters.startDate,
        endDate: filters.endDate,
        search: filters.search,
        limit,
        pageNumber
    };

    const [records, total] = await Promise.all([
        recordRepo.getRecords(queryFilters),
        recordRepo.getRecordsCount(queryFilters)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        records,
        pagination: {
            total,
            limit,
            pageNumber,
            totalPages,
            hasNext: pageNumber < totalPages,
            hasPrev: pageNumber > 1
        }
    };
};

const update = async (id, data) => {
    const { error, value } = updateRecordSchema.validate(data);
    if (error) {
        throw new Error(error.details[0].message);
    }

    return await recordRepo.updateRecord(id, value);
};

const remove = async (id) => {
  return await recordRepo.deleteRecord(id);
};

export default {
  create,
  getAll,
  update,
  remove
};