"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";
import {usePlaylistFormStore} from "@/state/playlistState";

export default function ColorPickerPopover() {
    const [color, setColor] = useState("#3498db");
    const { setField} = usePlaylistFormStore();
    const HandleColorChange = (color:string)=>{
        setColor(color)
        setField('color',color);
    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={color} fill={"none"}>
                        <path d="M12 22C18 22 19.5 17.49 19.5 12C19.5 6.50998 18 2 12 2C5.99993 2 4.5 6.50996 4.5 12C4.5 17.49 5.99993 22 12 22Z" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M12 9V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Couleur
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2 shadow-lg rounded-lg bg-white flex flex-col items-center">
                <HexColorPicker color={color} onChange={HandleColorChange} />
                <div className="w-10 h-10 rounded-full border border-gray-300 mt-2" style={{ backgroundColor: color }} />
            </PopoverContent>
        </Popover>
    );
}
