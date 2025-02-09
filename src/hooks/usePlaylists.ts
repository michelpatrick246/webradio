// hooks/usePlaylists.ts
import {useMutation, useQuery} from "@tanstack/react-query";

async function fetchPlaylists(searchTerm: string = "") {
    const response = await fetch(`/api/playlists?q=${encodeURIComponent(searchTerm)}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}

export function usePlayLists(searchTerm: string = "") {
    return useQuery({
        queryKey: ["playlists", searchTerm],
        queryFn: () => fetchPlaylists(searchTerm),
    });
}
async  function getImageFromAI(title : string) {
    const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title
        })
    })
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}
export  function useGenerateImage(title :string="image for music playlists"){
    return useMutation({
        mutationKey: ["image"],
        mutationFn: () => getImageFromAI(title)
    })
}
