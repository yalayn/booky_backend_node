const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const registerUserGoal = require("../../application/use_cases/user_goal/registerUserGoal");
const findUserGoalByUserType = require("../../application/use_cases/user_goal/findUserGoalByUserType");
const UserGoalRepositoryImpl = require('../repositories/UserGoalRepositoryImpl');

router.post('/register', authMiddleware, async (req, res) => {
    const userGoalRepository = new UserGoalRepositoryImpl();
    const { type, target_value, start_date, end_date, status, current_progress, description } = req.body;
    const userId = req.user._id;
    try {
        const userGoal = await registerUserGoal(userGoalRepository, userId, { type, targetValue: target_value, startDate: start_date, endDate: end_date, status, currentProgress: current_progress, description });
        res.status(201).json({success: true, data: userGoal});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/find_by_type/:type', authMiddleware, async (req, res) => {
    const userGoalRepository = new UserGoalRepositoryImpl();
    const { type } = req.params;
    const userId   = req.user._id;
    console.log(`Finding user goal for user ID: ${userId} and type: ${type}`);
    try {
        const userGoal = await findUserGoalByUserType(userGoalRepository, userId , type);
        res.status(200).json(userGoal);
    } catch (error) {
        res.status(404).json({ error: error.message, data: userId });
    }
});

module.exports = router;