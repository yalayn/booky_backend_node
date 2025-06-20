const User = require('../../../domain/entities/User');

describe('User Entity', () => {
    it('should create a User instance with given properties', () => {
        const user = new User('mongoid123', 1, 'John Doe', 'johndoe', 'secret');
        expect(user._id).toBe('mongoid123');
        expect(user.id).toBe(1);
        expect(user.name).toBe('John Doe');
        expect(user.username).toBe('johndoe');
        expect(user.password).toBe('secret');
    });

    it('should allow different types for _id and id', () => {
        const user = new User(123, 'abc', 'Jane', 'janeuser', 'pass');
        expect(user._id).toBe(123);
        expect(user.id).toBe('abc');
    });

    it('should set undefined for missing parameters', () => {
        const user = new User();
        expect(user._id).toBeUndefined();
        expect(user.id).toBeUndefined();
        expect(user.name).toBeUndefined();
        expect(user.username).toBeUndefined();
        expect(user.password).toBeUndefined();
    });

    it('should assign falsy values correctly', () => {
        const user = new User(0, 0, '', '', '');
        expect(user._id).toBe(0);
        expect(user.id).toBe(0);
        expect(user.name).toBe('');
        expect(user.username).toBe('');
        expect(user.password).toBe('');
    });
});