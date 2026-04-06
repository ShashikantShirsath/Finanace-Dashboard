import dashboardService from '../services/dashboard.service.js';

const getDashboardData = async (req, res) => {
    try {
        const result = await dashboardService.getDashboardData();
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export default {
    getDashboardData
};