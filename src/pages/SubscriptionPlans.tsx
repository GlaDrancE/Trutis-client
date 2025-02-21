import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createProducts } from '../../../services/api';
import { useNavigate } from "react-router-dom";


const SubscriptionPlans = () => {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [plans, setPlans] = useState<any[]>([]);
    const navigate = useNavigate();

    const getPlans = async () => {
        try {
            const response = await createProducts();
            if (response.status === 200) {
                setPlans(response.data.products);
                console.log(response.data)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePlanSelection = (plan: any) => {
        setSelectedPlan(plan.default_price);
        navigate(`/payment`, { state: { plan } });
    };

    useEffect(() => {
        getPlans();
    }, []);

    if (plans.length === 0) {
        return <div className="text-center text-gray-600 mt-20">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Choose Your Subscription Plan
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Select the perfect plan for your restaurant's needs. Upgrade or downgrade anytime.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map(({ product, price }) => (
                        <Card
                            key={product.id}
                            className={`relative transition-all duration-200 border hover:border-blue-300 hover:shadow-md`}
                        >
                            <CardHeader className="text-center">
                                <img src={product.images[0]} alt={product.name} className="w-20 h-20 mx-auto mb-4" />
                                <CardTitle className="text-2xl font-bold text-gray-900">
                                    {product.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-gray-900">{`₹${price}`}</span>
                                    <span className="text-gray-600">/month</span>
                                </div>
                                <p className="text-gray-600 mb-4">{product.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    onClick={() => handlePlanSelection({ name: product.name, price, description: product.description, default_price: product.default_price })}
                                >
                                    {selectedPlan === product.default_price ? 'Selected' : 'Choose Plan'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <div className="text-center mt-12 text-gray-600">
                    <p>All plans include a 7-day free trial.</p>
                    <p className="mt-2">Need a custom plan? <Link to="/contact" className="text-blue-600 cursor-pointer hover:underline">Contact us</Link></p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlans;
