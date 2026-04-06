import dashboardRepo from '../repositories/dashboard.repository.js';

const getDashboardData = async () => {
    const [totals, categoryTotals, trends, recentActivity] = await Promise.all([
        dashboardRepo.getTotals(),
        dashboardRepo.getCategoryTotals(),
        dashboardRepo.getMonthlyTrends(),
        dashboardRepo.getRecentActivity()
    ]);

    const totalIncome = Number(totals.total_income) || 0;
    const totalExpense = Number(totals.total_expense) || 0;

    return {
        summary: {
            totalIncome,
            totalExpense,
            netBalance: totalIncome - totalExpense
        },
        categoryWiseTotals: categoryTotals,
        trends: trends,
        recentActivity: recentActivity
    };
};

export default {
    getDashboardData
};