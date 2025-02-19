import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { createCheckoutSession, portalSession, verifyPaymentAndStore } from '../../../services/api'
import toast, { Toaster } from "react-hot-toast";


const ProductDisplay = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const location = useLocation();
    const plan = location.state?.plan || { name: "Unknown Plan", price: 0, description: "No description available." };

    const handleCheckout = async () => {
        if (!plan.default_price) return;

        setLoading(true);
        setError("");

        try {
            const clientId = localStorage.getItem("clientId") as string;

            const response = await createCheckoutSession(plan.default_price, clientId);
            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                setError("Failed to create payment session. Please try again.");
            }
        } catch (err) {
            console.error("Error creating checkout session", err);
            setError("Error creating checkout session. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-2xl p-6 max-w-lg w-full text-center border border-gray-200">
                <div className="flex justify-center mb-4">
                    <Logo />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">{plan.name}</h3>
                <h5 className="text-xl text-blue-600 font-bold mt-2">₹{plan.price} / month</h5>
                <p className="text-gray-600 mt-4">{plan.description}</p>
                {error && <p className="text-red-500 mt-3">{error}</p>}
                <button
                    className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
                    onClick={handleCheckout}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Proceed to Checkout"}
                </button>
            </div>
        </section>
    );
};



const SuccessDisplay = ({ sessionId }: { sessionId: string }) => {
    const handleManageSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await portalSession(sessionId);
            if (response.data.url) {
                window.location.href = response.data.url;
                toast.success("Redirecting to subscription management page...");
            } else {
                toast.error("Failed to create portal session. Please try again.");
            }
        } catch (error) {
            console.error("Error creating portal session", error);
            toast.error("Error creating portal session. Please try again.");
        }
    }
    return (
        <section className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-6">
            <Toaster />
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full text-center border border-gray-200">
                <div className="flex justify-center mb-4">
                    <Logo />
                </div>
                <h3 className="text-3xl font-semibold text-green-700">Payment Successful! 🎉</h3>
                <p className="text-gray-600 mt-4">Your subscription is now active.</p>
                <form onSubmit={handleManageSubscription} method="POST" className="mt-6">
                    <input type="hidden" id="session-id" name="session_id" value={sessionId} />
                    <button className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
                        Manage Your Subscription
                    </button>
                </form>
            </div>
        </section>
    );
};


const Message = ({ message }: { message: string }) => (
    <section className="flex flex-col items-center justify-center min-h-screen p-6 bg-yellow-100">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full text-center border border-gray-200">
            <h3 className="text-2xl font-semibold text-yellow-700">Notice</h3>
            <p className="text-gray-600 mt-4">{message}</p>
        </div>
    </section>
);



const Logo = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="14px"
        height="16px"
        viewBox="0 0 14 16"
        version="1.1"
    >
        <defs />
        <g id="Flow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g
                id="0-Default"
                transform="translate(-121.000000, -40.000000)"
                fill="#E184DF"
            >
                <path
                    d="M127,50 L126,50 C123.238576,50 121,47.7614237 121,45 C121,42.2385763 123.238576,40 126,40 L135,40 L135,56 L133,56 L133,42 L129,42 L129,56 L127,56 L127,50 Z M127,48 L127,42 L126,42 C124.343146,42 123,43.3431458 123,45 C123,46.6568542 124.343146,48 126,48 L127,48 Z"
                    id="Pilcrow"
                />
            </g>
        </g>
    </svg>
);


const PaymentPage = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session_id = searchParams.get("session_id");
        const successParam = searchParams.get("success");

        if (successParam && session_id) {

            verifyPayment(session_id);
        } else if (searchParams.get("cancel")) {
            setSuccess(false);
            setMessage("Order canceled -- continue to shop around and checkout when you're ready.");
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [searchParams]);

    const verifyPayment = async (session_id: string) => {
        try {
            const response = await verifyPaymentAndStore(session_id);

            if (response.data.success) {
                setSuccess(true);
                setSessionId(session_id);
            } else {
                setMessage("Payment verification failed. Please contact support.");
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            setMessage("Error verifying payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!success && message === '') {
        return <ProductDisplay />;
    } else if (success && sessionId !== '') {
        return <SuccessDisplay sessionId={sessionId} />;
    } else {
        return <Message message={message} />;
    }
};


export default PaymentPage;