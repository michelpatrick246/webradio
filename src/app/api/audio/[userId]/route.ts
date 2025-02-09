import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma"; 

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    try {
        const { userId } = await params;

        // Vérifie que l'ID utilisateur est valide
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Recherche les fichiers audio associés à cet utilisateur
        const userAudioFiles = await prisma.audioFile.findMany({
            where: { userId: parseInt(userId) },
            select: {
                id: true,
                title: true,
                url: true
            },
        });

        return NextResponse.json({ data: userAudioFiles }, { status: 200 });
    } catch (error) {
        console.error("Error retrieving user audio files:", error);
        return NextResponse.json({ error: "Failed to retrieve audio files" }, { status: 500 });
    }
}
