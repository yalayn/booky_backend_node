const UserGoalModel = require('../database/models/UserGoalModel');
const UserGoalRepository = require('../../domain/repositories/UserGoalRepository');
class UserGoalRepositoryImpl extends UserGoalRepository {
    constructor() {
        super();
        this.userGoals = [];
    }

    async save(userGoal) {
        let goal = await UserGoalModel.findOne({ user_id: userGoal.user_id, type: userGoal.type });
        if (goal) {
            goal.target_value     = userGoal.target_value;
            goal.start_date       = userGoal.start_date;
            goal.end_date         = userGoal.end_date;
            goal.status           = userGoal.status;
            goal.current_progress = userGoal.current_progress;
            goal.last_updated     = new Date();
            goal.description      = userGoal.description;
        } else {
            goal = new UserGoalModel(userGoal);
        }
        return await goal.save();
    }

    async findByUserIdAndType(userId, type) {
        return UserGoalModel.findOne({ user_id: userId, type: type });
    }
}

module.exports = UserGoalRepositoryImpl;