import { Router } from "express";
const router = Router();
import dashboardController from "../controllers/dashboard.controller.js"
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

// Combined dashboard data endpoint - returns all dashboard data in one response
router.get('/data', authenticate, authorize('admin', 'analyst'), dashboardController.getDashboardData);

export default router;