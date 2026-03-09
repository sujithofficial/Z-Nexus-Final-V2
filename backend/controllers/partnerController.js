import Partner from '../models/Partner.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all partners
// @route   GET /api/partners
// @access  Public
export const getPartners = async (req, res) => {
    try {
        const partners = await Partner.find({});
        res.json(partners);
    } catch (error) {
        console.error("Get Partners Error:", error);
        res.status(500).json({ message: 'Failed to fetch partners', error: error.message });
    }
};

// @desc    Create a partner
// @route   POST /api/partners
// @access  Private/Admin
export const createPartner = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing' });
        }

        const { name, website } = req.body;
        const logo = req.file ? `/uploads/${req.file.filename}` : '';

        if (!name || !logo) {
            return res.status(400).json({ message: 'Please provide name and logo' });
        }

        const partner = new Partner({ name, logo, website });
        const createdPartner = await partner.save();
        res.status(201).json(createdPartner);
    } catch (error) {
        console.error("Create Partner Error:", error);
        res.status(500).json({ message: 'Failed to create partner', error: error.message });
    }
};

// @desc    Update a partner
// @route   PUT /api/partners/:id
// @access  Private/Admin
export const updatePartner = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid partner ID format' });
        }

        const partner = await Partner.findById(id);

        if (!partner) {
            return res.status(404).json({ message: 'Partner not found' });
        }

        // Safely read body fields
        if (req.body) {
            if (req.body.name) partner.name = req.body.name;
            if (req.body.website !== undefined) partner.website = req.body.website;
        }

        if (req.file) {
            // Delete old logo file
            try {
                const relativeOldLogo = partner.logo.startsWith('/') ? partner.logo.substring(1) : partner.logo;
                const oldLogoPath = path.join(__dirname, '..', relativeOldLogo);
                if (fs.existsSync(oldLogoPath)) {
                    fs.unlinkSync(oldLogoPath);
                }
            } catch (err) {
                console.error("Error deleting old partner logo:", err);
            }
            partner.logo = `/uploads/${req.file.filename}`;
        }

        const updatedPartner = await partner.save();
        res.json(updatedPartner);
    } catch (error) {
        console.error("Update Partner Error:", error);
        res.status(500).json({ message: 'Failed to update partner', error: error.message });
    }
};

// @desc    Delete a partner
// @route   DELETE /api/partners/:id
// @access  Private/Admin
export const deletePartner = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid partner ID format' });
        }

        const partner = await Partner.findById(id);

        if (!partner) {
            return res.status(404).json({ message: 'Partner not found' });
        }

        // Delete logo file
        if (partner.logo) {
            try {
                const relativeLogoPath = partner.logo.startsWith('/') ? partner.logo.substring(1) : partner.logo;
                const logoPath = path.join(__dirname, '..', relativeLogoPath);
                if (fs.existsSync(logoPath)) {
                    fs.unlinkSync(logoPath);
                }
            } catch (err) {
                console.error("Error deleting partner logo file:", err);
            }
        }

        await partner.deleteOne();
        res.json({ message: 'Partner removed successfully' });
    } catch (error) {
        console.error("Delete Partner Error:", error);
        res.status(500).json({ message: 'Failed to delete partner', error: error.message });
    }
};
