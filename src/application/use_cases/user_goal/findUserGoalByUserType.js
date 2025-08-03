const findUserGoalByUserType = async (userGoalRepository, userId, type) => {
    if (!userId || !type) {
        throw new Error('User ID and user type are required');
    }

    const userGoal = await userGoalRepository.findByUserIdAndType(userId, type);
    if (!userGoal) {
        throw new UserNotFoundError('User goal not found for the specified user type');
    }
    return userGoal;
}

module.exports = findUserGoalByUserType;