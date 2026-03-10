import StaffCoordinator from '../models/StaffCoordinator.js';
import mongoose from 'mongoose';

export const getStaff = async (req, res) => {
    try {
        const staff = await StaffCoordinator.find({});
        res.json(staff);
    } catch (error) {
        console.error("Get Staff Error:", error);
        res.status(500).json({ message: 'Failed to fetch staff', error: error.message });
    }
};

export const addStaff = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing' });
        }
        const { name, designation, department } = req.body;
        if (!name || !designation) {
            return res.status(400).json({ message: 'Name and designation are required' });
        }
        const photo = req.file ? req.file.path : '';

        const staff = new StaffCoordinator({ name, designation, department, photo });
        const createdStaff = await staff.save();
        res.status(201).json(createdStaff);
    } catch (error) {
        console.error("Add Staff Error:", error);
        res.status(500).json({ message: 'Failed to add staff', error: error.message });
    }
};

export const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid staff ID format' });
        }

        const staff = await StaffCoordinator.findById(id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        if (req.body) {
            if (req.body.name) staff.name = req.body.name;
            if (req.body.designation) staff.designation = req.body.designation;
            if (req.body.department !== undefined) staff.department = req.body.department;
        }

        if (req.file) {
            staff.photo = req.file.path;
        }

        const updatedStaff = await staff.save();
        res.json(updatedStaff);
    } catch (error) {
        console.error("Update Staff Error:", error);
        res.status(500).json({ message: 'Failed to update staff', error: error.message });
    }
};

export const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid staff ID format' });
        }

        const staff = await StaffCoordinator.findById(id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        await staff.deleteOne();
        res.json({ message: 'Staff removed successfully' });
    } catch (error) {
        console.error("Delete Staff Error:", error);
        res.status(500).json({ message: 'Failed to delete staff', error: error.message });
    }
};
