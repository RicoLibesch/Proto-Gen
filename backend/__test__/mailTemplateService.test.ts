//mocking the  Service
import {pool} from "../src/config/postgresConfig";
import {selectTemplate, updateTemplate} from "../src/services/mailTemplateService";

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

    it('updateTemplate - update the Templates', async () => {
        mockPoolQuery.mockResolvedValue({rows: [{status: 1}]});

        await updateTemplate("testprot", "lorem ipsum");

        expect(mockPoolQuery).toHaveBeenCalledWith('UPDATE mail_templates SET value = $1 WHERE type = $2', ["lorem ipsum", "testprot"]);
    });

    it('updateTemplate - should throw SQL Error while updating rows 0', async () => {
        mockPoolQuery.mockResolvedValue({ rowCount: 0 });

        await expect(updateTemplate("testprot", "lorem ipsum")).rejects.toThrow("SQL Error");

        expect(mockPoolQuery).toHaveBeenCalledWith('UPDATE mail_templates SET value = $1 WHERE type = $2', ["lorem ipsum", "testprot"]);
    });

    it('updateTemplate - should throw SQL Error', async () => {

        mockPoolQuery.mockRejectedValue(new Error("SQL Error"));

        let error;
        try {
            await updateTemplate("testprot", "lorem ipsum");
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('selectTemplate - should throw SQL Error while updating', async () => {
        mockPoolQuery.mockResolvedValue({rows: [{status: 1}]});

        await selectTemplate("testprot");

        expect(mockPoolQuery).toHaveBeenCalledWith('SELECT value FROM mail_templates WHERE type = $1', ["testprot"]);
    });

    it('selectTemplate - should throw SQL Error', async () => {

        mockPoolQuery.mockRejectedValue(new Error("SQL Error"));

        let error;
        try {
            await selectTemplate("testprot");
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

});