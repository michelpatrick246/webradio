import React from "react";
import {useDroppable} from "@dnd-kit/core";

export function DroppableContainer({
                                id,
                                children,
                                extraClasses = "",
                            }: {
    id: string;
    children: React.ReactNode;
    extraClasses?: string;
}) {
    const { isOver, setNodeRef } = useDroppable({ id });
    return (
        <div
            ref={setNodeRef}
            className={`p-4 border rounded-md ${isOver ? "bg-blue-50" : "bg-white"} ${extraClasses}`}
        >
            {children}
        </div>
    );
}