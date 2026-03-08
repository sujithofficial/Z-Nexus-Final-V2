import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryService } from '../services/api';
import { X, ZoomIn, Search } from 'lucide-react';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImg, setSelectedImg] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const { data } = await galleryService.getAll();
                setImages(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-neonPurple border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-24 container mx-auto px-6">
            <div className="mb-16 text-center">
                <h1 className="text-5xl md:text-7xl font-bold graffiti-text mb-4 text-limeGreen">WALL OF FAME</h1>
                <p className="text-gray-400 text-lg">Capturing the intensity and innovation of Z-NEXUS.</p>
            </div>

            {images.length === 0 ? (
                <div className="text-center py-40 border-4 border-dashed border-white/10 rounded-3xl">
                    <p className="text-2xl text-gray-600 font-bold uppercase tracking-widest">NO MEMORIES SAVED YET</p>
                </div>
            ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {images.map((img, index) => (
                        <motion.div
                            key={img._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedImg(img)}
                            className="relative group cursor-pointer break-inside-avoid rounded-2xl overflow-hidden border-4 border-white/5 shadow-xl hover:border-limeGreen transition-all"
                        >
                            <img
                                src={`http://localhost:5000${img.imageUrl}`}
                                alt={img.title}
                                className="w-full h-auto grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                                <Search size={40} className="text-limeGreen mb-4 translate-y-4 group-hover:translate-y-0 transition-transform" />
                                <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">{img.title}</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase">{new Date(img.uploadDate).toLocaleDateString()}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Lightbox / Modal */}
            <AnimatePresence>
                {selectedImg && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImg(null)}
                        className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-6"
                    >
                        <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors">
                            <X size={40} />
                        </button>
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-6xl max-h-[90vh] relative"
                        >
                            <img
                                src={`http://localhost:5000${selectedImg.imageUrl}`}
                                alt={selectedImg.title}
                                className="w-auto h-auto max-w-full max-h-[80vh] rounded-xl shadow-neon-blue border-4 border-white/10"
                            />
                            <div className="mt-6 text-center">
                                <h3 className="text-3xl font-black graffiti-text text-electricBlue">{selectedImg.title}</h3>
                                <p className="text-gray-400 font-bold">{new Date(selectedImg.uploadDate).toDateString()}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
