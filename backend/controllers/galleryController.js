import Gallery from '../models/Gallery.js';

export const getGallery = async (req, res) => {
    try {
        const galleryItems = await Gallery.find({}).sort({ createdAt: -1 });
        res.json(galleryItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addGalleryImage = async (req, res) => {
    try {
        const { title } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

        if (!imageUrl) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const galleryItem = new Gallery({ title, imageUrl });
        const createdItem = await galleryItem.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteGalleryImage = async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (item) {
            await item.deleteOne();
            res.json({ message: 'Image removed' });
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
