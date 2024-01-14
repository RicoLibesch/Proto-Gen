//mocking the  Service
import {pool} from "../src/config/postgresConfig";
import {addAttendee, removeAttendees, selectAttendees} from "../src/services/sessionAttendanceService";

jest.mock('pg', () => {
    const mPool = {
        query: jest.fn(),
        on: jest.fn(),
        connect: jest.fn(),
        end: jest.fn(),
    };
    return {Pool: jest.fn(() => mPool)};
});

describe('Testing of the functions of the mailTemplateService', () => {
    const mockPoolQuery = pool.query as jest.Mock;

    beforeEach(() => {
        mockPoolQuery.mockClear();
    });

    it('removeAttendees - should removed the attendees', async () => {
        mockPoolQuery.mockImplementation(undefined);

        await expect(removeAttendees()).resolves.toBeUndefined();

        expect(pool.query).toHaveBeenCalledWith('DELETE FROM session_attendees');
    });

    it('removeAttendees - should throw SQL Error', async () => {
        mockPoolQuery.mockRejectedValue(new Error("SQL Error"));

        let error;
        try {
            await removeAttendees();
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('addAttendee - should add the attendees', async () => {
        mockPoolQuery.mockImplementation(undefined);

        await expect(addAttendee("test")).resolves.toBeUndefined();

        expect(mockPoolQuery).toHaveBeenCalledWith('INSERT INTO session_attendees(attendee) VALUES ($1)', ["test"]);
    });

    it('addAttendee - should throw SQL Error', async () => {
        mockPoolQuery.mockRejectedValue(new Error("SQL Error"));

        let error;
        try {
            await addAttendee("testattendee");
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('selectAttendees - should select the attendees empty', async () => {
        const mockAttendeesData = [];

        mockPoolQuery.mockResolvedValue({ rows: mockAttendeesData });

        const attendees = await selectAttendees();

        expect(attendees).toEqual(mockAttendeesData.map(row => row.attendee));
        expect(attendees).toHaveLength(mockAttendeesData.length);
    });

    it('selectAttendees - should select the attendees data', async () => {
        const mockAttendeesData = [
            { attendee: 'attendee1' },
            { attendee: 'attendee2' }
        ];

        mockPoolQuery.mockResolvedValue({ rows: mockAttendeesData });

        const attendees = await selectAttendees();

        expect(attendees).toEqual(mockAttendeesData.map(row => row.attendee));
        expect(attendees).toHaveLength(mockAttendeesData.length);
    });

    it('selectAttendees - should throw SQL Error', async () => {
        mockPoolQuery.mockRejectedValue(new Error("SQL Error"));

        let error;
        try {
            await selectAttendees();
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

});