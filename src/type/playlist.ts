export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    playlists: Playlist[];
    AudioFile: AudioFile[];
}

export interface Playlist {
    id: number;
    title: string;
    color?: string;
    imageUrl?: string;
    user: User;
    userId: number;
    audioFiles: AudioFile[];
}
export  interface PlaylistChecked {
    id: number;
    title: string;
    color?: string;
    value: number;
}

export interface AudioFile {
    id: number;
    title: string;
    url: string;
    user?: User;
    userId?: number;
    category?: Category;
    categoryId?: number;
    tags: Tag[];
    playlists: Playlist[];
    duration?: string;
}


export interface Category {
    id: number;
    name: string;
    audioFiles: AudioFile[];
}

export interface Tag {
    id: number;
    name: string;
    audioFiles: AudioFile[];
}