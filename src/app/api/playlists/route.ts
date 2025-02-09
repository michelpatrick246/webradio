import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

const OPENAI_API_KEY = process.env.CHAT_GPT;
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || "";
        console.log("Recherche de playlists avec query :", query);
        const playlists = query
            ? await prisma.playlist.findMany({
                where: {
                    title: {
                        contains: query,
                    },
                },
            })
            : await prisma.playlist.findMany();

        return NextResponse.json(playlists);
    } catch (error: any) {
        console.error("Erreur lors de la récupération des playlists :", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch playlists" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { title } = await request.json();

        if (!title) {
            return NextResponse.json(
                { error: "Le titre est requis" },
                { status: 400 }
            );
        }

        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: title,
                n: 1,
                size: "1024x1024"
            })
        });

        const data = await response.json();

        // Retourne l'URL de l'image générée
        return NextResponse.json({
            imageUrl: data.data[0].url
        });

    } catch (error: any) {
        console.error("Erreur lors de la génération de l'image :", error);
        return NextResponse.json(
            { error: error.message || "Échec de la génération de l'image" },
            { status: 500 }
        );
    }
}
