const registerUserGoal = require('../../../../application/use_cases/user_goal/registerUserGoal');
const UserGoalModel    = require('../../../../infrastructure/database/models/UserGoalModel');
const UserGoal         = require('../../../../domain/entities/UserGoal');
const mongoose         = require('mongoose');

// Mock UserGoal globally for the test file
jest.mock('../../../../infrastructure/database/models/UserGoalModel');

describe('registerUserGoal', () => {
    let userGoalRepository;

    beforeEach(() => {
        userGoalRepository = {
            save: jest.fn().mockResolvedValue('saved-goal')
        };
        jest.clearAllMocks();
    });

    it('should throw error if userId is missing', async () => {
        await expect(registerUserGoal(userGoalRepository, null, { type: 'pages', targetValue: 100 }))
            .rejects
            .toThrow('User ID and goal are required');
    });

    it('should throw error if goal is missing', async () => {
        await expect(registerUserGoal(userGoalRepository, 'user1', null))
            .rejects
            .toThrow('User ID and goal are required');
    });

    it('should throw error if goal type is missing', async () => {
        await expect(registerUserGoal(userGoalRepository, 'user1', { targetValue: 100 }))
            .rejects
            .toThrow('Goal type and target value are required');
    });

    it('should throw error if goal targetValue is missing', async () => {
        await expect(registerUserGoal(userGoalRepository, 'user1', { type: 'pages' }))
            .rejects
            .toThrow('Goal type and target value are required');
    });

    it('should create a userGoal with correct fields and call repository.save', async () => {
        const goal = {
            type           : 'pages',
            targetValue    : 100,
            startDate      : '2024-06-01',
            endDate        : '2024-07-01',
            status         : 'active',
            currentProgress: 10,
            description    : 'Read 100 pages'
        };
        const userId = new mongoose.Types.ObjectId();
        const result = await registerUserGoal(userGoalRepository, userId, goal);

        expect(userGoalRepository.save).toHaveBeenCalledTimes(1);
        const savedGoal = userGoalRepository.save.mock.calls[0][0];

        expect(savedGoal).toMatchObject({
            user_id         : userId,
            type            : goal.type,
            target_value    : goal.targetValue,
            start_date      : goal.startDate,
            end_date        : goal.endDate,
            status          : goal.status,
            current_progress: goal.currentProgress,
            description     : goal.description,
        });

        expect(savedGoal.user_id).toEqual(userId);
        expect(result).toBe('saved-goal');
    });

    it('should pass undefined for optional fields if not provided', async () => {
        const goal = { type: 'books', targetValue: 5 };
        const userId = new mongoose.Types.ObjectId();
        await registerUserGoal(userGoalRepository, userId, goal);
        const savedGoal = userGoalRepository.save.mock.calls[0][0];
        
        const today = new Date();
        const savedStartDate = new Date(savedGoal.start_date);
        const savedlastUpdated = new Date(savedGoal.last_updated);
        expect(savedStartDate.getFullYear()).toBe(today.getFullYear());
        expect(savedGoal.end_date).toBeNull();
        expect(savedGoal.status).toBe('active');
        expect(savedGoal.current_progress).toBe(0);
        expect(savedlastUpdated.getFullYear()).toBe(today.getFullYear());
        expect(savedGoal.description).toBe('');
    });
});