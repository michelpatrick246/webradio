import { useQuery } from "@tanstack/react-query";

async function fetchPosts() {
    const response = await fetch("/api/posts");
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}

export function usePosts() {
    return useQuery({
        queryKey: ["posts"], // Clé unique pour cette requête
        queryFn: fetchPosts, // Fonction pour récupérer les données
    });
}