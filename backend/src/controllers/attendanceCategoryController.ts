import { Request, Response } from "express";
import { selectCategories, updateCategories } from '../services/attendanceCategoryService';
import { AttendanceCategory } from '../models/attendanceCategoryModel';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories: AttendanceCategory[] = await selectCategories();
        res.status(200).json(categories);
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const editCategories = async (req: Request, res: Response) => {
    const categories: AttendanceCategory[] = req.body.map(category => new AttendanceCategory(category.title, category.order));

    //Check for name duplicates
    const titles: string[] = categories.map((category) => category.title);
    if(new Set(titles).size !== titles.length)
        return res.status(400).json({message: "The request contains duplicate entries. Duplicate values are not allowed."});

    //Check for order duplicates
    const orders: number[] = categories.map((category) => category.order);
    if(new Set(orders).size !== orders.length)
        return res.status(400).json({message: "The request contains duplicate entries. Duplicate values are not allowed."});

    try {
        await updateCategories(categories);
        res.status(200).json({message: "Categories updated"});
    } catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
};