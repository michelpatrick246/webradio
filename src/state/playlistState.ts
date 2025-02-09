import { create } from "zustand";
import { AudioFile } from "@/type/playlist";

interface PlaylistForm {
    title: string;
    color?: string;
    image?: File;
    audioFiles: Partial<AudioFile>[];
}

type State = {
    form: PlaylistForm;
    isSubmitting: boolean;
    errors: Partial<Record<keyof PlaylistForm, string>>;
};

type Action = {
    setField: (field: keyof PlaylistForm, value: any) => void;
    setImage: (file: File | undefined) => void;
    addAudioFile: (file: Partial<AudioFile>) => void;
    removeAudioFile: (fileId: AudioFile["id"]) => void;
    setSubmitting: (status: boolean) => void;
    setError: (field: keyof PlaylistForm, message: string) => void;
    clearErrors: () => void;
    resetForm: () => void;
};

const initialState: State = {
    form: {
        title: "",
        color: undefined,
        image: undefined,
        audioFiles: [],
    },
    isSubmitting: false,
    errors: {},
};

export const usePlaylistFormStore = create<State & Action>((set) => ({
    ...initialState,

    setField: (field, value) => set((state) => ({
        form: { ...state.form, [field]: value }
    })),

    setImage: (file) => set((state) => ({
        form: { ...state.form, image: file }
    })),

    addAudioFile: (file) => set((state) => ({
        form: {
            ...state.form,
            audioFiles: [...state.form.audioFiles, file]
        }
    })),

    removeAudioFile: (fileId) => set((state) => ({
        form: {
            ...state.form,
            audioFiles: state.form.audioFiles.filter(file => file.id !== fileId)
        }
    })),

    setSubmitting: (status) => set({ isSubmitting: status }),

    setError: (field, message) => set((state) => ({
        errors: { ...state.errors, [field]: message }
    })),

    clearErrors: () => set({ errors: {} }),

    resetForm: () => set(initialState)
}));