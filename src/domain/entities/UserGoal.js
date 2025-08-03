class UserGoal {
  constructor({ userId, type, targetValue, startDate = new Date(), endDate = null, status = 'active', currentProgress = 0, lastUpdated = new Date(), description = '' }) {
    this.user_id          = userId;
    this.type             = type;
    this.target_value     = targetValue;
    this.start_date       = startDate;
    this.end_date         = endDate;
    this.status           = status;
    this.current_progress = currentProgress;
    this.last_updated     = lastUpdated;
    this.description      = description;
  }
}

module.exports = UserGoal;