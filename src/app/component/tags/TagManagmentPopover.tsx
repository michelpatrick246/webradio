import React, { useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {X,  Settings2} from "lucide-react";
import { useCreateTag, useTags, useDeleteTag } from '@/hooks/useTags';
import {PopoverClose} from "@radix-ui/react-popover";
import {Tag} from "@/type/playlist"

export function TagManagementPopover() {
    const [newTagName, setNewTagName] = useState('');
    const [selectedTags, setSelectedTags] = useState<number[]>([]);

    const { data: tags } = useTags();
    const createTagMutation = useCreateTag();
    const deleteTagMutation = useDeleteTag();

    const handleAddTag = () => {
        if (newTagName.trim()) {
            createTagMutation.mutate(newTagName.trim());
            setNewTagName('');
        }
    };

    const handleDeleteTag = (tagId: number) => {
        deleteTagMutation.mutate(tagId);
    };

    const handleSave = () => {
        console.log('Tags sélectionnés:', selectedTags);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="h-full px-4 text-[#000] hover:bg-[#11c9d6]/10">
                    <Settings2 className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent side="top" className="w-100">
                <div className="border-b pb-2 mb-4">
                    <h3 className="text-lg font-bold">Gestion des Tags</h3>
                </div>
                <div className="grid gap-4">
                    <div className="flex space-x-2">
                        <Input
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            placeholder="Nom du tag"
                            className="flex-grow"
                        />
                        <Button onClick={handleAddTag} className="bg-[#11c9d6]">
                            Ajouter
                        </Button>
                    </div>

                    <div className="max-h-40 flex space-x-2 flex-wrap  overflow-y-auto">
                        {tags?.map((tag:Tag) => (
                            <div
                                key={tag.id}
                                className="flex items-center justify-between bg-gray-400 px-1 text-white  rounded"
                            >
                                <span className="text-sm">{tag.name}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteTag(tag.id)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end w-full space-x-6 items-center">
                        <PopoverClose asChild>
                            <Button variant="secondary" >
                                Annuler
                            </Button>
                        </PopoverClose>
                        <PopoverClose asChild>
                            <Button onClick={handleSave} className="bg-[#11c9d6]">Enregistrer</Button>
                        </PopoverClose>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default TagManagementPopover;