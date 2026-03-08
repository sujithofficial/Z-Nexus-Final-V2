import AssociationMember from '../models/AssociationMember.js';

export const getMembers = async (req, res) => {
    try {
        const members = await AssociationMember.find({});
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addMember = async (req, res) => {
    try {
        const { name, role, contact } = req.body;
        const photo = req.file ? `/uploads/${req.file.filename}` : '';

        const member = new AssociationMember({ name, role, contact, photo });
        const createdMember = await member.save();
        res.status(201).json(createdMember);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMember = async (req, res) => {
    try {
        const member = await AssociationMember.findById(req.params.id);
        if (member) {
            const { name, role, contact } = req.body;
            member.name = name || member.name;
            member.role = role || member.role;
            member.contact = contact || member.contact;
            if (req.file) {
                member.photo = `/uploads/${req.file.filename}`;
            }
            const updatedMember = await member.save();
            res.json(updatedMember);
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteMember = async (req, res) => {
    try {
        const member = await AssociationMember.findById(req.params.id);
        if (member) {
            await member.deleteOne();
            res.json({ message: 'Member removed' });
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
