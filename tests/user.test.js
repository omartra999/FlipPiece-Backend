const { User } = require('../models');
const userService = require('../services/user.service');
describe('User Service', () => {
    beforeAll(async () => {
        await User.sync({ force: true });
        await User.create({
            firebaseUid: 'test-uid',
            email: 'test@example.com',
            username: 'testuser1',
            firstName: 'Test',
            lastName: 'User1',
            isAdmin: false
        });
    });

    test('findOrCreateByFirebaseUid creates a new user if not exists', async () => {
        const userData = { uid: 'unique-uid', email: 'unique@example.com', displayName: 'TestUser' };
        const { user, created } = await userService.findOrCreateByFirebaseUid(userData);
        expect(user.firebaseUid).toBe('unique-uid');
        expect(user.email).toBe('unique@example.com');
        expect(created).toBe(true);
    });

    test('findOrCreateByFirebaseUid finds existing user', async () => {
        const userData = { uid: 'test-uid', email: 'test@example.com', displayName: 'TestUser' };
        const { user, created } = await userService.findOrCreateByFirebaseUid(userData);
        expect(user.firebaseUid).toBe('test-uid');
        expect(created).toBe(false);
    });

    test('updateUserProfile updates user profile', async () => {
        const profileData = { firstName: 'UpdatedFirst', lastName: 'UpdatedLast' };
        const updatedUser = await userService.updateUserProfile('test-uid', profileData);
        expect(updatedUser.firstName).toBe('UpdatedFirst');
        expect(updatedUser.lastName).toBe('UpdatedLast');
    });

    test('deleteUserAccount deletes user account', async () => {
        await userService.deleteUserAccount('test-uid');
        const deletedUser = await User.findOne({ where: { firebaseUid: 'test-uid' } });
        expect(deletedUser).toBeNull();
    });

    test('getAllUsers returns all users', async () => {
        // Re-create a user to ensure the table is not empty
        await User.create({
            firebaseUid: 'another-uid',
            email: 'another@example.com',
            username: 'testuser2',
            firstName: 'Another',
            lastName: 'User',
            isAdmin: false
        });
        const users = await userService.getAllUsers();
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);
    });

    afterAll(async () => {
        await User.destroy({ where: {} });
    });
});