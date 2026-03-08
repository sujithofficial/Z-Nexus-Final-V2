import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { galleryService } from '../../services/api';
import { Plus, Trash2, Image as ImageIcon, Upload, X } from 'lucide-react';

const AdminGallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const { data } = await galleryService.getAll();
            setImages(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !title) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', file);

        try {
            await galleryService.upload(formData);
            setTitle('');
            setFile(null);
            setPreview(null);
            fetchImages();
        } catch (error) {
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this image?')) {
            try {
                await galleryService.delete(id);
                fetchImages();
            } catch (error) {
                alert('Error deleting image');
            }
        }
    };

    if (loading) return <div className="text-center py-40">Loading...</div>;

    return (
        <div className="min-h-screen py-24 container mx-auto px-6">
            <div className="mb-16">
                <h1 className="text-4xl font-black graffiti-text text-limeGreen uppercase">GALLERY MANAGEMENT</h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest mt-2">{images.length} items on wall</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Upload Form */}
                <div className="lg:col-span-1">
                    <div className="sticker-card p-8 border-t-8 border-limeGreen sticky top-32">
                        <h2 className="text-xl font-black mb-8 flex items-center gap-2">
                            <Plus size={20} className="text-limeGreen" /> UPLOAD TO WALL
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 tracking-widest uppercase">IMAGE TITLE</label>
                                <input
                                    type="text" required placeholder="Event name or occasion"
                                    className="w-full" value={title} onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 tracking-widest uppercase">SELECT FILE</label>
                                <div
                                    onClick={() => document.getElementById('gal-upload').click()}
                                    className={`h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group ${preview ? 'border-limeGreen' : 'border-white/10'}`}
                                >
                                    {preview ? (
                                        <>
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover p-2 rounded-xl" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <Upload className="text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <ImageIcon className="mx-auto mb-2 text-gray-600" />
                                            <span className="text-xs font-bold text-gray-500">BROWSE IMAGE</span>
                                        </div>
                                    )}
                                </div>
                                <input id="gal-upload" type="file" hidden accept="image/*" onChange={handleFileChange} />
                            </div>

                            <button
                                type="submit" disabled={uploading || !file}
                                className="w-full py-4 bg-limeGreen text-black font-black rounded-xl hover:scale-105 transition-all shadow-lg disabled:opacity-50"
                            >
                                {uploading ? 'UPLOADING...' : 'POST TO GALLERY'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Image Grid */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {images.map((img) => (
                            <motion.div
                                key={img._id} layout
                                className="sticker-card p-0 overflow-hidden group relative"
                            >
                                <img
                                    src={`http://localhost:5000${img.imageUrl}`}
                                    alt={img.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-sm uppercase truncate max-w-[150px]">{img.title}</h3>
                                        <p className="text-[10px] text-gray-500">{new Date(img.uploadDate).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(img._id)}
                                        className="p-2 text-red-500/50 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminGallery;
