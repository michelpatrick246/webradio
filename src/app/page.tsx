import Distribution from "./component/Distribution";
import PlaylistLists from "@/app/component/PlaylistLists";


export default async function Home() {

  return (
      <div className=" flex bg-gray-50  justify-evenly w-full p-5 ">
            <PlaylistLists/>
          <Distribution/>
      </div>
  );
}
