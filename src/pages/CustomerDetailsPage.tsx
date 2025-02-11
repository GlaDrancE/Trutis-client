import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/layout/Layout";
import { ExternalLink } from "lucide-react";
import React from "react";

interface PurchasedItem {
    name: string;
    quantity: number;
    price: string;
}

interface CustomerData {
    name: string;
    email: string;
    phone: string;
    address: string;
    visitDate: string;
    couponUsed: string;
    purchaseAmount: string;
    items: PurchasedItem[];
}
// Customer Details Page Component
const CustomerDetailsPage: React.FC = () => {
    const customerData: CustomerData = {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 234-567-8900",
        address: "123 Main St, City",
        visitDate: "2024-02-09",
        couponUsed: "SUMMER2024",
        purchaseAmount: "$150.00",
        items: [
            { name: "Product 1", quantity: 2, price: "$50.00" },
            { name: "Product 2", quantity: 1, price: "$50.00" },
        ]
    };

    return (
        <DashboardLayout>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Customer Details</span>
                        <ExternalLink className="text-blue-600 cursor-pointer" size={20} />
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium text-gray-500">Personal Information</h3>
                            <div className="mt-2 space-y-2">
                                <p><span className="font-medium">Name:</span> {customerData.name}</p>
                                <p><span className="font-medium">Email:</span> {customerData.email}</p>
                                <p><span className="font-medium">Phone:</span> {customerData.phone}</p>
                                <p><span className="font-medium">Address:</span> {customerData.address}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-500">Visit Information</h3>
                            <div className="mt-2 space-y-2">
                                <p><span className="font-medium">Visit Date:</span> {customerData.visitDate}</p>
                                <p><span className="font-medium">Coupon Used:</span> {customerData.couponUsed}</p>
                                <p><span className="font-medium">Purchase Amount:</span> {customerData.purchaseAmount}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-500 mb-2">Purchased Items</h3>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Item</th>
                                        <th className="px-4 py-2 text-left">Quantity</th>
                                        <th className="px-4 py-2 text-left">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customerData.items.map((item, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="px-4 py-2">{item.name}</td>
                                            <td className="px-4 py-2">{item.quantity}</td>
                                            <td className="px-4 py-2">{item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
};


export default CustomerDetailsPage