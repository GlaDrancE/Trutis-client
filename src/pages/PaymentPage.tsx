import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { createCheckoutSession, portalSession, verifyPaymentAndStore } from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import useClient from '../hooks/client-hook';
import { CreditCard, CheckCircle2, AlertCircle, ArrowRight, Settings, Home } from 'lucide-react';

const ProductDisplay = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const plan = location.state?.plan || { 
    name: 'Unknown Plan', 
    price: 0, 
    description: 'No description available.' 
  };
  const { client } = useClient();

  const handleCheckout = async () => {
    if (!plan.default_price) return;

    setLoading(true);
    setError('');

    try {
      const response = await createCheckoutSession(plan.default_price, client?.id as string);
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        setError('Failed to create payment session. Please try again.');
      }
    } catch (err) {
      console.error('Error creating checkout session', err);
      setError('Error creating checkout session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[90vh] bg-background flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <div className="dark:bg-gray-200 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <CreditCard className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold">Complete Your Purchase</h2>
            </div>
            <p className="text-blue-100">You're just one step away from accessing all features</p>
          </div>
          
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>

              <div className="space-y-3">
                {plan.description.split('. ').map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold 
                         hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2
                         disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessDisplay = ({ sessionId, customerId }: { sessionId: string; customerId: string }) => {
  const [manageSubscriptionUrl, setManageSubscriptionUrl] = useState('');
  const [clientId, setClientId] = useState('');

  const handleManageSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await portalSession(customerId);
      if (response.data.url) {
        window.location.href = response.data.url;
        toast.success('Redirecting to subscription management page...');
      } else {
        toast.error('Failed to create portal session. Please try again.');
      }
    } catch (error) {
      console.error('Error creating portal session', error);
      toast.error('Error creating portal session. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Toaster />
      <div className="max-w-xl w-full">
        <div className="bg-white dark:bg-gray-100 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-white text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/10 rounded-full p-4">
                <CheckCircle2 className="w-12 h-12" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2">Payment Successful! 🎉</h2>
            <p className="text-green-100">Your subscription has been activated successfully</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleManageSubscription} method="POST" className="space-y-6">
              <input type="hidden" id="session-id" name="session_id" value={sessionId} />
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white py-4 px-6 rounded-xl 
                           hover:bg-blue-700 transition-all duration-300"
                >
                  <Settings className="w-5 h-5" />
                  Manage Subscription
                </button>
                
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-gray-800 text-white py-4 px-6 rounded-xl 
                           hover:bg-gray-900 transition-all duration-300"
                  onClick={() => window.location.href = `/${clientId}`}
                >
                  <Home className="w-5 h-5" />
                  Go to Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const Message = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-6">
    <div className="max-w-xl w-full">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 rounded-full p-4">
              <AlertCircle className="w-12 h-12" />
            </div>
          </div>
          <h2 className="text-3xl font-bold">Notice</h2>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-gray-600 text-lg">{message}</p>
        </div>
      </div>
    </div>
  </div>
);

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    const successParam = searchParams.get('success');

    if (successParam && session_id && !verified) {
      verifyPayment(session_id);
    } else if (searchParams.get('cancel')) {
      setSuccess(false);
      setMessage('Order canceled -- continue to shop around and checkout when you\'re ready.');
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const verifyPayment = async (session_id: string) => {
    try {
      if (!verified) {
        const response = await verifyPaymentAndStore(session_id);
        if (response.data.success) {
          setVerified(true);
          setSuccess(true);
          setSessionId(session_id);
          setCustomerId(response.data.customerId);
        } else {
          setMessage('Payment verification failed. Please contact support.');
        }
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setMessage('Error verifying payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!success && message === '') {
    return <ProductDisplay />;
  } else if (success && sessionId !== '') {
    return <SuccessDisplay sessionId={sessionId} customerId={customerId} />;
  } else {
    return <Message message={message} />;
  }
};

export default PaymentPage;