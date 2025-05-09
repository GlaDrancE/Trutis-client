import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSubscriptionPlans, createRazorpayOrder, createRazorpaySubscription, fetchSubscription } from '../../services/api';
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
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import useClient from '@/hooks/client-hook';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface AddonProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: React.ReactNode;
  type: 'immediate' | 'service';
}

interface Product {
  id: string;
  name: string;
  description: string;
  default_price: string;
}

interface Plan {
  product: Product;
  price: number;
  duration: number;
}

const SubscriptionPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [razorpayLoaded, setRazorpayLoaded] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const { client } = useClient();

  const immediateAddons: AddonProduct[] = [
    {
      id: 'qr-basic',
      name: 'QR Stand Basic',
      price: 499,
      description: 'Sturdy basic QR stand for your restaurant',
      icon: <QrCode className="text-black w-6 h-6" />,
      type: 'immediate',
    },
    {
      id: 'qr-premium',
      name: 'QR Stand Premium',
      price: 999,
      description: 'Premium quality QR stand with enhanced durability',
      icon: <Star className="text-black w-6 h-6" />,
      type: 'immediate',
    },
    {
      id: 'creative-qr',
      name: 'Creative QR Pack',
      price: 1499,
      description: 'Choose from various creative QR design packs',
      icon: <Palette className="text-black w-6 h-6" />,
      type: 'immediate',
    },
    {
      id: 'qr-stickers',
      name: 'Small QR Stickers',
      price: 299,
      description: 'Pack of 50 small QR code stickers',
      icon: <Sparkles className="text-black w-6 h-6" />,
      type: 'immediate',
    },
  ];

  const serviceAddons: AddonProduct[] = [
    {
      id: 'custom-qr',
      name: 'Custom QR Designs',
      price: 0,
      description: 'Get unique, custom-designed QR codes for your brand',
      icon: <Palette className="text-black w-6 h-6" />,
      type: 'service',
    },
    {
      id: 'premium-frontend',
      name: 'Premium Front-end',
      price: 0,
      description: 'Custom front-end development for your digital menu',
      icon: <Globe className="text-black w-6 h-6" />,
      type: 'service',
    },
    {
      id: 'email-templates',
      name: 'Premium Email Templates',
      price: 0,
      description: 'Custom-designed email templates for your campaigns',
      icon: <Mail className="text-black w-6 h-6" />,
      type: 'service',
    },
    {
      id: 'website-dev',
      name: 'Website Development',
      price: 0,
      description: 'Full-scale website development services',
      icon: <Globe className="text-black w-6 h-6" />,
      type: 'service',
    },
    {
      id: 'graphic-design',
      name: 'Graphic Design Services',
      price: 0,
      description: 'Professional graphic design services',
      icon: <Paintbrush className="text-black w-6 h-6" />,
      type: 'service',
    },
  ];

  const getPlans = async () => {
    try {
      if (id) {
        const response = await getSubscriptionPlans(id);
        if (response.status === 200) {
          const sortedPlans = response.data.products.sort(
            (a: Plan, b: Plan) => a.duration - b.duration
          );
          setPlans(sortedPlans);
        }
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load plans. Please try again.');
    }
  };

  const getCurrentSubscription = async () => {
    const response = await fetchSubscription(id || '');
    if (response.status === 200) {
      setCurrentSubscription(response.data);
    }
  }

  const handlePlanSelection = async (plan: { name: string; price: number; description: string; default_price: string }, duration: number) => {
    setSelectedPlan(plan.default_price);
    console.log(plan);
    try {
      if (!razorpayLoaded) {
        toast.error('Payment gateway not loaded. Please try again.');
        return;
      }

      const addonTotal = immediateAddons
        .filter(addon => selectedAddons.includes(addon.id))
        .reduce((sum, addon) => sum + addon.price, 0);

      const response = await createRazorpayOrder({
        amount: ((plan.price + addonTotal) * 100),
        currency: 'INR',
        receipt: `receipt_${id}_${Date.now()}`,
        clientId: id || '',
      });

      if (response.data.order) {
        const order = response.data.order;
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'Entugo',
          description: `Subscription: ${plan.name}`,
          order_id: order.id,
          handler: function (response: any) {
            toast.success('Payment successful!');
            window.location.href = `/${id}/payment?success=true&order_id=${order.id}&client_id=${id}&razorpay_payment_id=${response.razorpay_payment_id}&razorpay_signature=${response.razorpay_signature}`;
          },
          notes: {
            client_id: id,
            plan_id: plan.default_price,
            addons: JSON.stringify(selectedAddons),
            duration: duration.toString(),
          },
          theme: {
            color: '#4c29ff',
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response: any) {
          toast.error('Payment failed. Please try again.');
          console.error('Payment failed:', response.error);
        });
        rzp1.open();
      } else {
        toast.error('Failed to create payment order. Please try again.');
      }
    } catch (error: any) {
      console.error('Error initiating payment:', error);
      toast.error(error.response.data.message || 'Error initiating payment. Please try again.');
    }
  };
  const handleSubscriptionSelection = async (plan: { name: string; price: number; description: string; id: string }, duration: number) => {
    try {
      if (!razorpayLoaded) {
        toast.error('Payment gateway not loaded. Please try again.');
        return;
      }
      // const addonTotal = immediateAddons.filter(addon => selectedAddons.includes(addon.id)).reduce((sum, addon) => sum + addon.price, 0);
      const response = await createRazorpaySubscription({
        plan: plan,
        clientId: id || '',
        client_email: client?.email || ''
      });


      if (response.data) {
        const subscription = response.data;
        // await navigator.clipboard.writeText(JSON.stringify(subscription));
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: subscription.amount,
          currency: subscription.currency,
          name: 'Entugo',
          description: `Subscription: ${plan.name}`,
          subscription_id: subscription.id,
          handler: function (response: any) {
            toast.success('Payment successful!');
            window.location.href = `/${id}/payment?success=true&subscription_id=${subscription.id}&client_id=${id}&razorpay_payment_id=${response.razorpay_payment_id}&razorpay_signature=${response.razorpay_signature}`;
          },
          notes: {
            client_id: id,
            plan_id: plan.id,
            addons: JSON.stringify(selectedAddons),
            duration: duration.toString(),
          },
          theme: {
            color: '#4c29ff',
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response: any) {
          toast.error('Payment failed. Please try again.');
          console.error('Payment failed:', response.error);
        });
        rzp1.open();
      } else {
        toast.error('Failed to create payment order. Please try again.');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Error initiating payment. Please try again.');
    }
  }

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );
  };

  useEffect(() => {
    getPlans().then(() => console.log('Plans:', plans));
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      toast.error('Failed to load payment gateway. Please try again.');
      setRazorpayLoaded(false);
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (plans.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const planIcons = [Shield, Zap, Crown];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-clip-text mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Select a plan that works best for your business and customize it with powerful add-ons
          </p>
        </div>

        <div className="mb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map(({ product, price, duration }, index) => {
              const Icon = planIcons[index % planIcons.length];
              const prices = calculatePrice(price, duration || 1);
              return (
                <div
                  key={product.id}
                  className={`
                    relative ${index == 1 ? `bg-premium text-white` : 'bg-whitebackground text-black dark:text-white'} rounded-2xl transition-all duration-300 transform
                    ${selectedPlan === product.default_price
                      ? 'ring-4 shadow-2xl scale-105'
                      : 'hover:shadow-xl hover:scale-102 border dark:border-gray-100'
                    }
                  `}
                >
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-foreground text-whitebackground px-4 py-1 rounded-full text-sm font-medium">
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
                          {duration === 1 ? '1 Month Plan' : duration === 6 ? '6 Months Plan' : '12 Months Plan'}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">₹{prices.monthly}</span>
                        <span>/month</span>
                      </div>
                      <p className="text-sm mt-2">
                        {duration > 1
                          ? `Total: ₹${prices.total} for ${duration} months`
                          : 'Billed monthly'}
                      </p>
                    </div>

                    <div className="space-y-4 mb-8">
                      {product.description.split('. ').map((feature: string, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className={`w-5 h-5 ${index == 1 ? 'text-white' : 'text-green-500'} flex-shrink-0`} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        handlePlanSelection({
                          name: product.name,
                          price: price,
                          description: product.description,
                          default_price: product.id,
                        },
                          duration || 1)

                      }
                      className={`
                        w-full py-4 rounded-xl font-semibold transition-all duration-300  ${index == 1 ? `bg-whitebackground text-black dark:text-white` : 'bg-premium text-white'}  
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

        <div className="space-y-16">
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Enhance Your Experience</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {immediateAddons.map(addon => (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`
                    cursor-pointer rounded-xl p-6 transition-all duration-300 transform
                    ${selectedAddons.includes(addon.id)
                      ? 'bg-background border-2 border-blue-500 shadow-lg scale-105'
                      : 'bg-background border dark:border-gray-200 hover:border-blue-200 hover:shadow'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-blue-50">{addon.icon}</div>
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

          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Professional Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceAddons.map(addon => (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`
                    cursor-pointer rounded-xl p-6 transition-all duration-300 transform
                    ${selectedAddons.includes(addon.id)
                      ? 'bg-background border-2 border-blue-500 shadow-lg scale-105'
                      : 'bg-background border dark:border-gray-200 hover:border-blue-200 hover:shadow'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-blue-50">{addon.icon}</div>
                    <div className="flex items-center gap-2 bg-background px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="dark:text-white text-sm">Quote Required</span>
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
          <p className="text-lg">All plans include a 7-day free trial. No credit card required.</p>
          <p>
            Need help choosing?{' '}
            <Link to="/contact" className="text-blue-600 hover:underline font-medium">
              Talk to our experts
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const calculatePrice = (basePrice: number, duration: number) => {
  console.log(basePrice, duration);
  const monthlyPrice = basePrice / duration;

  return {
    monthly: monthlyPrice.toFixed(0),
    total: basePrice.toFixed(0),
  };
};

export default SubscriptionPlans;