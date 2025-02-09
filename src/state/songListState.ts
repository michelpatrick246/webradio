// store/playlistStore.ts
"use client";

import { create } from "zustand";
import { AudioFile } from "@/type/playlist";

type State = {
    songList: Partial<AudioFile>[];
};

type Action = {
    addSong: (song: Partial<AudioFile>) => void;
    removeSong: (songId: AudioFile["id"]) => void;
};

export const usePlayListStore = create<State & Action>((set) => ({
    songList: [], // On initialise songList en tableau vide
    addSong: (song) =>
        set((state) => ({
            songList: [...state.songList, song],
        })),
    removeSong: (songId) =>
        set((state) => ({
            songList: state.songList.filter((song) => song.id !== songId),
        })),
}));
