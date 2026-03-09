import Partner from '../models/Partner.js';

// @desc    Get all partners
// @route   GET /api/partners
// @access  Public
export const getPartners = async (req, res) => {
    try {
        const partners = await Partner.find({});
        res.json(partners);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a partner
// @route   POST /api/partners
// @access  Private/Admin
export const createPartner = async (req, res) => {
    try {
        const { name, website } = req.body;
        const logo = req.file ? `/uploads/${req.file.filename}` : '';

        if (!name || !logo) {
            return res.status(400).json({ message: 'Please provide name and logo' });
        }

        const partner = new Partner({
            name,
            logo,
            website,
        });

        const createdPartner = await partner.save();
        res.status(201).json(createdPartner);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a partner
// @route   PUT /api/partners/:id
// @access  Private/Admin
export const updatePartner = async (req, res) => {
    try {
        const { name, website } = req.body;
        const partner = await Partner.findById(req.params.id);

        if (partner) {
            partner.name = name || partner.name;
            if (req.file) {
                partner.logo = `/uploads/${req.file.filename}`;
            }
            if (website !== undefined) {
                partner.website = website;
            }

            const updatedPartner = await partner.save();
            res.json(updatedPartner);
        } else {
            res.status(404).json({ message: 'Partner not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a partner
// @route   DELETE /api/partners/:id
// @access  Private/Admin
export const deletePartner = async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id);

        if (partner) {
            await partner.deleteOne();
            res.json({ message: 'Partner removed' });
        } else {
            res.status(404).json({ message: 'Partner not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
