import { useMutation, useQueryClient } from "@tanstack/react-query";

async function addTagToAudio(audioFileId: number, tagId: number) {
    const response = await fetch('/api/audio-tags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ audioFileId, tagId })
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}

async function removeTagFromAudio(audioFileId: number, tagId: number) {
    const response = await fetch(`/api/audio-tags?audioFileId=${audioFileId}&tagId=${tagId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}

export function useAddTagToAudio() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ audioFileId, tagId }: { audioFileId: number, tagId: number }) =>
            addTagToAudio(audioFileId, tagId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["audioFiles"] });
        }
    });
}

export function useRemoveTagFromAudio() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ audioFileId, tagId }: { audioFileId: number, tagId: number }) =>
            removeTagFromAudio(audioFileId, tagId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["audioFiles"] });
        }
    });
}