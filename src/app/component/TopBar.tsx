"use client"
import React, {useState} from 'react';
import PlaylistSidebar from "@/app/component/sidebar/PlaylistSidebar";
interface TopBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}
const TopBar = ({ searchTerm, setSearchTerm }:TopBarProps) => {
    const [isSidebarOpen,setIsSidebarOpen]= useState(false)
    return (
        <div className="flex justify-between w-full ">
            <div>
                <h1 className="font-bold opacity-85"> Choisissez vos style musicaux</h1>
                <h2 className="opacity-75"> Il en faut pour tout les goûts</h2>
            </div>
            <div className="flex space-x-4">
                <div className="z-40">
                    <PlaylistSidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />
                </div>
                <button onClick={()=>setIsSidebarOpen(!isSidebarOpen)} className="flex bg-[#11c9d6] items-center space-x-2  px-8 rounded-lg ">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="#fff" fill="none">
                        <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-white font-bold text-sm">Créer une playlist</p>
                </button>
                <div className="flex items-center  border border-gray-400 rounded-md">
                    <div className="px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#000000"} fill={"none"}>
                            <path d="M17.5 17.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="w-px bg-gray-400 self-stretch"></div>
                    <input
                        className="flex-1 p-2 outline-none"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default TopBar;