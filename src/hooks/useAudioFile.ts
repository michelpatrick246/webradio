export const fetchAudioFiles = async () => {
    try {
        const response = await fetch("/api/audio", {
            method: "GET",
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Erreur inconnue");
        }

        console.log("Données récupérés:", data.data);
        return data.data;

    } catch (error) {
        console.error("Erreur lors de la récupération des fichiers:", error);
        return [];
    }
};

export const tabs = [
    { key: 'library', label: 'Bibliothèque' },
    { key: 'files', label: 'Mes Fichiers' }
];