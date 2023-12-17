//Importing the Controller
import {pool} from '../src/config/postgresConfig';
import {AttendanceCategory} from '../src/models/attendanceCategoryModel';
import {selectCategories, updateCategories} from "../src/services/attendanceCategoryService";

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

describe('Testing of the functions of the attendanceCategoryService', () => {
    const mockPoolQuery = pool.query as jest.Mock;

    beforeEach(() => {
        mockPoolQuery.mockClear();
    });

    it('updateCategories - should correctly update the categories', async () => {
        const testCategories = [
            new AttendanceCategory("Category 1", 1),
            new AttendanceCategory("Category 2", 2),
            new AttendanceCategory("Category 3", 3)
        ];

        await updateCategories(testCategories);

        expect(mockPoolQuery).toHaveBeenCalledWith('BEGIN');
        expect(mockPoolQuery).toHaveBeenCalledWith('DELETE FROM attendance_categories');
        for (const category of testCategories) {
            expect(mockPoolQuery).toHaveBeenCalledWith(
                'INSERT INTO attendance_categories(title, "order") VALUES($1, $2)',
                [category.title, category.order]
            );
        }
        expect(mockPoolQuery).toHaveBeenCalledWith('COMMIT');
    });

    it('updateCategories - should correctly update the categories (empty list)', async () => {
        const testCategories = [];

        await updateCategories(testCategories);

        expect(mockPoolQuery).toHaveBeenCalledWith('BEGIN');
        expect(mockPoolQuery).toHaveBeenCalledWith('DELETE FROM attendance_categories');
        for (const category of testCategories) {
            expect(mockPoolQuery).toHaveBeenCalledWith(
                'INSERT INTO attendance_categories(title, "order") VALUES($1, $2)',
                [category.title, category.order]
            );
        }
        expect(mockPoolQuery).toHaveBeenCalledWith('COMMIT');
    });

    it('updateCategories - should throw the Error updating Categories', async () => {
        const testCategories = [
            new AttendanceCategory("Category 1", 1),
            new AttendanceCategory("Category 2", 2),
            new AttendanceCategory("Category 3", 3)
        ];

        mockPoolQuery.mockRejectedValue(new Error("Error updating Categories"));

        let error;
        try {
            await updateCategories(testCategories);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

    it('selectCategories - should correctly return the attendance categories(empty)', async () => {
        mockPoolQuery.mockResolvedValueOnce({rows: []});

        const expectedCategories = [];

        const categories = await selectCategories();

        expect(categories).toEqual(expectedCategories);
        expect(mockPoolQuery).toHaveBeenCalledWith('SELECT * FROM attendance_categories');
    });

    it('selectCategories - should correctly return the attendance categories', async () => {
        mockPoolQuery.mockResolvedValueOnce({
            rows: [
                {title: "Category 1", order: 1},
                {title: "Category 2", order: 2}
            ]
        });

        const expectedCategories = [
            new AttendanceCategory('Category 1', 1),
            new AttendanceCategory('Category 2', 2)
        ];

        const categories = await selectCategories();

        expect(categories).toEqual(expectedCategories);
        expect(mockPoolQuery).toHaveBeenCalledWith('SELECT * FROM attendance_categories');
    });

    it('selectCategories - should throw an Error retrieving Attendance Categories', async () => {
        mockPoolQuery.mockRejectedValue(new Error("Error retrieving Attendance Categories"));

        let error;
        try {
            await selectCategories();
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual("SQL Error");
    });

});