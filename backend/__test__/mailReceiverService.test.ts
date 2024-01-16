//Importing the Controller
import {selectReceiver, updateReceiver} from "../src/services/mailReceiverService";
import {pool} from "../src/config/postgresConfig";

//mocking the  Service
jest.mock('pg', () => {
    const mPool = {
        query: jest.fn(),
        on: jest.fn(),
        connect: jest.fn(),
        end: jest.fn(),
    };
    return {Pool: jest.fn(() => mPool)};
});

describe('Testing of the functions of the mailReceiverService', () => {
    const mockPoolQuery = pool.query as jest.Mock;

    beforeEach(() => {
        mockPoolQuery.mockClear();
    });

    it('updateReceiver - should correctly update the receiver (no receiver)', async () => {
        const testReceiver = [];

        mockPoolQuery.mockResolvedValue(testReceiver);
        await updateReceiver(testReceiver);

        expect(mockPoolQuery).toHaveBeenCalledWith('BEGIN');
        expect(mockPoolQuery).toHaveBeenCalledWith('DELETE FROM mail_receiver');
        for (const mail of testReceiver) {
            expect(mockPoolQuery).toHaveBeenCalledWith('INSERT INTO mail_receiver(mail) VALUES($1)', [mail]);
        }
        expect(mockPoolQuery).toHaveBeenCalledWith('COMMIT');
    })

    it('updateReceiver - should correctly update the receiver', async () => {
        const testReceiver = ["mail13@irwas.de", "mail15@irwas.de"];

        mockPoolQuery.mockResolvedValue(testReceiver);
        await updateReceiver(testReceiver);

        expect(mockPoolQuery).toHaveBeenCalledWith('BEGIN');
        expect(mockPoolQuery).toHaveBeenCalledWith('DELETE FROM mail_receiver');
        for (const mail of testReceiver) {
            expect(mockPoolQuery).toHaveBeenCalledWith('INSERT INTO mail_receiver(mail) VALUES($1)', [mail]);
        }
        expect(mockPoolQuery).toHaveBeenCalledWith('COMMIT');
    });

    it('updateReceiver - should throw an error because an error occurred', async () => {
        const testReceiver = ["mail13@irwas.de", "mail15@irwas.de"];

        mockPoolQuery.mockRejectedValue(new Error("Error updating Mail"));

        let error;
        try {
            await updateReceiver(testReceiver);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('selectReceiver - should correctly select the receiver (no receiver)', async () => {
        const testReceiver = [];

        mockPoolQuery.mockResolvedValue({rows: []});
        const res = await selectReceiver();

        expect(res).toEqual(testReceiver);
        expect(mockPoolQuery).toHaveBeenCalledWith('SELECT mail FROM mail_receiver');
    });

    it('selectReceiver - should correctly select the receiver', async () => {
        const testReceiver = [
            {mail: "mail13@irwas.de"},
            {mail: "mail15@irwas.de"}
        ];

        mockPoolQuery.mockResolvedValue({rows: testReceiver});
        const res = await selectReceiver();

        const expreceivers = testReceiver.map(f => f.mail);

        expect(res).toEqual(expreceivers);
        expect(mockPoolQuery).toHaveBeenCalledWith('SELECT mail FROM mail_receiver');
    });

    it('selectReceiver - should throw an error because an error occurred while retrieving the mail Receivers', async () => {
        mockPoolQuery.mockRejectedValue(new Error("Error retrieving Mail Receivers"));

        let error;
        try {
            await selectReceiver();
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

});