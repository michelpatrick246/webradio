'use client'
import React from "react";
import { QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./query_client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";



export default  function ReactQueryClientProvider({children ,}: {
    children: React.ReactNode
}) {
    return (
        <QueryClientProvider client={queryClient}>
                {children}
            <ReactQueryDevtools initialIsOpen={true}/>
        </QueryClientProvider>
    )
}
