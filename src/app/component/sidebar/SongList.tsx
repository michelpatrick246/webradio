import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AudioFile } from "@prisma/client";
import { Search, Settings2, Play, Pause } from "lucide-react";
import { useState, useRef } from "react";

const songs = [
  {
    id: 1,
    title: "Shape of You",
    artist: "Ed Sheeran",
    duration: "3:54",
    tags: ["Pop", "Hit", "Été"],
  },
  {
    id: 2,
    title: "Blinding Lights",
    artist: "The Weeknd",
    duration: "3:20",
    tags: ["Pop", "Danse"],
  },
  {
    id: 3,
    title: "Bad Guy",
    artist: "Billie Eilish",
    duration: "3:14",
    tags: ["Alternatif", "Electro"],
  },
];

const getTagStyle = (tag: string) => {
  const lowercaseTag = tag.toLowerCase();
  return {
    backgroundColor: `var(--tag-${lowercaseTag}, #E8F5FE)`,
    color: `var(--tag-${lowercaseTag}-text, #0096FF)`,
  };
};

const SongList = () => {


  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Input
          placeholder="Rechercher dans ma bibliothèque"
          className="pl-10 pr-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Settings2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {/* Songs */}
      <div className="space-y-2">
        {songs.map((song) => (
          <div
            key={song.id}
            className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg group"
          >
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate">{song.title}</h3>
                <div className="flex gap-1">
                  {/* {song.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={getTagStyle(tag)}
                    >
                      {tag}
                    </span>
                  ))} */}
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {song.title} • {song.duration}
              </p>
            </div>
            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded">
              <span className="text-2xl text-gray-400">+</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongList;