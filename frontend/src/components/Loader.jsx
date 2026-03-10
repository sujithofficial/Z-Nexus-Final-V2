import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999]">
            <h1 className="text-6xl font-bold tracking-[0.2em] text-white mb-12">
                Z-NEXUS
            </h1>

            <div className="w-72 h-[3px] bg-white/20 overflow-hidden rounded-full relative">
                <div className="absolute inset-0 loader-bar"></div>
            </div>
        </div>
    );
};

export default Loader;
