import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Search,
    QrCode,
    Calendar,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '@/layout/Layout';
import { getClient } from '../../../services/api';
import toast from 'react-hot-toast';
import { Client } from '../../../types';


interface Coupon {
    id: number;
    code: string;
    isValid: boolean;
    created: string;
    expires: string;
    qrData: string;
}

const HomePage: React.FC = () => {
    const [searchTerm, setSearchTerm] = React.useState<string>('');
    const [client, setClient] = React.useState<Client>();
    const navigate = useNavigate();
    const { client_id } = useParams();


    const coupons: Coupon[] = [
        {
            id: 1,
            code: 'SUMMER2024',
            isValid: true,
            created: '2024-02-01',
            expires: '2024-08-01',
            qrData: 'https://example.com/qr/1'
        },
        {
            id: 2,
            code: 'WINTER2023',
            isValid: false,
            created: '2023-12-01',
            expires: '2024-01-31',
            qrData: 'https://example.com/qr/2'
        },
    ];

    const filteredCoupons = coupons.filter(coupon =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const loadClient = async () => {
        try {
            if (!client_id) {
                console.log("Failed to load client")
                return (<>Failed to load client</>)
            }

            const client = await getClient(client_id)
            if (client && client.status != 200) {
                console.log(client)
                return (<>Failed to load client</>)
            }
            setClient(client.data)

        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        }

    }

    useEffect(() => {
        loadClient();
    }, [])


    const handleQRClick = (id: number): void => {
        navigate(`/customer-details/${id}`);
    };

    return (
        <DashboardLayout>
            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search coupons..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* QR Code and Coupons Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* QR Codes Section */}
                <Card className="md:col-span-2 lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <QrCode className="text-blue-600" size={20} />
                            Shop QR Code
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <div
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleQRClick(1)}
                        >
                            <img
                                src="/api/placeholder/200/200"
                                alt="QR Code"
                                className="rounded-lg"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Coupons List */}
                <Card className="md:col-span-2 lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Active Coupons</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {filteredCoupons.map((coupon) => (
                            <div
                                key={coupon.id}
                                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">{coupon.code}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                            <Calendar size={16} />
                                            <span>Created: {coupon.created}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                            <Calendar size={16} />
                                            <span>Expires: {coupon.expires}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${coupon.isValid
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {coupon.isValid ? 'Valid' : 'Expired'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};
export default HomePage