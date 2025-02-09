// app/api/tags/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name');

        if (name) {
            // Recherche par nom
            const tag = await prisma.tag.findUnique({
                where: { name },
                include: {
                    audioFiles: {
                        select: {
                            id: true,
                            title: true
                        }
                    }
                }
            });
            return NextResponse.json(tag, { status: 200 });
        }

        const tags = await prisma.tag.findMany({
            include: {
                audioFiles: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });
        return NextResponse.json(tags, { status: 200 });
    } catch (error) {
        console.error('Error fetching tags:', error);
        return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
    }
}

// POST create a new tag
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: 'Tag name is required' }, { status: 400 });
        }

        const newTag = await prisma.tag.create({
            data: { name }
        });

        return NextResponse.json(newTag, { status: 201 });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Tag name must be unique' }, { status: 409 });
        }
        console.error('Error creating tag:', error);
        return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
    }
}

// PUT update an existing tag
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name } = body;

        if (!id || !name) {
            return NextResponse.json({ error: 'Tag ID and name are required' }, { status: 400 });
        }

        const updatedTag = await prisma.tag.update({
            where: { id: Number(id) },
            data: { name }
        });

        return NextResponse.json(updatedTag, { status: 200 });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
        }
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Tag name must be unique' }, { status: 409 });
        }
        console.error('Error updating tag:', error);
        return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
    }
}

// DELETE a tag
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 });
        }

        await prisma.tag.delete({
            where: { id: Number(id) }
        });

        return NextResponse.json({ message: 'Tag deleted successfully' }, { status: 200 });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
        }
        console.error('Error deleting tag:', error);
        return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
    }
}