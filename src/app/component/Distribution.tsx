'use client'
import React, { useEffect, useMemo } from 'react';
import DistributionChart from "@/app/component/DistributionChart";
import { Progress } from "@/components/ui/progress";
import { usePlayListStore } from "@/state/globalState";

const Distribution = () => {
    const playlistsChecked = usePlayListStore.use.playlists();

    const totalPercentage = useMemo(
        () => playlistsChecked.reduce((acc, item) => acc + item.value, 0),
        [playlistsChecked]
    );

    useEffect(() => {
        console.log(playlistsChecked);
    }, [playlistsChecked]);

    return (
        <div className="w-[23%] flex flex-col space-y-4 ">
            <div className="bg-white h-auto py-4 px-4">
                <h3>Répartition musical</h3>
                <DistributionChart
                    title="Progression du projet"
                    description="Sprint actuel"
                    centerLabel="Progression"
                    data={playlistsChecked}
                />
                <div>
                    {playlistsChecked.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <p>{item.title}</p>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col space-y-2 mt-4">
                    <div className="flex justify-between">
                        <p>Total</p>
                        <p className="bg-[#11c9d6] px-1 text-white rounded-sm">{totalPercentage} %</p>
                    </div>
                    <Progress value={totalPercentage} className="bg-gray-200 [&>div]:bg-[#11c9d6]" />
                </div>
            </div>
            <button className="w-full flex items-center justify-center space-x-2 bg-[#11c9d6] rounded-lg py-1">
                <p className="text-white">Etape suivant</p>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#fff"} fill={"none"}>
                    <path d="M20.0001 11.9998L4.00012 11.9998" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15.0003 17C15.0003 17 20.0002 13.3176 20.0002 12C20.0002 10.6824 15.0002 7 15.0002 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
};

export default Distribution;
