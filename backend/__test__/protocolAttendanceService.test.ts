//Importing the Controller
import {pool} from "../src/config/postgresConfig";
import {insertProtocolAttendance, selectProtocolAttendance} from "../src/services/protocolAttendanceService";
import {AttendanceList} from "../src/models/attendanceListModel";

//mocking the  Service
jest.mock('pg', () => {
    const mPool = {
        query: jest.fn(),
        on: jest.fn(),
        connect: jest.fn(),
    };
    return {Pool: jest.fn(() => mPool)};
});

describe('Testing of the functions of the protocolAttendanceService', () => {
    const mockPoolQuery = pool.query as jest.Mock;

    beforeEach(() => {
        mockPoolQuery.mockClear();
    });

    it('insertProtocolAttendance - should insert attendance data correctly', async () => {

        mockPoolQuery.mockResolvedValue({});

        mockPoolQuery('INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)', [1, 'user1', 'role1']);
        mockPoolQuery('INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)', [1, 'user2', 'role1']);
        mockPoolQuery('INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)', [1, 'user3', 'role2']);


        expect(mockPoolQuery).toHaveBeenCalledWith(
            'INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)',
            [1, 'user1', 'role1']
        );
        expect(mockPoolQuery).toHaveBeenCalledWith(
            'INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)',
            [1, 'user2', 'role1']
        );
        expect(mockPoolQuery).toHaveBeenCalledWith(
            'INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)',
            [1, 'user3', 'role2']
        );

    });

    it('insertProtocolAttendance - should handle errors correctly', async () => {
        mockPoolQuery.mockImplementation(() => {
            throw new Error("SQL Error");
        });

        const mockedAttendanceList = {
            roles: {
                'role1': ['user1', 'user2'],
                'role2': ['user3']
            }
        };

        let error;
        try {

            mockPoolQuery.mockResolvedValue({});
            await insertProtocolAttendance(1, mockedAttendanceList);

            expect(mockPoolQuery).toHaveBeenCalledTimes(3);
            expect(mockPoolQuery).toHaveBeenCalledWith(
                'INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)',
                [1, 'user1', 'role1']
            );
            expect(mockPoolQuery).toHaveBeenCalledWith(
                'INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)',
                [1, 'user2', 'role1']
            );
            expect(mockPoolQuery).toHaveBeenCalledWith(
                'INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)',
                [1, 'user3', 'role2']
            );

        } catch (e) {
            error = e;
        }
        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");

    });

    it('selectProtocolAttendance - should send attendance data correctly', async () => {
        const attendanceRows1 = [
            {role_name: 'role1', user_name: 'user1'},
            {role_name: 'role1', user_name: 'user2'},
            {role_name: 'role2', user_name: 'user3'}
        ];

        const attendanceRows2 = [
            {role_name: "role1", user_name: "Blaubarschbube"},
            {role_name: "role1", user_name: "Thaddäus"},
            {role_name: "role1", user_name: "Karen"},
            {role_name: "role2", user_name: "Pearl"},
            {role_name: "role2", user_name: "SpongeBob"},
            {role_name: "role2", user_name: "Gary"},
            {role_name: "role3", user_name: "Sandy"},
            {role_name: "role3", user_name: "Plankton"},
            {role_name: "role3", user_name: "Patrick"},
            {role_name: "role3", user_name: "Mr. Krabs"}
        ];

        mockPoolQuery.mockResolvedValueOnce({rows: attendanceRows2});
        mockPoolQuery.mockResolvedValueOnce({rows: attendanceRows1});


        const res2 = await selectProtocolAttendance(2);
        expect(res2).toBeInstanceOf(AttendanceList);
        expect(res2.roles['role1']).toEqual(["Blaubarschbube", "Thaddäus", "Karen"]);
        expect(res2.roles['role2']).toEqual(["Pearl", "SpongeBob", "Gary"]);
        expect(res2.roles['role3']).toEqual(["Sandy", "Plankton", "Patrick", "Mr. Krabs"]);

        expect(mockPoolQuery).toHaveBeenNthCalledWith(1, "SELECT * FROM protocol_attendances WHERE protocol_id = $1", [2]);
    });

    it('selectProtocolAttendance - should handle errors correctly SQL Error', async () => {

        mockPoolQuery.mockImplementation(() => {
            throw new Error("SQL Error");
        });

        try {
            await selectProtocolAttendance(1);
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toEqual("SQL Error");
        }
    });

    it('selectProtocolAttendance - should handle errors correctly SQL Error long', async () => {
        mockPoolQuery.mockImplementation(() => {
            throw new Error("SQL Error");
        });

        let error;
        try {
            await selectProtocolAttendance(1);
        } catch (e) {
            error = e;
        }
        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

});