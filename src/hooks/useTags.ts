// hooks/useTags.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchTags() {
    const response = await fetch('/api/tags');
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}


async function findTagByName(name: string) {
    const response = await fetch(`/api/tags?name=${encodeURIComponent(name)}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}


export function useTags() {
    return useQuery({
        queryKey: ["tags"],
        queryFn: fetchTags
    });
}


export function useTagByName(name: string) {
    return useQuery({
        queryKey: ["tag", name],
        queryFn: () => findTagByName(name),
        enabled: !!name
    });
}


async function createTag(name: string) {
    const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}


async function updateTag(id: number, name: string) {
    const response = await fetch('/api/tags', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, name })
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}


async function deleteTag(id: number) {
    const response = await fetch(`/api/tags?id=${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}


export function useCreateTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTag,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        }
    });
}


export function useUpdateTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, name }: { id: number, name: string }) => updateTag(id, name),
        onSuccess: () => {
            // Invalider et rafraîchir la liste des tags après mise à jour
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        }
    });
}


export function useDeleteTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTag,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        }
    });
}