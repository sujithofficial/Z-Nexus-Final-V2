import AssociationMember from '../models/AssociationMember.js';
import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const getMembers = async (req, res) => {
    try {
        const members = await AssociationMember.find({});
        res.json(members);
    } catch (error) {
        console.error("Get Members Error:", error);
        res.status(500).json({ message: 'Failed to fetch members', error: error.message });
    }
};

export const addMember = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing' });
        }
        const { name, role, contact } = req.body;
        if (!name || !role) {
            return res.status(400).json({ message: 'Name and role are required' });
        }
        let photo = '';

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'znexus/association'
                });
                photo = result.secure_url;
                // Delete local file
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res.status(500).json({ message: 'Photo upload to Cloudinary failed' });
            }
        }

        const member = new AssociationMember({ name, role, contact, photo });
        const createdMember = await member.save();
        res.status(201).json(createdMember);
    } catch (error) {
        console.error("Add Member Error:", error);
        res.status(500).json({ message: 'Failed to add member', error: error.message });
    }
};

export const updateMember = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid member ID format' });
        }

        const member = await AssociationMember.findById(id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        if (req.body) {
            if (req.body.name) member.name = req.body.name;
            if (req.body.role) member.role = req.body.role;
            if (req.body.contact !== undefined) member.contact = req.body.contact;
        }

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'znexus/association'
                });
                member.photo = result.secure_url;
                // Delete local file
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res.status(500).json({ message: 'Photo update to Cloudinary failed' });
            }
        }

        const updatedMember = await member.save();
        res.json(updatedMember);
    } catch (error) {
        console.error("Update Member Error:", error);
        res.status(500).json({ message: 'Failed to update member', error: error.message });
    }
};

export const deleteMember = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid member ID format' });
        }

        const member = await AssociationMember.findById(id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        await member.deleteOne();
        res.json({ message: 'Member removed successfully' });
    } catch (error) {
        console.error("Delete Member Error:", error);
        res.status(500).json({ message: 'Failed to delete member', error: error.message });
    }
};
