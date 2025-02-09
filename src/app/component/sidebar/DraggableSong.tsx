"use client";
import {AudioFile, Tag} from "@/type/playlist";
import {useDraggable} from "@dnd-kit/core";
import React, { useState} from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import {TagsPopover} from "@/app/component/tags/TagsPopover";

const getTagStyle = (tag: Tag) => {
    const lowercaseTag = tag.name.toLowerCase();
    return {
        backgroundColor: `var(--tag-${lowercaseTag}, #E8F5FE)`,
        color: `var(--tag-${lowercaseTag}-text, #0096FF)`,
    };
};

export function DraggableSong(
    { song:initialSong, isSelected, playingFile, handlePlayPause}:{ song: AudioFile; isSelected: boolean; playingFile: string | null; handlePlayPause: (fileId: string, url: string) => void}
) {
    const [song, setSong] = useState(initialSong);
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: `song-${song.id}`
        });
    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleUpdateTags = (updatedTags: Tag[]) => {
        setSong(prevSong => ({
            ...prevSong,
            tags: updatedTags
        }));
    };
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg group border border-gray-200 mb-2 bg-white cursor-grab ${
                isSelected ? 'bg-blue-50' : ''
            }`}
        >
            <input
                type="checkbox"
                checked={isSelected}
                readOnly
                className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => handlePlayPause(song.id, song.url)}
                >
                  {playingFile === song.id ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
              </Button>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{song.title}</h3>
                    <div className="flex gap-1">
                        { song.tags && song.tags.map((tag) => (
                            <span
                                key={tag.id}
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={getTagStyle(tag)}
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>
                <p className="text-sm text-gray-500">
                   {song.duration}
                </p>
            </div>
            <TagsPopover song={song} onUpdateTags={handleUpdateTags}/>
        </div>
    );
}