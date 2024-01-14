import {pool} from '../src/config/postgresConfig';
import {User} from '../src/models/userModel';
import {insertUser, selectAllUsers, userExists} from "../src/services/userService";

//mocking the Service
jest.mock('../src/services/userRoleService', () => ({
    insertPermission: jest.fn(), hasRole: jest.fn()
}));
jest.mock('pg', () => {
    const mPool = {
        query: jest.fn(), on: jest.fn(), connect: jest.fn(), end: jest.fn(),
    };
    return {Pool: jest.fn(() => mPool)};
});

describe('Testing of the functions of the userRoleService', () => {
    const mockPoolQuery = pool.query as jest.Mock;

    beforeEach(() => {
        mockPoolQuery.mockClear();
    });

    it('userExists - should return true', async () => {
        mockPoolQuery.mockResolvedValue({rows: [{id: 1}]});

        const res = await userExists("1");

        expect(res).toBe(true);
        expect(mockPoolQuery).toHaveBeenCalledWith('SELECT id FROM users WHERE id = $1', ["1"])
    });

    it('userExists - should return false', async () => {
        mockPoolQuery.mockResolvedValue({rows: []});

        const res = await userExists("1");

        expect(res).toBe(false);
        expect(mockPoolQuery).toHaveBeenCalledWith('SELECT id FROM users WHERE id = $1', ["1"])
    });

    it('userExists - should throw SQL Error', async () => {
        mockPoolQuery.mockRejectedValue(new Error("SQL Error"));

        let error;
        try {
            await userExists("1");
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('insertUser - should insert permission when it is the first user', async () => {
        const user = new User('1', 'JO', 'Han', 'JoHan', 'JoHan@was.de');

        mockPoolQuery.mockResolvedValueOnce({rows: []});

        mockPoolQuery.mockResolvedValueOnce({});

        await insertUser(user);
        expect(mockPoolQuery).toHaveBeenCalledWith('INSERT INTO users(id, first_name, last_name, display_name, mail) VALUES ($1, $2, $3, $4, $5)', ["1", "JO", "Han", "JoHan", "JoHan@was.de"]);
        expect(mockPoolQuery).toHaveBeenCalledWith('SELECT * FROM users LIMIT 1');
    });


    it('insertUser - should throw SQL Error', async () => {
        const user = new User('1', 'JO', 'Han', 'JoHan', 'JoHan@was.de');
        mockPoolQuery.mockRejectedValue(new Error("SQL Error"));

        let error;
        try {
            await insertUser(user);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('selectAllUsers - should throw SQL Error', async () => {
        mockPoolQuery.mockRejectedValue(new Error("SQL Error"));

        let error;
        try {
            await selectAllUsers(1, 1, "1", 1);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('selectAllUsers - should return a user when no roleId is provided', async () => {
        const mockUserData = {
            rows: [{
                id: '1', first_name: 'Jo', last_name: 'Han', display_name: 'JoHan', mail: 'JoHan@was.de',
            },],
        };

        mockPoolQuery.mockResolvedValueOnce(mockUserData);

        const res = await selectAllUsers(1, 10, "1", null);

        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE LOWER(id) LIKE $1 ORDER BY id DESC OFFSET $2 LIMIT $3', [`%${'1'}%`, (1 - 1) * 10, 10]);
        expect(res[0].id).toBe('1');
        expect(res[0].firstName).toBe('Jo');
        expect(res[0].lastName).toBe('Han');
    });

});