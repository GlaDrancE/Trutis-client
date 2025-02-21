import DashboardLayout from '../layout/Layout';
import React, { useState } from 'react';
import QrReader from 'react-qr-scanner';

const CouponScanner: React.FC = () => {
  const [couponCode, setCouponCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(true);

  const previewStyle = {
    height: 320,
    width: 320,
  };

  const handleScan = (data: { text: string } | null) => {
    // console.log(data);
    if (data?.text) {
      setCouponCode(data.text);
      setIsScanning(false);
      setError('');
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    setError('Error scanning QR code: ' + (err.message || 'Unknown error'));
  };

  const resetScanner = () => {
    setCouponCode('');
    setError('');
    setIsScanning(true);
  };

  return (

    <DashboardLayout>


      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">QR Coupon Scanner</h2>

          {isScanning ? (
            <div className="flex flex-col items-center">
              <div className="relative">
                <QrReader
                  delay={300}
                  style={previewStyle}
                  onError={handleError}
                  onScan={handleScan}
                  constraints={{ video: { facingMode: 'environment' } }}
                  className="rounded-lg border-4 border-blue-500 shadow-md"
                />

              </div>
              <p className="mt-4 text-gray-600 text-center text-sm">
                Position the QR code within the frame to scan
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-fade-in">
              {couponCode && (
                <>
                  <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <svg
                      className="w-8 h-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-green-600 mb-2">Coupon Code Scanned!</h3>
                  <p className="bg-gray-100 p-4 rounded-lg text-gray-800 font-mono text-lg break-all mb-6 shadow-inner">
                    {couponCode}
                  </p>
                  <button
                    onClick={resetScanner}
                    className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Scan Another Code
                  </button>
                </>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center animate-fade-in">
              {error}
            </div>
          )}
        </div>
      </div>

    </DashboardLayout>

  );
};

export default CouponScanner;