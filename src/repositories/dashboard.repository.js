import { executeQuerySingle, executeQueryMultiple } from '../utils/db.js';

const getTotals = async () => {
    const query = `
    SELECT 
      SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS total_income,
      SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS total_expense
    FROM records;
  `;

    return await executeQuerySingle(query);
};

const getCategoryTotals = async () => {
    const query = `
    SELECT category, SUM(amount) as total
    FROM records
    GROUP BY category
    ORDER BY total DESC;
  `;

    return await executeQueryMultiple(query);
};

const getMonthlyTrends = async () => {
    const query = `
    SELECT 
      DATE_TRUNC('month', date) AS month,
      SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS income,
      SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS expense
    FROM records
    GROUP BY month
    ORDER BY month;
  `;

    return await executeQueryMultiple(query);
};

const getRecentActivity = async () => {
    const query = `
    SELECT * FROM records
    ORDER BY created_at DESC
    LIMIT 5;
  `;

    return await executeQueryMultiple(query);
};

export default {
    getTotals,
    getCategoryTotals,
    getMonthlyTrends,
    getRecentActivity
}