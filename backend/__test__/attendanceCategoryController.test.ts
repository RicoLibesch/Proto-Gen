//Importing the Controller
import {Request, Response} from 'express';
import * as attendanceCategoryController from "../src/controllers/attendanceCategoryController";
import {AttendanceCategory} from '../src/models/attendanceCategoryModel';
import {selectCategories, updateCategories} from '../src/services/attendanceCategoryService';

//mocking the Service
jest.mock("../src/services/attendanceCategoryService");

describe('Testing of the functions of the attendanceCategoryController', () => {

    it('getCategories - should return 200 when categories returned succesfully(empty req)', async () => {
        const req = {} as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await attendanceCategoryController.getCategories(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('getCategories- should return 200 when categories returned successfully(valid attendance list)', async () => {
        const mockSelectCategories = selectCategories as jest.Mock;

        const req = {
            body: [
                new AttendanceCategory('Category 1', 1),
                new AttendanceCategory('Category 2', 2)
            ]
        } as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        mockSelectCategories.mockResolvedValue(req)
        const val = await selectCategories();


        await attendanceCategoryController.getCategories(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(val).toEqual(req);
    });

    it('getCategories - should send status 500 when an error got thrown', async () => {
        const mockSelectCategories = selectCategories as jest.Mock;

        mockSelectCategories.mockImplementation(() => {
            throw new Error('Error retrieving Attendance Categories');
        });

        const req = {
            body: [
                new AttendanceCategory('Category 1', 1),
                new AttendanceCategory('Category 2', 2)
            ]
        } as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        await attendanceCategoryController.getCategories(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

    it('editCategories - should return 400 when duplicates are in the list(title)', async () => {
        const mockUpdateCategories = updateCategories as jest.Mock;

        mockUpdateCategories.mockImplementation(() => {
            throw new Error("The request contains duplicate orders. Duplicate values are not allowed.");
        });

        const req = {
            body: [
                new AttendanceCategory('Category 1', 1),
                new AttendanceCategory('Category 1', 2)
            ]
        } as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;


        await attendanceCategoryController.editCategories(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "The request contains duplicate entries. Duplicate values are not allowed."});
    });

    it('editCategories - should return 400 when duplicates are in the list(order)', async () => {
        const mockUpdateCategories = updateCategories as jest.Mock;

        mockUpdateCategories.mockImplementation(() => {
            throw new Error("The request contains duplicate orders. Duplicate values are not allowed.");
        });

        const req = {
            body: [
                new AttendanceCategory('Category 1', 1),
                new AttendanceCategory('Category 2', 1)
            ]
        } as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;


        await attendanceCategoryController.editCategories(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "The request contains duplicate entries. Duplicate values are not allowed."});
    });

    it('editCategories - should return 200 and update the categories', async () => {
        const mockUpdateCategories = updateCategories as jest.Mock;
        const req = {
            body: [
                new AttendanceCategory('Category 1', 1),
                new AttendanceCategory('Category 2', 2)
            ]
        } as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;

        mockUpdateCategories.mockResolvedValue(req)

        await attendanceCategoryController.editCategories(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: "Categories updated"});
    });

    it('editCategories - should return 500 when an error occurred', async () => {
        const mockUpdateCategories = updateCategories as jest.Mock;

        mockUpdateCategories.mockImplementation(() => {
            throw new Error("Error updating Attendance Categories");
        });

        const req = {
            body: [
                new AttendanceCategory('Category 1', 1),
                new AttendanceCategory('Category 2', 2)
            ]
        } as Request;
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as unknown as Response;


        await attendanceCategoryController.editCategories(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Server Error"});
    });

});