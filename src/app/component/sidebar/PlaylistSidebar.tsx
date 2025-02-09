import { Button } from "@/components/ui/button";
import { AudioFile } from "@/type/playlist";
import {Search,  Upload, X} from "lucide-react";
import React, {useEffect, useRef, useState} from "react";
import PlaylistForm from "./PlaylistForm";
import {DndContext, DragEndEvent} from "@dnd-kit/core";
import {Input} from "@/components/ui/input";
import {DraggableSong} from "@/app/component/sidebar/DraggableSong";
import {DroppableContainer} from "@/app/component/sidebar/DroppableContainer";
import {usePlayListStore} from "@/state/songListState";
import {fetchAudioFiles, tabs} from "@/hooks/useAudioFile";
import TabNavigation from "./TabNavigation";
import SavePlaylistButton from "@/app/component/sidebar/SavePlaylistButton";
import TagManagementPopover from "@/app/component/tags/TagManagmentPopover";
import {useTags} from "@/hooks/useTags";
import {Tag} from "@/type/playlist"

interface PlaylistSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const uploadAudioFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("/api/audio", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Erreur inconnue");
        }

        console.log("Upload réussi:", data.data);
        return data;

    } catch (error) {
        console.error("Erreur lors de l'envoi du fichier:", error);
        return null;
    }
};


const getAudioDuration = (fileUrl: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        const encodedUrl = encodeURIComponent(fileUrl);
        audio.src = `${encodedUrl}`;
        audio.onloadedmetadata = () => {
            const durationInSeconds = audio.duration; // Durée en secondes
            const minutes = Math.floor(durationInSeconds / 60);
            const seconds = Math.floor(durationInSeconds % 60);
            resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`); // Retourne la durée en secondes
        };
        audio.onerror = () => {
            reject(new Error("Impossible de lire la durée de l'audio"));
        };
    });
};

const fetchUserAudioFiles = async (userId: string) => {
  const res = await fetch(`/api/audio/${userId}`);
  const data = await res.json();
  return data.data;
};

const PlaylistSidebar = ({ isOpen, onClose }: PlaylistSidebarProps) => {

    const [duration, setDuration] = useState("0:00");
    const [activeTab, setActiveTab] = useState("library");
    const [isDragging, setIsDragging] = useState(false);
    const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
    const [audioFilesUser, setAudioFileUser] = useState<AudioFile[]>([]);
    const [selectedTag, setSelectedTag] = useState<string>("");

    const [searchQuery, setSearchQuery] = useState("");
    
    const handleTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedTag(value);
        console.log("Tag sélectionné :", value);
    };
    useEffect(() => {
        const getAudioFiles = async () => {
            const files = await fetchAudioFiles();

            const filesWithDuration = await Promise.all(
                files.map(async (file: AudioFile) => {
                    const duration = await getAudioDuration(file.url)
                    setAudioFiles((state: AudioFile[]) => [...state, {...file, duration}])
                    return { ...file, duration };
                })
            )

        };

        getAudioFiles();
    }, []);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const audioFiles = files.filter(file =>
            file.type.startsWith('audio/') ||
            file.name.endsWith('.mp3') ||
            file.name.endsWith('.wav') ||
            file.name.endsWith('.ogg') ||
            file.name.endsWith('.m4a')
        );

        if (audioFiles.length > 0) {
            console.log('Fichiers audio reçus:', audioFiles);
            // TODO: Gérer l'upload des fichiers
            for (const file of audioFiles) {
                const result = await uploadAudioFile(file);
                setAudioFileUser((state) => ([...state, {...result.data}]))
                if (result) {
                    const duration = await getAudioDuration(result.data.url);
                    const newAudioFile = {
                        ...result.data,
                        duration,
                        id: result.data.id
                    };
                    setAudioFileUser((state) => ([...state, newAudioFile]));
                }
            }
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const audioFiles = files.filter(file =>
            file.type.startsWith('audio/') ||
            file.name.endsWith('.mp3') ||
            file.name.endsWith('.wav') ||
            file.name.endsWith('.ogg') ||
            file.name.endsWith('.m4a')
        );

        if (audioFiles.length > 0) {
            console.log('Fichiers audio sélectionnés:', audioFiles);
            // TODO: Gérer l'upload des fichiers
            for (const file of audioFiles) {
                const result = await uploadAudioFile(file);
                if (result) {
                    console.log("Fichier uploadé avec succès:", result);
                    // TODO: Mettre à jour l'UI (ex: afficher le fichier dans une liste)
                    setAudioFileUser((state) => ([...state, {...result.data}]))
                }
            }
        }
    };
    const [leftSongs, setLeftSongs] = useState<AudioFile[]>(audioFiles);
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
        setLeftSongs(audioFiles)
    }, [audioFiles])

    useEffect(() => {
      const getAudioFilesUser = async () => {
        const userId = "1"
        const data = await fetchUserAudioFiles(userId)
        setAudioFileUser(data)
      }
      getAudioFilesUser()
    }, [])

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        if (over.id === "right" && typeof active.id === 'string') {
            const songId = parseInt(active.id.replace('song-', ''), 10);
            const song = leftSongs.find((s) => s.id === songId) ||
                audioFilesUser.find((s) => s.id === songId);
            if (song && !rightSongs.some(s => s.id === song.id)) {
                addSong(song);
            }
        }
    };
   
    const { data: tags } = useTags();
    const isSelected = (songId: number) => {
        return rightSongs.some(song => song.id === songId);
    };

    const filteredSongs = leftSongs.filter((song) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = song.title.toLowerCase().includes(searchLower)
        
        const matchesTag = !selectedTag || song.tags.some(tag => tag.id === parseInt(selectedTag));

        console.log("Tag: " + selectedTag)
    
        return matchesSearch && matchesTag;
      });

    // const filteredSongsFichier = audioFilesUser.filter((song) => {
    //     const searchLower = searchQuery.toLowerCase();
    //     const matchesSearch = song.title.toLowerCase().includes(searchLower)
        
    //     const matchesTag = !selectedTag || song.tags.some(tag => tag.id === parseInt(selectedTag));

    //     console.log("Tag: " + selectedTag)
    
    //     return matchesSearch && matchesTag;
    //   });

    return (
        <div>
            <div
                className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                onClick={onClose}
            />
            <div
                className={`fixed inset-y-0 right-0 w-full sm:w-[940px] bg-white shadow-lg transform
        transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="h-full flex flex-col">
                    {/* Header - fixe */}
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-semibold">Créer une playlist</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Contenu scrollable */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4 space-y-4">
                            <PlaylistForm />
                        </div>

                        <div className="flex w-full p-3 space-x-2">
                            <DndContext onDragEnd={handleDragEnd}>
                                <div className="flex justify-between p-2 items-start w-full">
                                    {/* Colonne gauche */}
                                    <div className="w-1/2">
                                        <div className="flex flex-col space-y-3">
                                            <TabNavigation
                                                tabs={tabs}
                                                activeTab={activeTab}
                                                onTabChange={setActiveTab}
                                            />
                                            <div className="inline-flex border border-[#000] rounded-md overflow-hidden">
                                                <div className="border-r border-r-[#000] flex items-center">
                                                    <Button variant="ghost" className="h-full px-4 text-[#000] hover:bg-[#11c9d6]/10">
                                                        <Search className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="relative flex-1">
                                                    <Input
                                                        placeholder="Rechercher dans ma bibliothèque"
                                                        className="border-none focus:ring-0 focus:ring-offset-0 rounded-none px-4 text-[#000] placeholder:text-[#000]/50"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                    />
                                                </div>
                                                <div className="border-l border-r border-l-[#000] border-r-[#000] flex items-center">
                                                    <select
                                                        value={selectedTag}
                                                        onChange={handleTagChange}
                                                        className="w-[100px] px-4 py-2 text-[#000] bg-white border-none focus:ring-0 focus:ring-offset-0 cursor-pointer"
                                                    >
                                                        {
                                                            tags && tags.map((tag:Tag,key:number) => (
                                                                <option key={key} value={tag.id}>{tag.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                <div className="border-l border-l-[#000] flex items-center">
                                                    <TagManagementPopover/>
                                                </div>
                                            </div>

                                        </div>
                                        <audio ref={audioRef} onEnded={() => setPlayingFile(null)} />

                                        {activeTab === "library" && (
                                            <div className="flex flex-col">
                                                <p className="text-sm text-gray-500 mb-4">Durée totale : {duration}</p>
                                                <div className="h-[400px] overflow-y-auto">
                                                    {filteredSongs.map((song) => (
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
                                        )}

                                        {activeTab === 'files' && (
                                            <div>
                                                <div className={`border-2 mt-4 border-dashed rounded-lg p-8 text-center transition-colors mb-4 ${
                                                    isDragging ? 'border-[#11c9d6] bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                                     onDragOver={handleDragOver}
                                                     onDragLeave={handleDragLeave}
                                                     onDrop={handleDrop}
                                                >
                                                    <div className="flex flex-col items-center gap-2 ">
                                                        <Upload className="h-8 w-8 text-gray-400" />
                                                        <p className="text-gray-600">Glissez et déposez vos fichiers audio ici</p>
                                                        <p className="text-sm text-gray-500">Formats acceptés : MP3, WAV, OGG, M4A</p>
                                                        <p className="text-sm text-gray-500">ou</p>
                                                        <div>
                                                            <input
                                                                type="file"
                                                                id="file-upload"
                                                                className="hidden"
                                                                multiple
                                                                accept="audio/*,.mp3,.wav,.ogg,.m4a"
                                                                onChange={handleFileSelect}
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                className="text-[#11c9d6] border-[#11c9d6] hover:bg-blue-50"
                                                                onClick={() => document.getElementById('file-upload')?.click()}
                                                            >
                                                                Parcourir les fichiers
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="h-[400px] overflow-y-auto">
                                                    {audioFilesUser.map((song) => (
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
                                        )}
                                    </div>

                                    {/* Colonne droite */}
                                    <div className="w-1/2 p-2">
                                        <h2 className="text-2xl font-bold mb-4">Chansons Sélectionnées</h2>
                                        <DroppableContainer id="right" extraClasses="h-[400px] overflow-y-auto">
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
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"}>
                                                                <path d="M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </DroppableContainer>
                                    </div>
                                </div>
                            </DndContext>
                        </div>
                    </div>

                    {/* Footer - fixe */}
                    <div className="border-t p-4 w-full">
                        <SavePlaylistButton />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaylistSidebar;
