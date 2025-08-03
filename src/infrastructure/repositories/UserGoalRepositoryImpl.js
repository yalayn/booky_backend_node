const UserGoalModel = require('../database/models/UserGoalModel');
const UserGoalRepository = require('../../domain/repositories/UserGoalRepository');
class UserGoalRepositoryImpl extends UserGoalRepository {
    constructor() {
        super();
        this.userGoals = [];
    }

    async save(userGoal) {
        const newUserGoal = new UserGoalModel(userGoal);
        await newUserGoal.save();
        return newUserGoal;
    }

    async findByUserIdAndType(userId, type) {
        return UserGoalModel.findOne({ user_id: userId, type: type });
    }
}

module.exports = UserGoalRepositoryImpl;