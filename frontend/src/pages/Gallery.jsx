import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryService, getImageUrl } from '../services/api';
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
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-t-2 border-white rounded-full animate-spin"></div>
                    <div className="absolute inset-4 border-b-2 border-white/20 rounded-full animate-spin-slow"></div>
                </div>
            </div>
        );
    }

    return (
        <div id="gallery-top" className="min-h-screen py-32 container mx-auto px-4 sm:px-6 relative overflow-hidden scroll-mt-24">
            {/* Atmosphere Layer */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_60%)]" />
            </div>

            <div className="mb-24 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1 className="text-4xl sm:text-5xl md:text-8xl font-black mb-8 leading-none tracking-tighter fast-red-gradient uppercase">
                        WALL OF FAME
                    </h1>
                    <p className="text-white/20 text-xs font-black uppercase tracking-[0.3em] max-w-xl mx-auto">CAPTURING THE MEMORIES AND MILESTONES OF OUR TECHNICAL JOURNEY.</p>
                </motion.div>
            </div>

            {images.length === 0 ? (
                <div className="text-center py-32 liquid-glass rounded-[3rem] border border-white/5 relative z-10">
                    <p className="text-xs text-white/20 font-black uppercase tracking-[0.4em]">NO MEMORIES SAVED YET</p>
                </div>
            ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-10 space-y-6 md:space-y-10 relative z-10">
                    {images.map((img, index) => (
                        <motion.div
                            key={img._id}
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 1.2, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true, margin: "-50px" }}
                            onClick={() => setSelectedImg(img)}
                            className="relative group cursor-pointer break-inside-avoid rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl bg-white/[0.02]"
                        >
                            {/* Glass Reflection Component */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-1000 z-20 pointer-events-none" />

                            <img
                                src={getImageUrl(img.imageUrl)}
                                alt={img.title}
                                className="w-full h-auto grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-[0.16, 1, 0.3, 1]"
                            />
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col items-center justify-center p-8 text-center z-10">
                                <Search size={24} className="text-white mb-6 translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-[0.16, 1, 0.3, 1]" />
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white underline underline-offset-8 mb-4">{img.title}</h3>
                                <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">{new Date(img.uploadDate).toLocaleDateString()}</p>
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
                        className="fixed inset-0 z-[60] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6 md:p-12"
                    >
                        <button className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors active:scale-90 duration-300">
                            <X size={32} />
                        </button>
                        <motion.div
                            initial={{ scale: 0.97, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.97, opacity: 0, y: 20 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-6xl max-h-[90vh] relative flex flex-col items-center"
                        >
                            <div className="relative sticker-card p-2 rounded-[3.5rem] bg-white/[0.03] border border-white/5 shadow-3xl">
                                <img
                                    src={getImageUrl(selectedImg.imageUrl)}
                                    alt={selectedImg.title}
                                    className="w-auto h-auto max-w-full max-h-[70vh] rounded-[3rem] object-contain"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none opacity-40 rounded-[3rem]" />
                            </div>
                            <div className="mt-12 text-center">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter transition-all duration-300">{selectedImg.title}</h3>
                                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] mt-4">{new Date(selectedImg.uploadDate).toDateString()}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
