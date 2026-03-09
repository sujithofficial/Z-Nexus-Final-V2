import Contact from '../models/Contact.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({}).sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        console.error("Get Contacts Error:", error);
        res.status(500).json({
            message: "Failed to fetch contacts",
            error: error.message
        });
    }
};

export const createContact = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }

        const { name, link } = req.body;
        const logoPath = req.file ? `/uploads/${req.file.filename}` : '';

        if (!logoPath) {
            return res.status(400).json({ message: 'Logo is required for new contacts' });
        }

        if (!name || !link) {
            return res.status(400).json({ message: 'Name and link are required' });
        }

        const contact = new Contact({
            name,
            link,
            logo: logoPath
        });

        const createdContact = await contact.save();
        res.status(201).json(createdContact);
    } catch (error) {
        console.error("Create Contact Error:", error);
        res.status(500).json({
            message: "Failed to create contact",
            error: error.message
        });
    }
};

export const updateContact = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid contact ID format" });
        }

        const updateData = {};

        // Handle text fields
        if (req.body) {
            if (req.body.name) updateData.name = req.body.name;
            if (req.body.link) updateData.link = req.body.link;
        }

        // Handle file upload
        if (req.file) {
            updateData.logo = `/uploads/${req.file.filename}`;
        }

        // Find and update
        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedContact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.json(updatedContact);

    } catch (error) {
        console.error("Update Contact Error:", error);
        res.status(500).json({
            message: "Failed to update contact",
            error: error.message
        });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid contact ID format" });
        }

        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Delete logo file if it exists
        if (contact.logo) {
            try {
                // Ensure we handle the leading slash in contact.logo correctly
                const relativeLogoPath = contact.logo.startsWith('/') ? contact.logo.substring(1) : contact.logo;
                const logoPath = path.join(__dirname, '..', relativeLogoPath);

                if (fs.existsSync(logoPath)) {
                    fs.unlinkSync(logoPath);
                }
            } catch (err) {
                console.error("Error deleting logo file:", err);
                // Continue with contact deletion even if file deletion fails
            }
        }

        await contact.deleteOne();
        res.json({ message: 'Contact removed successfully' });

    } catch (error) {
        console.error("Delete Contact Error:", error);
        res.status(500).json({
            message: "Failed to delete contact",
            error: error.message
        });
    }
};
