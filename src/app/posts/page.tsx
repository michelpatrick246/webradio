'use client'
import { usePosts } from "@/hooks/usePosts";


interface  IPost {
    title: string;
    author: IAuthor;
    id:number
}
interface IAuthor{
    name: string;
}
export default function Posts() {
    const { data: posts, isLoading, isError } = usePosts();
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching posts</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
            <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)] text-[#333333]">
                Posts
            </h1>
            <ul className="font-[family-name:var(--font-geist-sans)] max-w-2xl space-y-4">
                <li>My first post</li>
                {posts?.map((post:IPost) => (
                    <li key={post.id}>
                        <span className="font-semibold">{post.title}</span>
                        <span className="text-sm text-gray-600 ml-2">
              by {post.author?.name}
            </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}