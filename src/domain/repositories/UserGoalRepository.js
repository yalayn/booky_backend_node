class UserGoalRepository {
  constructor() {
    this.userGoals = [];
  }

  async save(userGoal) {
    throw new Error('Not implemented');
  }

  async findByUserIdAndType(userId, type) {
    throw new Error('Not implemented');
  }
}

module.exports = UserGoalRepository;
