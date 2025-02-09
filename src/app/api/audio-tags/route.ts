import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { audioFileId, tagId } = body;

        if (!audioFileId || !tagId) {
            return NextResponse.json({ error: 'AudioFile ID and Tag ID are required' }, { status: 400 });
        }

        const updatedAudioFile = await prisma.audioFile.update({
            where: { id: Number(audioFileId) },
            data: {
                tags: {
                    connect: { id: Number(tagId) }
                }
            },
            include: {
                tags: true
            }
        });

        return NextResponse.json(updatedAudioFile, { status: 200 });
    } catch (error) {
        console.error('Error adding tag to audio file:', error);
        return NextResponse.json({ error: 'Failed to add tag' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const audioFileId = searchParams.get('audioFileId');
        const tagId = searchParams.get('tagId');

        if (!audioFileId || !tagId) {
            return NextResponse.json({ error: 'AudioFile ID and Tag ID are required' }, { status: 400 });
        }

        const updatedAudioFile = await prisma.audioFile.update({
            where: { id: Number(audioFileId) },
            data: {
                tags: {
                    disconnect: { id: Number(tagId) }
                }
            },
            include: {
                tags: true
            }
        });

        return NextResponse.json(updatedAudioFile, { status: 200 });
    } catch (error) {
        console.error('Error removing tag from audio file:', error);
        return NextResponse.json({ error: 'Failed to remove tag' }, { status: 500 });
    }
}