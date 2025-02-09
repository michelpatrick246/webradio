"use client"
import React, { useState } from 'react';
import {Button} from "@/components/ui/button";
import {usePlaylistFormStore} from "@/state/playlistState";
import {usePlayListStore} from "@/state/songListState";
import {useQueryClient} from "@tanstack/react-query";
import { Loader2 } from 'lucide-react';

const uploadImageFile = async (file: File, title: string, color: string, audioFilesId: Array<number>) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title) ;
    formData.append("color", color) ;
    formData.append("audioFilesId", JSON.stringify(audioFilesId))
  
    try {
        const response = await fetch("/api/playlists/add", {
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

const SavePlaylistButton = () => {
    const { form, isSubmitting, errors } = usePlaylistFormStore();
    const songs = usePlayListStore().songList
    const [isLoading, setIsLoading] = useState(false)
    const queryClient = useQueryClient();

    const HandleClickSaved = async () => {
        setIsLoading(true);
        try {
            const playlists = { ...form, audioFiles: songs.map(song => song.id) };
            console.log(playlists);
            const result = await uploadImageFile(playlists.image, playlists.title, playlists.color, playlists.audioFiles);
            await queryClient.invalidateQueries({ queryKey: ['playlists'] });

            if(result) {
                setIsLoading(false) 
            }
            
        } catch (error) {
            console.error("Erreur lors de l'enregistrement :", error);
        } finally {
            setIsLoading(false); // Désactive le chargement
        }
}
    return (
        <Button 
            onClick={HandleClickSaved} className="bg-[#11c9d6] w-full  text-white m-2 hover:bg-opacity-35"
            disabled={isLoading} 
        >
             {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#fff"} fill={"none"}>
                        <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M12.0025 7.03857L12.0025 14.0889M12.0025 14.0889C12.3286 14.0933 12.6503 13.8691 12.8876 13.5956L14.4771 11.8129M12.0025 14.0889C11.6879 14.0847 11.3693 13.8618 11.1174 13.5955L9.51864 11.8129M7.98633 17.0386L15.9863 17.0386" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <p>Enregistrer le playlist</p>
                </>
            )}
        </Button>
    );
};

export default SavePlaylistButton;