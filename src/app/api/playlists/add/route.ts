import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import prisma from "../../../../../lib/prisma";

export async function POST(req: NextRequest, res: NextResponse) {


    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 10 MB
    const formData = await req.formData(); 

    const file = formData.get("file");
    const title = formData.get("title") ;
    const color = formData.get("color") ;
    const audioFilesId = JSON.parse(formData.get("audioFilesId") as string);
    //const userId = formData.get("userId") ;

    if (!file) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    if (!Array.isArray(audioFilesId)) {
        return new Response(JSON.stringify({ error: "Invalid data format" }), { status: 400 });
      }

    const filename = file.name.replaceAll(" ", "_");
    
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExtension = path.extname(filename).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
       return NextResponse.json({ error: "Invalid file type. Only images files are allowed." }, { status: 400 });
    }
     // Vérification de la taille du fichier
    if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "File is too large. Maximum size is 5MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer()) 


    //Défini le chemin de sauvegarde 
    const uploadPath = path.join(process.cwd(), "public/uploads/images/" + filename);

    try {
        // Ecrit le fichier dans le répertoire (uploads/images/)
        await writeFile(
          uploadPath,
          buffer
        );
        const fileUrl = `/uploads/images/${filename}`;
        
        const newPlaylist = await prisma.playlist.create({
            data: {
                title: title || "", 
                imageUrl: fileUrl,
                userId: 1,
                color: color || "",
                audioFiles: {
                    connect: audioFilesId.map((id: number) => ({id}))
                }
            },
            include: {audioFiles: true}
        })

        // Return a JSON response with a success message and a 201 status code
        return NextResponse.json({ Message: "Success", status: 201, data: newPlaylist });

      } catch (error) {
        
        console.log("Error occurred ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
      }
}