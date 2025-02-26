import DashboardLayout from '../layout/Layout';
import React, { useState } from 'react';
import QrReader from 'react-qr-scanner';
import { fetchCustomerFromCoupon } from '../../services/api'

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  dob: string;
}

const CouponScanner: React.FC = () => {
  const [couponCode, setCouponCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const previewStyle = {
    height: 240,
    width: 240,
  };

  const handleScan = async (data: { text: string } | null) => {
    if (data?.text) {
      setCouponCode("1234");
      setIsScanning(false);
      setError('');
      await verifyCoupon("1234");
    }
  };

  const verifyCoupon = async (code: string) => {
    try {
      setIsLoading(true);

      const response = await fetchCustomerFromCoupon(code);

      if (response.data.success) {
        setCustomerDetails(response.data.customer);
      } else {
        setError('Invalid or expired coupon code');
        setCustomerDetails(null);
      }
    } catch (err: any) {
      setError('Error verifying coupon: ' + (err.response?.data?.message || 'Unknown error'));
      setCustomerDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    setError('Error scanning QR code: ' + (err.message || 'Unknown error'));
  };

  const resetScanner = () => {
    setCouponCode('');
    setError('');
    setCustomerDetails(null);
    setIsScanning(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(98vh-80px)] p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">QR Coupon Scanner</h2>

          {isScanning ? (
            <div className="flex flex-col items-center">
              <QrReader
                delay={300}
                style={previewStyle}
                onError={handleError}
                onScan={handleScan}
                constraints={{ video: { facingMode: 'environment' } }}
                className="rounded-lg border-4 border-blue-500 shadow-md"
              />
              <p className="mt-2 text-gray-600 text-center text-sm">Position the QR code within the frame</p>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-fade-in">
              {isLoading ? (
                <div className="text-gray-600">Verifying coupon...</div>
              ) : couponCode && !error ? (
                <>
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                    <svg
                      className="w-6 h-6 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-green-600 mb-2">Coupon Verified!</h3>
                  <p className="bg-gray-100 p-3 rounded-lg text-gray-800 font-mono text-base break-all mb-4 shadow-inner">
                    {couponCode}
                  </p>

                  {customerDetails && (
                    <div className="w-full bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="text-md font-semibold text-gray-700 mb-2">Customer Details</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">Name:</span> {customerDetails.name}</p>
                        <p><span className="font-medium">Email:</span> {customerDetails.email}</p>
                        <p><span className="font-medium">Phone:</span> {customerDetails.phone}</p>
                        <p><span className="font-medium">DOB:</span> {new Date(customerDetails.dob).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={resetScanner}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-full font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Scan Another
                  </button>
                </>
              ) : null}
            </div>
          )}

          {error && (
            <div className="mt-3 p-2 bg-red-100 text-red-700 rounded-lg text-center animate-fade-in text-sm">
              {error}
              {!isScanning && (
                <button
                  onClick={resetScanner}
                  className="ml-2 text-red-800 underline hover:text-red-900"
                >
                  Try Again
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CouponScanner;