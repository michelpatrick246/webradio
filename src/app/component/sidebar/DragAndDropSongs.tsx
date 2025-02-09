"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    DndContext,
    DragEndEvent,
} from "@dnd-kit/core";
import { Input } from "@/components/ui/input";
import { Search, Settings2 } from "lucide-react";
import { usePlayListStore } from "@/state/songListState";
import {AudioFile} from  "@/type/playlist"
import {DraggableSong} from "@/app/component/sidebar/DraggableSong";
import {DroppableContainer} from "@/app/component/sidebar/DroppableContainer";


function DragAndDropSongs({songs}: AudioFile[]) {
    const [leftSongs, setLeftSongs] = useState<AudioFile[]>(songs);
    const { songList: rightSongs, addSong, removeSong } = usePlayListStore();

    const [playingFile, setPlayingFile] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlayPause = (fileId: string, url: string) => {
        
        console.log(audioRef)

        if (playingFile === fileId) {
            audioRef.current?.pause();
            setPlayingFile(null);
        } else {
        console.log(audioRef)
        if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.play().catch(console.error);
            setPlayingFile(fileId);
        }
        }
    };

    //console.log("Songs", JSON.stringify(leftSongs, null, 2));
    useEffect(() => {
        setLeftSongs(songs) 
    }, [songs])

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        if (over.id === "right" && typeof active.id === 'string') {
            const songId = parseInt(active.id.replace('song-', ''), 10);
            const song = leftSongs.find((s) => s.id === songId);
            if (song && !rightSongs.some(s => s.id === song.id)) {
                addSong(song);
            }
        }
    };

    const isSelected = (songId: number) => {
        return rightSongs.some(song => song.id === songId);
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex gap-8 p-8">
                <div className="w-1/2">
                    <div className="relative mb-4">
                        <Input placeholder="Rechercher dans ma bibliothèque" className="pl-10 pr-10" />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Settings2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <audio ref={audioRef} onEnded={() => setPlayingFile(null)} />
                    <div>
                        {leftSongs.map((song) => (
                            <DraggableSong
                                key={song.id}
                                song={song}
                                isSelected={isSelected(song.id)}
                                playingFile={playingFile}
                                handlePlayPause={handlePlayPause}
                            />
                        ))}
                    </div>
                </div>

                <div className="w-1/2">
                    <h2 className="text-2xl font-bold mb-4">Chansons Sélectionnées</h2>
                    <DroppableContainer id="right" extraClasses="min-h-[300px]">
                        {rightSongs.length === 0 ? (
                            <p className="text-gray-500">Glissez ici les chansons sélectionnées</p>
                        ) : (
                            rightSongs.map((song) => (
                                <div
                                    key={song.id}
                                    className="flex items-center gap-4 p-3 border border-gray-200 rounded mb-2 bg-white"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-medium">{song.title}</h3>
                                    </div>
                                    <button
                                        onClick={() => removeSong(song.id!)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            ))
                        )}
                    </DroppableContainer>
                </div>
            </div>
        </DndContext>
    );
}

export default DragAndDropSongs;