import {pool} from '../src/config/postgresConfig';
import {User} from '../src/models/userModel';
import {deletePermission, hasRole, insertPermission, selectPermissions} from "../src/services/userRoleService";

//mocking the Service
jest.mock('pg', () => {
    const mPool = {
        query: jest.fn(),
        on: jest.fn(),
        connect: jest.fn(),
        end: jest.fn(),
    };
    return {Pool: jest.fn(() => mPool)};
});

describe('Testing of the functions of the userRoleService', () => {
    const mockPoolQuery = pool.query as jest.Mock;

    beforeEach(() => {
        mockPoolQuery.mockClear();
    });

    it('hasRole - should return true', async () => {
        mockPoolQuery.mockResolvedValue({rows: [{status: 0}]});


        const res = await hasRole("1", 1);

        expect(res).toBe(true);
    });

    it('hasRole - should return false', async () => {
        mockPoolQuery.mockResolvedValue({rows: []});


        const res = await hasRole("1", 1);

        expect(res).toBe(false);
    });

    it('hasRole - should throw SQL Error', async () => {
        mockPoolQuery.mockRejectedValue(new Error("SQL Error"));

        let error;
        try {
            await hasRole("1", 1);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('selectPermissions - should throw SQL Error', async () => {
        const user = new User('1', 'JO', 'Han', 'JoHan', 'JoHan@was.de');

        mockPoolQuery.mockRejectedValue(new Error("SQL Error"));

        let error;
        try {
            await selectPermissions(user);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('selectPermissions - user with no permissions', async () => {
        const user = new User('1', 'JO', 'Han', 'JoHan', 'JoHan@was.de');
        mockPoolQuery.mockResolvedValue({rows: []});

        await selectPermissions(user);

        expect(user.isAdmin).toBe(false);
        expect(user.isRecorder).toBe(false);
    });

    it('selectPermissions - user with Admin permissions', async () => {
        const user = new User('1', 'JO', 'Han', 'JoHan', 'JoHan@was.de');
        mockPoolQuery.mockResolvedValue({rows: [{role_id: 1}]});

        await selectPermissions(user);

        expect(user.isAdmin).toBe(true);
        expect(user.isRecorder).toBe(false);
    });

    it('selectPermissions - user with recoder permissions', async () => {
        const user = new User('1', 'JO', 'Han', 'JoHan', 'JoHan@was.de');
        mockPoolQuery.mockResolvedValue({rows: [{role_id: 2}]});

        await selectPermissions(user);

        expect(user.isAdmin).toBe(false);
        expect(user.isRecorder).toBe(true);
    });

    it('selectPermissions - user with all permissions', async () => {
        const user = new User('1', 'JO', 'Han', 'JoHan', 'JoHan@was.de');
        mockPoolQuery.mockResolvedValue({rows: [{role_id: 1}, {role_id: 2}]});

        await selectPermissions(user);

        expect(user.isAdmin).toBe(true);
        expect(user.isRecorder).toBe(true);
    });

    it('deletePermission - should delete the Permissions', async () => {
        mockPoolQuery.mockResolvedValue({rows: [{role_id: 1}]});


        await deletePermission("1", 1);


        expect(mockPoolQuery).toHaveBeenCalledWith('DELETE FROM user_roles WHERE user_id  = $1 AND role_id =$2', ["1", 1])
    });

    it('deletePermission - should throw the error No role rowcount 0', async () => {
       mockPoolQuery.mockResolvedValue({ rowCount: 0 });

        await expect(deletePermission("1", 1)).rejects.toThrow("No role");

        expect(mockPoolQuery).toHaveBeenCalledWith('DELETE FROM user_roles WHERE user_id  = $1 AND role_id =$2', ["1", 1]);
    });

    it('deletePermission - should throw No role', async () => {
        mockPoolQuery.mockRejectedValue(new Error("No role"));

        let error;
        try {
            await deletePermission("1", 1);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("No role");
    });

    it('deletePermission - should throw SQL Error', async () => {
        mockPoolQuery.mockRejectedValue(new Error("SQL Error"));

        let error;
        try {
            await deletePermission("1", 1);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('insertPermission - insert Permission', async () => {
        mockPoolQuery.mockResolvedValue(undefined);

            await insertPermission("1", 1);

        expect(mockPoolQuery).toHaveBeenCalledWith('INSERT INTO user_roles (user_id, role_id) VALUES($1, $2)', ["1", 1]);
    });

    it('insertPermission - should throw duplicate key', async () => {
        mockPoolQuery.mockRejectedValue(new Error("duplicate key value violates unique constraint \"user_roles_pkey\""));

        let error;
        try {
            await insertPermission("1", 1);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("duplicate key");
    });

    it('insertPermission - should throw SQL Error', async () => {
        mockPoolQuery.mockRejectedValue(new Error("SQL Error"));

        let error;
        try {
            await insertPermission("1", 1);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

});