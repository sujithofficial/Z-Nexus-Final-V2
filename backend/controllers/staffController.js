import StaffCoordinator from '../models/StaffCoordinator.js';

export const getStaff = async (req, res) => {
    try {
        const staff = await StaffCoordinator.find({});
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addStaff = async (req, res) => {
    try {
        const { name, designation, department } = req.body;
        const photo = req.file ? `/uploads/${req.file.filename}` : '';

        const staff = new StaffCoordinator({ name, designation, department, photo });
        const createdStaff = await staff.save();
        res.status(201).json(createdStaff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateStaff = async (req, res) => {
    try {
        const staff = await StaffCoordinator.findById(req.params.id);
        if (staff) {
            const { name, designation, department } = req.body;
            staff.name = name || staff.name;
            staff.designation = designation || staff.designation;
            staff.department = department || staff.department;
            if (req.file) {
                staff.photo = `/uploads/${req.file.filename}`;
            }
            const updatedStaff = await staff.save();
            res.json(updatedStaff);
        } else {
            res.status(404).json({ message: 'Staff not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteStaff = async (req, res) => {
    try {
        const staff = await StaffCoordinator.findById(req.params.id);
        if (staff) {
            await staff.deleteOne();
            res.json({ message: 'Staff removed' });
        } else {
            res.status(404).json({ message: 'Staff not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
