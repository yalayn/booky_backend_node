const { registerUser } = require('../../../../application/use_cases/user/registerUser');

describe('registerUser use case', () => {
    let userRepository;

    beforeEach(() => {
        userRepository = {
            save: jest.fn(async (user) => ({ ...user })),
            findByUsername: jest.fn(async (username) => null) // Simulate no existing user
        };
    });

    it('should register a user with valid data', async () => {
        const userData = { name: 'John Doe', username: 'johndoe', password: 'secret' };
        const result = await registerUser(userRepository, userData);

        expect(userRepository.save).toHaveBeenCalledTimes(1);
        expect(result.name).toBe(userData.name);
        expect(result.username).toBe(userData.username);
        expect(result.password).toBe(userData.password);
    });

    it('should throw if userRepository.save fails', async () => {
        userRepository.save = jest.fn(() => { throw new Error('DB error'); });
        const userData = { name: 'Jane', username: 'jane', password: 'pw' };

        await expect(registerUser(userRepository, userData)).rejects.toThrow('DB error');
    });

    it('should pass all user fields to userRepository.save', async () => {
        const userData = { name: 'Test', username: 'testuser', password: 'pw' };
        await registerUser(userRepository, userData);

        const savedUser = userRepository.save.mock.calls[0][0];
        expect(savedUser).toMatchObject({
            name: userData.name,
            username: userData.username,
            password: userData.password
        });
        expect(savedUser).toHaveProperty('name');
    });
});