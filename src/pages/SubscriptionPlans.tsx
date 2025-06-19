import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { createProducts } from "../../services/api";
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
  Crown,
} from "lucide-react";

interface AddonProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: React.ReactNode;
  type: "immediate" | "service";
}

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const immediateAddons: AddonProduct[] = [
    {
      id: "qr-basic",
      name: "QR Stand Basic",
      price: 499,
      description: "Simple, durable QR stand — great for tabletops or counters",
      icon: <QrCode className="text-black w-6 h-6" />,
      type: "immediate",
    },
    {
      id: "qr-premium",
      name: "QR Stand Premium",
      price: 999,
      description: "Heavy-duty stand with sleek finish for high-traffic areas",
      icon: <Star className="text-black w-6 h-6" />,
      type: "immediate",
    },
    {
      id: "creative-qr",
      name: "Creative QR Pack",
      price: 1499,
      description: "Choose fun, themed QR codes that grab attention instantly",
      icon: <Palette className="text-black w-6 h-6" />,
      type: "immediate",
    },
    {
      id: "qr-stickers",
      name: "Small QR Stickers",
      price: 299,
      description: "50 compact QR stickers — perfect for takeout bags or packaging",
      icon: <Sparkles className="text-black w-6 h-6" />,
      type: "immediate",
    },
  ];

  const serviceAddons: AddonProduct[] = [
    {
      id: "custom-qr",
      name: "Custom QR Designs",
      price: 0,
      description: "Fully customized QR codes that match your logo, theme, or vibe",
      icon: <Palette className="text-black w-6 h-6" />,
      type: "service",
    },
    {
      id: "premium-frontend",
      name: "Premium Front-end",
      price: 0,
      description: "Tailored website front-end for menu, offers, and reviews",
      icon: <Globe className="text-black w-6 h-6" />,
      type: "service",
    },
    {
      id: "email-templates",
      name: "Premium Email Templates",
      price: 0,
      description: "Branded email templates for marketing, events, and promotions",
      icon: <Mail className="text-black w-6 h-6" />,
      type: "service",
    },
    {
      id: "website-dev",
      name: "Website Development",
      price: 0,
      description: "Professional website creation — from menus to online ordering",
      icon: <Globe className="text-black w-6 h-6" />,
      type: "service",
    },
    {
      id: "graphic-design",
      name: "Graphic Design Services",
      price: 0,
      description: "Logos, menus, posters — designed by experts to match your brand",
      icon: <Paintbrush className="text-black w-6 h-6" />,
      type: "service",
    },
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
        addons: selectedAddons,
      },
    });
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
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

  const planDurations = [1, 6, 12];

  const calculatePrice = (basePrice: number, duration: number) => {
    const discount = duration === 6 ? 10 : duration === 12 ? 20 : 0; // 10% for 6 months, 20% for 12 months
    const monthlyPrice = basePrice * (1 - discount / 100);
    return {
      monthly: monthlyPrice.toFixed(0),
      total: (monthlyPrice * duration).toFixed(0),
    };
  };

  const planIcons = [Shield, Zap, Crown];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-clip-text mb-6">
            Pick a Plan That Fits Your Flow
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Affordable, flexible, and packed with perks—no surprises, just
            growth.
          </p>
        </div>

        {/* Plans Section (Removed Duration Selection) */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map(({ product, price }, index) => {
              const Icon = planIcons[index];
              const duration = planDurations[index];
              const prices = calculatePrice(price, duration);
              return (
                <div
                  key={product.id}
                  className={`
                    relative bg-background rounded-2xl transition-all duration-300 transform
                    ${
                      selectedPlan === product.default_price
                        ? "ring-4 ring-blue-400 shadow-2xl scale-105"
                        : "hover:shadow-xl hover:scale-102 border border-gray-100"
                    }
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
                        <Icon className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{product.name}</h3>
                        <p className="text-sm">
                          {duration === 1
                            ? "1 Month Plan"
                            : duration === 6
                            ? "6 Months Plan"
                            : "12 Months Plan"}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">
                          ₹{prices.monthly}
                        </span>
                        <span>/month</span>
                      </div>
                      <p className="text-sm mt-2">
                        {duration > 1
                          ? `₹${prices.total} billed every ${duration} months`
                          : "Billed monthly"}
                      </p>
                    </div>

                    <div className="space-y-4 mb-8">
                      {product.description
                        .split(". ")
                        .map((feature: string, i: number) => (
                          <div key={i} className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                    </div>

                    <button
                      onClick={() =>
                        handlePlanSelection({
                          name: product.name,
                          price: prices.monthly,
                          description: product.description,
                          default_price: product.default_price,
                        })
                      }
                      className={`
                        w-full py-4 rounded-xl font-semibold transition-all duration-300
                        ${
                          selectedPlan === product.default_price
                            ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-900"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-900"
                        }
                        `}
                    >
                      {selectedPlan === product.default_price
                        ? "Selected"
                        : "Get Started"}
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
                    ${
                      selectedAddons.includes(addon.id)
                        ? "bg-background border-2 border-blue-500 shadow-lg scale-105"
                        : "bg-background border border-gray-200 hover:border-blue-200 hover:shadow"
                    }
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
                  <p className="text-sm mb-4">{addon.description}</p>
                  <p className="text-lg font-bold">₹{addon.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Service Add-ons */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">
              Get Expert Help from the Entugo Team
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceAddons.map((addon) => (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`
                    cursor-pointer rounded-xl p-6 transition-all duration-300 transform
                    ${
                      selectedAddons.includes(addon.id)
                        ? "bg-background border-2 border-blue-500 shadow-lg scale-105"
                        : "bg-background border border-gray-200 hover:border-blue-200 hover:shadow"
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-blue-50">
                      {addon.icon}
                    </div>
                    <div className="flex items-center gap-2 bg-background px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="dark:text-white text-sm">
                        Quote Required
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{addon.name}</h3>
                  <p className="text-sm">{addon.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-16 space-y-4">
          <p className="text-lg">
            All plans include a 7-day free trial. No credit card required.
          </p>
          <p>
            Need help choosing?{" "}
            <Link
              to="/contact"
              className="text-blue-600 hover:underline font-medium"
            >
              Talk to our experts
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
