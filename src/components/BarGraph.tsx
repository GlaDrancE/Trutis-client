import { Chart as ChartJS, CategoryScale, Filler, Legend, LinearScale, PointElement, Tooltip, Title, LineElement, BarElement } from 'chart.js';
import React, { useEffect, useRef, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { DataPointProps } from 'types'



// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
export const BarGraph: React.FC<DataPointProps> = ({
    data,
    xAxisKey,
    series,
    title,
    height = "400px",
    darkMode = sessionStorage.getItem('theme') === 'dark'
}) => {


    const chartRef = useRef(null);
    const [chartData, setChartData] = useState<{
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            borderColor: string;
            backgroundColor: string;
            borderWidth: number;
            borderRadius: number;
            borderSkipped: boolean;
            hoverBackgroundColor: string;
        }[];
    }>({
        labels: [],
        datasets: []
    });

    // Prepare chart data whenever inputs change
    useEffect(() => {
        if (!data || data.length === 0) return;
        const labels = data.map(item => item[xAxisKey]);
        const datasets = series.map(item => ({
            label: item.label,
            data: data.map(d => d[item.dataKey]),
            backgroundColor: item.backgroundColor,
            hoverBackgroundColor: item.hoverBackgroundColor || item.backgroundColor,
            borderWidth: 0,
            borderRadius: item.borderRadius !== undefined ? item.borderRadius : 4,
            borderSkipped: false
        }));
        setChartData({ labels, datasets: datasets as any });
    }, [data, xAxisKey, series]);

    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        family: 'Inter, system-ui, sans-serif',
                        size: 12
                    },
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    color: darkMode ? '#e5e7eb' : '#4b5563'
                }
            },
            title: {
                display: true,
                text: title,
                color: darkMode ? '#f3f4f6' : '#1f2937',
                font: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 16,
                    weight: 700
                },
                padding: {
                    bottom: 20
                }
            },
            tooltip: {
                backgroundColor: darkMode ? '#1f2937' : 'rgba(255, 255, 255, 0.95)',
                titleColor: darkMode ? '#e5e7eb' : '#1f2937',
                bodyColor: darkMode ? '#e5e7eb' : '#4b5563',
                bodyFont: {
                    family: 'Inter, system-ui, sans-serif'
                },
                titleFont: {
                    family: 'Inter, system-ui, sans-serif',
                    weight: 'bold'
                },
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                borderColor: darkMode ? '#374151' : '#e5e7eb',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    font: {
                        family: 'Inter, system-ui, sans-serif',
                        size: 11
                    },
                    color: darkMode ? '#9ca3af' : '#6b7280'
                }
            },
            y: {
                grid: {
                    color: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(243, 244, 246, 0.8)',
                    drawBorder: false
                },
                ticks: {
                    font: {
                        family: 'Inter, system-ui, sans-serif',
                        size: 11
                    },
                    color: darkMode ? '#9ca3af' : '#6b7280',
                    padding: 8
                },
                border: {
                    dash: [4, 4]
                }
            }
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        elements: {
            line: {
                borderJoinStyle: 'round' as const
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart' as const
        }
    };

    return (
        <div className={`w-full ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#F9F9FA] text-gray-900'} rounded-xl shadow-lg p-6`} style={{ height }}>
            <Bar data={chartData} options={options as any} />
        </div>
    )
}
