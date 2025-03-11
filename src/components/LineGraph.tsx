import React, { useEffect, useRef, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DataPointProps } from 'types';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);


const LineGraph: React.FC<DataPointProps> = ({
    data,
    xAxisKey,
    series,
    title,
    height = "400px",
    darkMode
}) => {
    const chartRef = useRef(null); const [chartData, setChartData] = useState<{
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            borderColor: string;
            backgroundColor: string;
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
            borderColor: item.borderColor,
            backgroundColor: item.backgroundColor,
            borderWidth: 2,
            pointBackgroundColor: item.borderColor,
            pointBorderColor: '#fff',
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: item.tension || 0.4,
            fill: item.fill || false
        }));

        setChartData({ labels, datasets });
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
                    weight: 'bold'
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
            easing: 'easeOutQuart'
        }
    };

    return (
        <div className={`w-full ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#F9F9FA] text-gray-900'} rounded-xl shadow-lg p-6`} style={{ height }}>
            <Line ref={chartRef} data={chartData} options={options as any} />
        </div>
    );
};

export default LineGraph;

// Example usage component
// const ChartExample = () => {
//     // Sample data
//     const sampleData = [
//         { month: 'Jan', revenue: 18500, users: 1200, conversions: 390 },
//         { month: 'Feb', revenue: 22300, users: 1400, conversions: 450 },
//         { month: 'Mar', revenue: 24800, users: 1600, conversions: 520 },
//         { month: 'Apr', revenue: 21200, users: 1500, conversions: 480 },
//         { month: 'May', revenue: 28700, users: 1800, conversions: 600 },
//         { month: 'Jun', revenue: 32500, users: 2100, conversions: 700 },
//         { month: 'Jul', revenue: 38200, users: 2400, conversions: 820 },
//         { month: 'Aug', revenue: 41500, users: 2600, conversions: 900 },
//     ];

//     // Series configuration
//     const seriesConfig = [
//         {
//             label: 'Revenue',
//             dataKey: 'revenue',
//             borderColor: '#7c3aed',
//             backgroundColor: 'rgba(124, 58, 237, 0.1)',
//             fill: true
//         },
//         {
//             label: 'Users',
//             dataKey: 'users',
//             borderColor: '#06b6d4',
//             backgroundColor: 'rgba(6, 182, 212, 0.1)'
//         },
//         {
//             label: 'Conversions',
//             dataKey: 'conversions',
//             borderColor: '#f59e0b',
//             backgroundColor: 'rgba(245, 158, 11, 0.1)'
//         }
//     ];

//     // Toggle between light and dark mode
//     const [isDarkMode, setIsDarkMode] = useState(false);

//     return (
//         <div className="space-y-6">
//             <div className="flex justify-end">
//                 <button
//                     onClick={() => setIsDarkMode(!isDarkMode)}
//                     className={`px-4 py-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
//                 >
//                     {isDarkMode ? 'Light Mode' : 'Dark Mode'}
//                 </button>
//             </div>

//             <ModernLineChart
//                 data={sampleData}
//                 xAxisKey="month"
//                 series={seriesConfig}
//                 title="Company Performance Metrics"
//                 height="400px"
//                 darkMode={isDarkMode}
//             />
//         </div>
//     );
// };

// export default ChartExample;