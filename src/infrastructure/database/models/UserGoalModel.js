const { mongoose, model, Types } = require('mongoose');

const GOAL_TYPES  = ['daily_minutes', 'daily_pages', 'streak_days', 'total_books', 'custom'];
const GOAL_STATUS = ['active', 'completed', 'expired', 'paused'];

const UserGoalSchema = new mongoose.Schema({
  user_id: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
  type: {
    type: String,
    enum: GOAL_TYPES,
    required: true,
  },
  target_value: {
    type: Number,
    required: true, // Ej: 30 minutos, 20 páginas, etc.
  },
  start_date: {
    type: Date,
    default: new Date(),
  },
  end_date: {
    type: Date,
    required: false, // opcional para metas sin fin
  },
  status: {
    type: String,
    enum: GOAL_STATUS,
    default: 'active',
  },
  current_progress: {
    type: Number,
    default: 0, // minutos/páginas/lo que sea
  },
  last_updated: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    default: '',
  }
});

UserGoalSchema.index({ user_id: 1, type: 1, startDate: 1 }, { unique: false });

const UserGoalModel = model('UserGoal', UserGoalSchema);

module.exports = UserGoalModel;