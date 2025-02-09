import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Wand2 } from "lucide-react";
import ColorPickerModal from "@/app/component/sidebar/ColorPickerModal";
import { usePlaylistFormStore } from "@/state/playlistState";


const PlaylistForm = () => {

  const {setField, setImage} = usePlaylistFormStore() 

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const audioFiles = files.filter(file =>
        file.type.startsWith('image/') ||
        file.name.endsWith('.png') ||
        file.name.endsWith('.jpg') ||
        file.name.endsWith('.jpeg')
    );

    if (audioFiles.length > 0) {
        console.log('Fichiers audio sélectionnés:', audioFiles);
        // TODO: Gérer l'upload des fichiers
        for (const file of audioFiles) {
            //const result = await uploadImageFile(file, "Mon titre", " #8E44AD");
            console.log("File select "+ file)
            setImage(file) 
        }
    }
};

  return (
    <Card className="mb-4 border-white shadow-lg">
      <CardContent className="pt-6">
        <div className="flex gap-4 items-end">
          <div className="flex-[2]">
            <label htmlFor="playlist-name" className="block text-sm text-gray-600 mb-1">
              Nom de la playlist
            </label>
            <Input
              onChange={(e) => setField('title', e.target.value)}
              id="playlist-name"
              placeholder="Ma super playlist"
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <ColorPickerModal/>
          </div>
          <input
              type="file"
              id="image-upload"
              className="hidden"
              multiple
              accept="image/*,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
          />
          <div className="inline-flex border border-[#11c9d6] rounded-md overflow-hidden">
            <Button variant="outline" className="border-r border-r-[#11c9d6] px-12 text-[#11c9d6] rounded-none" onClick={() => document.getElementById('image-upload')?.click()}>
              <Upload className="h-4 w-4 " />
              Upload
            </Button>
            <Button variant="outline" className="text-[#11c9d6] rounded-none px-12  ">
              <Wand2 className="h-4 w-4" />
              IA
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaylistForm;