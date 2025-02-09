import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import prisma from "../../../../lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const title = searchParams.get('title');
        const tagName = searchParams.get('tag');

        const where = {
            AND: [] as any[]
        };


        if (title) {
            where.AND.push({
                title: {
                    contains: title,
                    mode: 'insensitive'
                }
            });
        }


        if (tagName) {
            where.AND.push({
                tags: {
                    some: {
                        name: {
                            equals: tagName,
                            mode: 'insensitive'
                        }
                    }
                }
            });
        }

        const finalWhere = where.AND.length > 0 ? where : {};
        const userAudioFiles = await prisma.audioFile.findMany({
            where: finalWhere,
            select: {
                id: true,
                title: true,
                url: true,
                tags: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                title: 'asc'
            }
        });

        return NextResponse.json(
            {
                data: userAudioFiles,
                filters: {
                    title: title || null,
                    tag: tagName || null
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error retrieving user audio files:", error);
        return NextResponse.json(
            { error: "Failed to retrieve audio files" },
            { status: 500 }
        );
    }
}


export async function POST(req: NextRequest, res: NextResponse) {


    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    const formData = await req.formData(); 

    const file = formData.get("file");
    // const title = formData.get("title");
    // const userId = formData.get("userId");
    // const categoryId = formData.get("categoryId");

    if (!file) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const filename = file.name.replaceAll(" ", "_");
    
    const allowedExtensions = ['.mp3', '.wav', '.flac', '.m4a', '.ogg'];
    const fileExtension = path.extname(filename).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
       return NextResponse.json({ error: "Invalid file type. Only audio files are allowed." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "File is too large. Maximum size is 10MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer()) 

    console.log(filename);

    //Définir le chemin de sauvegarde 
    const uploadPath = path.join(process.cwd(), "public/uploads/" + filename);

    try {
        await writeFile(
          uploadPath,
          buffer
        );
        const fileUrl = `/uploads/${filename}`;
        console.log({fileUrl, filename})
        const newAudioFile = await prisma.audioFile.create({
            data: {
                title: filename, 
                url: fileUrl,
                userId: 1,
                categoryId: null
            }
        })

        // Return a JSON response with a success message and a 201 status code
        return NextResponse.json({ Message: "Success", status: 201, data: newAudioFile });

      } catch (error) {
        
        console.log("Error occurred ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
      }
}