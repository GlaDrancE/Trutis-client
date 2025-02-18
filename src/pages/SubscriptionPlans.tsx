import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createProducts } from '../../../services/api';

const SubscriptionPlans = () => {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [plans, setPlans] = useState<any[]>([]);

    const getPlans = async () => {
        try {
            const response = await createProducts();
            console.log(response.data);
            if (response.status === 200) {
                setPlans(response.data.products);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getPlans();
    }, []);
    if (plans.length === 0) {
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Choose Your Subscription Plan
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Select the perfect plan for your restaurant's needs. Upgrade or downgrade anytime.
                    </p>
                </div>

                {/* Plans */}
                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <Card
                            key={plan.id}
                            className={`relative transition-all duration-200 ${plan.popular
                                ? 'border-blue-500 shadow-lg scale-105'
                                : 'hover:border-blue-300 hover:shadow-md'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <CardHeader className="text-center">
                                <div className="flex justify-center mb-4">{plan.icon}</div>
                                <CardTitle className="text-2xl font-bold text-gray-900">
                                    {plan.name}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="text-center">
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                                    <span className="text-gray-600">/{plan.period}</span>
                                </div>

                                <ul className="space-y-3 text-left">
                                    {/* {plan.features.map((feature: string, index: number) => (
                                        <li key={index} className="flex items-start">
                                            <Check className="h-5 w-5 text-blue-500 mr-2 shrink-0 mt-0.5" />
                                            <span className="text-gray-600">{feature}</span>
                                        </li>
                                    ))} */}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    className={`w-full bg-blue-600 hover:bg-blue-700`}
                                    onClick={() => setSelectedPlan(plan.id)}
                                >
                                    {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="text-center mt-12 text-gray-600">
                    <p>All plans include a 14-day free trial.</p>
                    <p className="mt-2">Need a custom plan? <Link to="/contact" className="text-blue-600 cursor-pointer hover:underline">Contact us</Link></p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlans;