import { Card } from "@/components/ui/card";
import useClient from "@/hooks/client-hook";
import { cn } from "@/lib/utils";
import LineGraph from "@/components/LineGraph";
import { useEffect, useState } from "react";
import { BarGraph } from "../components/BarGraph";
import { useTheme } from "@/context/theme-context";


interface DataPoint {
    [key: string]: any; // Allow for additional properties
}
function Home() {

    const { customers, coupons } = useClient();
    const [months, setMonths] = useState<DataPoint[]>([]);
    const [_coupons, setCoupons] = useState<DataPoint[]>([]);
    const [isDarkMode, setIsDarkMode] = useState(sessionStorage.getItem('theme') === 'dark');
    const { theme } = useTheme();
    useEffect(() => {
        setIsDarkMode(theme === 'dark');
    }, [theme]);
    // console.log(theme)
    const filterMonths = () => {
        const monthCounts = new Array(12).fill(0);
        customers.forEach(customer => {
            const month = new Date(customer.createdAt).getMonth();
            monthCounts[month]++;
        });
        const months = monthCounts.map((month, index) => {
            return {
                month: new Date(0, index).toLocaleString('default', { month: 'short' }),
                customers: month,
            }
        })
        setMonths(months);
    }
    const filterCoupons = () => {
        const couponCounts = new Array(12).fill(0);
        coupons.forEach(coupon => {
            const month = new Date(coupon.createdAt).getMonth();
            couponCounts[month]++;
        });
        const monthCoupons = couponCounts.map((month, index) => {
            return {
                month: new Date(0, index).toLocaleString('default', { month: 'short' }),
                coupons: month,
            }
        })
        setCoupons(monthCoupons);
    }
    useEffect(() => {
        filterMonths();
        filterCoupons();
    }, [customers, coupons]);

    // Series configuration
    const lineSeriesConfig = [
        {
            label: 'Customers',
            dataKey: 'customers',
            borderColor: '#7c3aed',
            backgroundColor: 'rgba(124, 58, 237, 0.1)',
            fill: true
        },
    ];
    const barSeriesConfig = [
        {
            label: 'Coupons',
            dataKey: 'coupons',
            borderColor: '#92BFFF',
            backgroundColor: '#92BFFE',
            hoverBackgroundColor: '#92BFFF',
            fill: true
        },
    ];


    return (
        <div className="min-h-screen bg-background rounded-full">

            {/* Main Content */}
            <main className='rounded-full'>


                {/* Page Content */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8 rounded-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                        <h1 className="text-2xl font-bold">Overview</h1>
                        {/* <Button variant="outline">Today</Button> */}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
                        {[
                            { label: 'Customers', value: customers.length, trend: '+15.8%', bg: '--home-card-background-1' },
                            { label: 'Reviews', value: customers.filter(customer => customer.reviewImage != '').length, trend: '-8.5%', bg: '--home-card-background-2' },
                            { label: 'Coupons', value: coupons.length, trend: '+28.6%', bg: '--home-card-background-1' },
                            { label: 'Active Subscribers', value: "123", trend: '+4.3%', bg: '--home-card-background-2' },
                        ].map((stat, index) => (
                            <Card key={index} className={cn("p-5 sm:p-6 shadow-none", "bg-gradient-to-r from-[#d5d6eb] to-[#998ade]")}>

                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-black">{stat.label}</p>
                                        <h3 className="text-xl sm:text-2xl font-bold mt-1 text-black">{stat.value}</h3>
                                    </div>
                                    <span className={`text-sm ${stat.trend.startsWith('+') ? 'text-green-800' : 'text-red-700'}`}>
                                        {stat.trend}
                                    </span>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Charts Section */}
                    <div className="w-full mb-6">


                        {months.length > 0 && <LineGraph
                            data={months}
                            xAxisKey="month"
                            series={lineSeriesConfig}
                            title="Company Performance Metrics"
                            height="400px"
                            darkMode={isDarkMode}
                        />}
                    </div>

                    <BarGraph
                        data={_coupons}
                        xAxisKey="month"
                        series={barSeriesConfig}
                        title="Company Performance Metrics"
                        height="400px"
                        darkMode={isDarkMode}
                    />
                </div>
            </main>
        </div >
    );
}

export default Home;