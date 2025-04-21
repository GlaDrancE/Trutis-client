import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyRazorpayPayment } from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle2, AlertCircle, Home } from 'lucide-react';

const SuccessDisplay = ({ orderId, clientId }: { orderId: string; clientId: string }) => {
  return (
    <div className="h-[90vh] bg-background flex items-center justify-center p-6">
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
            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-gray-800 text-white py-4 px-6 rounded-xl 
                         hover:bg-gray-900 transition-all duration-300 w-full"
              onClick={() => (window.location.href = `/${clientId}`)}
            >
              <Home className="w-5 h-5" />
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Message = ({ message }: { message: string }) => (
  <div className="h-[90vh] bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-6">
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
  const [orderId, setOrderId] = useState('');
  const [clientId, setClientId] = useState('');
  const [loading, setLoading] = useState(true);
  const hasVerified = useRef(false);

  useEffect(() => {
    const order_id = searchParams.get('order_id');
    const successParam = searchParams.get('success');
    const client_id = searchParams.get('client_id');
    const razorpay_payment_id = searchParams.get('razorpay_payment_id');
    const razorpay_signature = searchParams.get('razorpay_signature');

    if (!hasVerified.current && successParam === 'true' && order_id && client_id && razorpay_payment_id && razorpay_signature) {
      console.log("zala verify")
      verifyPayment(order_id, razorpay_payment_id, razorpay_signature);
      setClientId(client_id);
      hasVerified.current = true;
    } else if (successParam === 'false' || searchParams.get('cancel')) {
      setSuccess(false);
      setMessage('Payment canceled or failed. Please try again.');
      setLoading(false);
    } else {
      setLoading(false);
      setMessage('Invalid payment state. Please try again.');
    }

    return () => {
      hasVerified.current = false;
    };
  }, [searchParams]);

  const verifyPayment = async (order_id: string, razorpay_payment_id: string, razorpay_signature: string) => {
    try {
      const response = await verifyRazorpayPayment({
        order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      if (response.data.success) {
        setSuccess(true);
        setOrderId(order_id);
      } else {
        setSuccess(false);
        setMessage('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setSuccess(false);
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

  if (success && orderId) {
    return <SuccessDisplay orderId={orderId} clientId={clientId} />;
  } else {
    return <Message message={message} />;
  }
};

export default PaymentPage;