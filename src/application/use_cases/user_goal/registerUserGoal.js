const UserGoal = require("../../../domain/entities/UserGoal");

const registerUserGoal = async (userGoalRepository, userId, goal) => {
    if (!userId || !goal) {
        throw new Error('User ID and goal are required');
    }

    // Validate goal properties
    const { type, targetValue, startDate, endDate, status, currentProgress, description } = goal;
    if (!type || !targetValue) {
        throw new Error('Goal type and target value are required');
    }

    const userGoal = new UserGoal({ userId, type, targetValue, startDate, endDate, status, currentProgress, description });
    return await userGoalRepository.save(userGoal);
}

module.exports = registerUserGoal;