import {pool} from "../src/config/postgresConfig";
require("dotenv").config();
import ActiveDirectory from 'activedirectory2';
import { User } from '../src/models/userModel';
import { ldapConfig } from '../src/config/ldapConfig';
import {authenticateUser} from "../src/services/ldapService";

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

    it('selectAllUsers - should throw SQL Error', async () => {
        mockPoolQuery.mockRejectedValue(new Error('LDAP Auth failed'));

        let error;
        try {
            await authenticateUser("testname", "testpassword");
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual('LDAP Auth failed');
    });

});

