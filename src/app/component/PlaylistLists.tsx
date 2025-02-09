"use client"
import React, {useState} from 'react';
import TopBar from "@/app/component/TopBar";
import PlayListContainer from "@/app/component/PlayListContainer";

const PlaylistLists = () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="flex flex-col w-[70%] ">
            <TopBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <PlayListContainer searchTerm={searchTerm} />
        </div>
    );
};

export default PlaylistLists;