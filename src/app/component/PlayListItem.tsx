'use client'
import React, { useEffect, useState } from 'react';
import { Playlist, PlaylistChecked } from "@/type/playlist";
import { usePlayListStore } from "@/state/globalState";
import { Slider } from "@/components/ui/slider";

interface Props {
    playlist: Playlist
}

const PlayListItem = (props: Props) => {
    const [value, setValue] = useState([25]);
    const [isChecked, setIsChecked] = useState(false);
    const updatePlaylist = usePlayListStore.use.updatePlayList();
    const playlists = usePlayListStore.use.playlists();

    const balanceValues = (playlists: PlaylistChecked[], changedId: number): PlaylistChecked[] => {

        const changedPlaylist = playlists.find(p => p.id === changedId);
        if (!changedPlaylist) return playlists;

        const total = playlists.reduce((acc, p) => acc + p.value, 0);

        if (total <= 100) return playlists;

        const excess = total - 100;
        const sumOthers = total - changedPlaylist.value;


        if (sumOthers <= 0) return playlists;

        return playlists.map(p => {
            if (p.id === changedId) return p; // On garde la valeur du playlist modifié
            // On réduit la valeur proportionnellement à sa part dans le total des autres
            const adjustedValue = p.value - (p.value / sumOthers) * excess;
            return { ...p, value: Math.floor(adjustedValue) };
        });
    };

    const handleCheckboxChange = () => {
        if (isChecked) {
            const newPlaylists = playlists.filter(playlist => playlist.id !== props.playlist.id);
            updatePlaylist(newPlaylists);
        } else {

            const newPlaylist: PlaylistChecked = {
                value: value[0],
                title: props.playlist.title,
                color: props.playlist.color,
                id: props.playlist.id
            };
            const newPlaylists = [...playlists, newPlaylist];

            const total = newPlaylists.reduce((acc, p) => acc + p.value, 0);

            if (total > 100) {
                updatePlaylist(balanceValues(newPlaylists, newPlaylist.id));
            } else {
                updatePlaylist(newPlaylists);
            }
        }
        setIsChecked(!isChecked);
    };

    const handleValueChange = (newValue: number[]) => {
        setValue(newValue);

        const updatedPlaylists = playlists.map((playlist) => {
            if (playlist.id === props.playlist.id) {
                return { ...playlist, value: newValue[0] };
            }
            return playlist;
        });

        updatePlaylist(balanceValues(updatedPlaylists, props.playlist.id));
    };

    useEffect(() => {
        const playlist = playlists.find(p => p.id === props.playlist.id);
        if (playlist) {
            setValue([playlist.value]);
            setIsChecked(true);
        } else {
            setIsChecked(false);
        }
    }, [playlists, props.playlist.id]);

    return (
        <div className={`flex flex-col space-y-8 bg-white py-4 px-5 ${isChecked ? 'border border-[#11c9d6]' : 'bg-white'}`}>
            <div className="relative flex flex-col ">
                <div className="w-40 h-40 rounded-full overflow-hidden relative">
                    <img
                        src={props.playlist.imageUrl ? props.playlist.imageUrl : '/rangiku.jpg'}
                        alt="rangiku"
                        width="200"
                        height="200"
                        className="object-cover"
                    />
                    <button className="bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"}>
                            <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <div className="absolute top-2 rounded-full opacity-60 p-1 right-0 bg-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"}>
                        <path d="M17.5 17.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
            <div className="flex flex-col items-center ">
                <h3>{props.playlist.title}</h3>
                <h4 className="opacity-75"> Pop, Dance, Electro  </h4>
            </div>
            <div className="flex space-x-2 items-center">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        className="hidden"
                    />
                    <div
                        onClick={handleCheckboxChange}
                        className={`h-5 w-5 border-2 border-gray-400 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                            isChecked ? 'bg-[#11c9d6] border-[#11c9d6]' : 'bg-white'
                        }`}
                    >
                        {isChecked && (
                            <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        )}
                    </div>
                </div>
                <p className={` px-1 rounded-sm text-white ${ isChecked ? 'bg-[#11c9d6]' : 'bg-gray-400'}`}>{value} %</p>
            </div>
            <div>
                <Slider
                    defaultValue={value}
                    max={100}
                    min={0}
                    step={1}
                    value={value}
                    myProps={isChecked ? '#11c9d6' : '#9ca3af'}
                    onValueChange={handleValueChange}
                />
            </div>
        </div>
    );
};

export default PlayListItem;
