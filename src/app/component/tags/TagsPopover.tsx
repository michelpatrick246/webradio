import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {  Plus, X, Loader2 } from "lucide-react";
import { useTags } from "@/hooks/useTags";
import { useAddTagToAudio, useRemoveTagFromAudio } from "@/hooks/useAudioTags";
import { Tag, AudioFile } from "@/type/playlist";


export function TagsPopover({ song, onUpdateTags }: {
    song: AudioFile;
    onUpdateTags: (updatedTags: Tag[]) => void;
}) {
    const { data: availableTags, isLoading, error } = useTags();
    const addTagMutation = useAddTagToAudio();
    const removeTagMutation = useRemoveTagFromAudio();

    const handleAddTag = async (tagId: number) => {
        try {
            const result = await addTagMutation.mutateAsync({
                audioFileId: song.id,
                tagId: tagId
            });
            // Mettre à jour les tags dans le composant parent
            if (result.tags) {
                onUpdateTags(result.tags);
            }
        } catch (error) {
            console.error("Failed to add tag:", error);
        }
    };

    const handleRemoveTag = async (tagId: number) => {
        try {
            const result = await removeTagMutation.mutateAsync({
                audioFileId: song.id,
                tagId
            });
            // Mettre à jour les tags dans le composant parent
            if (result.tags) {
                onUpdateTags(result.tags);
            }
        } catch (error) {
            console.error("Failed to remove tag:", error);
        }
    };

    if (isLoading) return <div>Loading tags...</div>;
    if (error) return <div>Error loading tags</div>;
    if (!availableTags?.length) return <div>No tags available</div>;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    onPointerDown={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
                <div className="space-y-2">
                    <h4 className="font-medium">Gérer les tags</h4>
                    <div className="space-y-1">
                        {availableTags?.map((tag: Tag) => {
                            const isTagged = Array.isArray(song.tags) &&
                                song.tags.some(t => t.id === tag.id);
                            const isLoading =
                                (addTagMutation.isPending && addTagMutation.variables?.tagId === tag.id) ||
                                (removeTagMutation.isPending && removeTagMutation.variables?.tagId === tag.id);

                            return (
                                <button
                                    key={tag.id}
                                    onClick={() => {
                                        isTagged ? handleRemoveTag(tag.id) : handleAddTag(tag.id);
                                    }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-between px-2 py-1 hover:bg-gray-100 rounded disabled:opacity-50"
                                >
                                    <span>{tag.name}</span>
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : isTagged ? (
                                        <X className="w-4 h-4 text-gray-500" />
                                    ) : (
                                        <Plus className="w-4 h-4 text-gray-500" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}