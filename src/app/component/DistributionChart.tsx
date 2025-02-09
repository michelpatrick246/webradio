"use client"

import React from 'react';
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import {
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {PlaylistChecked} from "@/type/playlist";


interface PercentagePieChartProps {
    data: PlaylistChecked[];
    title?: string;
    description?: string;
    centerLabel?: string;
    trend?: {
        value: number;
        label: string;
    };
    footer?: string;
}

const DistributionChart = ({
                               data,
                               centerLabel = "Total",
                               trend,
                               footer
                           }: PercentagePieChartProps) => {
    const chartData = React.useMemo(() => {
        return data.map(item => ({
            name: item.title,
            value: item.value,
            fill: item.color
        }));
    }, [data]);

    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {
            value: {
                label: "Percentage",
            }
        };

        data.forEach(item => {
            config[item.title] = {
                label: item.title,
                color: item.color
            };
        });

        return config;
    }, [data]);
    return (
        <div className="flex flex-col">
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        const centerX = viewBox.cx! - 50; // Ajuster la position X (la moitié de la largeur)
                                        const centerY = viewBox.cy! - 50; // Ajuster la position Y (la moitié de la hauteur)

                                        return (
                                            <svg>
                                                <defs>
                                                    <clipPath id="circleClip">
                                                        <circle cx={viewBox.cx} cy={viewBox.cy} r="50" />
                                                    </clipPath>
                                                </defs>
                                                <image
                                                    x={centerX}
                                                    y={centerY}
                                                    width="100"
                                                    height="100"
                                                    href="/music.jpg"
                                                    clipPath="url(#circleClip)" 
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </svg>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            {(trend || footer) && (
                <CardFooter className="flex-col gap-2 text-sm">
                    {trend && (
                        <div className="flex items-center gap-2 font-medium leading-none">
                            {trend.label} <TrendingUp className="h-4 w-4" />
                        </div>
                    )}
                    {footer && (
                        <div className="leading-none text-muted-foreground">
                            {footer}
                        </div>
                    )}
                </CardFooter>
            )}
        </div>
    );
};

export default DistributionChart;