"use client"
import PlayListItem from "@/app/component/PlayListItem";
import {usePlayLists} from "@/hooks/usePlaylists";
import {Playlist} from "@/type/playlist";

interface PlayListContainerProps {
    searchTerm: string;
}
const PlayListContainer = ({ searchTerm }:PlayListContainerProps) => {
    const { data: playlists, isLoading, isError } = usePlayLists(searchTerm);
    if(isLoading){
        return <div>Loading...</div>;
    }
    if(isError){
        return <div>Error...</div>;
    }
    return (
        <div className="flex justify-between items-center  mt-5">
            {
                playlists.map((playlist:Playlist, index:number) => (
                    <PlayListItem playlist={playlist} key={index}/>
                ))
            }
        </div>
    );
};

export default PlayListContainer;