import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { createProducts } from '../../services/api';
import {
    QrCode,
    Palette,
    Mail,
    Globe,
    Paintbrush,
    Star,
    Clock,
    CheckCircle2,
    Sparkles,
    Shield,
    Zap,
    Crown
} from 'lucide-react';

interface AddonProduct {
    id: string;
    name: string;
    price: number;
    description: string;
    icon: React.ReactNode;
    type: 'immediate' | 'service';
}

const SubscriptionPlans = () => {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<number>(1);
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const { id } = useParams();
    const navigate = useNavigate();

    const durations = [
        { months: 1, discount: 0 },
        { months: 6, discount: 10 },
        { months: 12, discount: 20 },
    ];

    const immediateAddons: AddonProduct[] = [
        {
            id: 'qr-basic',
            name: 'QR Stand Basic',
            price: 499,
            description: 'Sturdy basic QR stand for your restaurant',
            icon: <QrCode className="text-black w-6 h-6" />,
            type: 'immediate'
        },
        {
            id: 'qr-premium',
            name: 'QR Stand Premium',
            price: 999,
            description: 'Premium quality QR stand with enhanced durability',
            icon: <Star className="text-black w-6 h-6" />,
            type: 'immediate'
        },
        {
            id: 'creative-qr',
            name: 'Creative QR Pack',
            price: 1499,
            description: 'Choose from various creative QR design packs',
            icon: <Palette className="text-black w-6 h-6" />,
            type: 'immediate'
        },
        {
            id: 'qr-stickers',
            name: 'Small QR Stickers',
            price: 299,
            description: 'Pack of 50 small QR code stickers',
            icon: <Sparkles className="text-black w-6 h-6" />,
            type: 'immediate'
        }
    ];

    const serviceAddons: AddonProduct[] = [
        {
            id: 'custom-qr',
            name: 'Custom QR Designs',
            price: 0,
            description: 'Get unique, custom-designed QR codes for your brand',
            icon: <Palette className="text-black w-6 h-6" />,
            type: 'service'
        },
        {
            id: 'premium-frontend',
            name: 'Premium Front-end',
            price: 0,
            description: 'Custom front-end development for your digital menu',
            icon: <Globe className="text-black w-6 h-6" />,
            type: 'service'
        },
        {
            id: 'email-templates',
            name: 'Premium Email Templates',
            price: 0,
            description: 'Custom-designed email templates for your campaigns',
            icon: <Mail className="text-black w-6 h-6" />,
            type: 'service'
        },
        {
            id: 'website-dev',
            name: 'Website Development',
            price: 0,
            description: 'Full-scale website development services',
            icon: <Globe className="text-black w-6 h-6" />,
            type: 'service'
        },
        {
            id: 'graphic-design',
            name: 'Graphic Design Services',
            price: 0,
            description: 'Professional graphic design services',
            icon: <Paintbrush className="text-black w-6 h-6" />,
            type: 'service'
        }
    ];

    const getPlans = async () => {
        try {
            if (id) {
                const response = await createProducts(id);
                if (response.status === 200) {
                    setPlans(response.data.products);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlePlanSelection = (plan: any) => {
        setSelectedPlan(plan.default_price);
        navigate(`/${id}/payment`, {
            state: {
                plan,
                duration: selectedDuration,
                addons: selectedAddons
            }
        });
    };

    const toggleAddon = (addonId: string) => {
        setSelectedAddons(prev =>
            prev.includes(addonId)
                ? prev.filter(id => id !== addonId)
                : [...prev, addonId]
        );
    };

    useEffect(() => {
        getPlans();
    }, []);

    if (plans.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const calculatePrice = (basePrice: number, duration: number) => {
        const discount = durations.find(d => d.months === duration)?.discount || 0;
        const monthlyPrice = basePrice * (1 - discount / 100);
        return {
            monthly: monthlyPrice.toFixed(0),
            total: (monthlyPrice * duration).toFixed(0)
        };
    };

    const planIcons = [Shield, Zap, Crown];

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold  bg-clip-text  mb-6">
                        Choose Your Perfect Plan
                    </h1>
                    <p className="text-xl max-w-2xl mx-auto">
                        Select a plan that works best for your business and customize it with powerful add-ons
                    </p>
                </div>

                {/* Combined Plans & Duration Selection */}
                <div className="mb-20">
                    <div className="flex justify-center mb-8">
                        {durations.map(({ months, discount }) => (
                            <button
                                key={months}
                                onClick={() => setSelectedDuration(months)}
                                className={`
                  px-8 py-3 text-sm font-medium transition-all
                  ${selectedDuration === months
                                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                                        : 'bg-background  dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'}
                  ${months === 1 ? 'rounded-l-lg' : months === 12 ? 'rounded-r-lg' : ''}
                  border border-blue-100
                `}
                            >
                                {months} Month{months > 1 ? 's' : ''}
                                {discount > 0 && (
                                    <span className="block text-xs mt-1 font-normal opacity-90">Save {discount}%</span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {plans.map(({ product, price }, index) => {
                            const Icon = planIcons[index];
                            const prices = calculatePrice(price, selectedDuration);
                            return (
                                <div
                                    key={product.id}
                                    className={`
                    relative bg-background rounded-2xl transition-all duration-300 transform
                    ${selectedPlan === product.default_price
                                            ? 'ring-4 ring-blue-400 shadow-2xl scale-105'
                                            : 'hover:shadow-xl hover:scale-102 border border-gray-100'}
                  `}
                                >
                                    {index === 1 && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1 rounded-full text-sm text-white font-medium">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-8">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 rounded-xl bg-blue-50">
                                                <Icon className="w-8 h-8 text-blue-600 " />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold ">{product.name}</h3>
                                                <p className="text-sm ">Perfect for growing businesses</p>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-bold ">₹{prices.monthly}</span>
                                                <span>/month</span>
                                            </div>
                                            <p className="text-sm  mt-2">
                                                {selectedDuration > 1 ? `₹${prices.total} billed every ${selectedDuration} months` : 'Billed monthly'}
                                            </p>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            {product.description.split('. ').map((feature: string, i: number) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                    <span className="">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handlePlanSelection({
                                                name: product.name,
                                                price: prices.monthly,
                                                description: product.description,
                                                default_price: product.default_price
                                            })}
                                            className={`
                        w-full py-4 rounded-xl font-semibold transition-all duration-300
                        ${selectedPlan === product.default_price
                                                    ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-900'
                                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-900'}
                      `}
                                        >
                                            {selectedPlan === product.default_price ? 'Selected' : 'Get Started'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Add-ons Sections */}
                <div className="space-y-16">
                    {/* Immediate Add-ons */}
                    <div>
                        <h2 className="text-3xl font-bold mb-8 text-center">
                            Enhance Your Experience
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {immediateAddons.map((addon) => (
                                <div
                                    key={addon.id}
                                    onClick={() => toggleAddon(addon.id)}
                                    className={`
                    cursor-pointer rounded-xl p-6 transition-all duration-300 transform
                    ${selectedAddons.includes(addon.id)
                                            ? 'bg-background border-2 border-blue-500 shadow-lg scale-105'
                                            : 'bg-background border border-gray-200 hover:border-blue-200 hover:shadow'}
                  `}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-xl bg-blue-50">
                                            {addon.icon}
                                        </div>
                                        {selectedAddons.includes(addon.id) && (
                                            <div className="bg-blue-500 p-1 rounded-full">
                                                <CheckCircle2 className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{addon.name}</h3>
                                    <p className=" text-sm mb-4">{addon.description}</p>
                                    <p className="text-lg font-bold">₹{addon.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Service Add-ons */}
                    <div>
                        <h2 className="text-3xl font-bold mb-8 text-center">
                            Professional Services
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {serviceAddons.map((addon) => (
                                <div
                                    key={addon.id}
                                    onClick={() => toggleAddon(addon.id)}
                                    className={`
                    cursor-pointer rounded-xl p-6 transition-all duration-300 transform
                    ${selectedAddons.includes(addon.id)
                                            ? 'bg-background border-2 border-blue-500 shadow-lg scale-105'
                                            : 'bg-background border border-gray-200 hover:border-blue-200 hover:shadow'}
                  `}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-xl bg-blue-50">
                                            {addon.icon}
                                        </div>
                                        <div className="flex items-center gap-2 bg-background px-3 py-1 rounded-full">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                            <span className="dark:text-white text-sm">Quote Required</span>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{addon.name}</h3>
                                    <p className=" text-sm">{addon.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-center mt-16 space-y-4">
                    <p className="text-lg ">
                        All plans include a 7-day free trial. No credit card required.
                    </p>
                    <p className="">
                        Need help choosing? {' '}
                        <Link to="/contact" className="text-blue-600 hover:underline font-medium">
                            Talk to our experts
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlans;