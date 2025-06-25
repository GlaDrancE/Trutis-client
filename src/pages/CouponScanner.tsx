import React, { FormEvent, useState } from 'react';
import QrReader from 'react-qr-scanner';
import { getCustomer, redeemPoints, updatePoints } from '../../services/api'
import { Input } from '@/components/ui/input';
import { Coins, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useClient from '@/hooks/client-hook';
import toast from 'react-hot-toast';
import { Coupon } from 'types';
import { CouponCard } from '@/components/CouponCard';
import { RedeemModal } from '@/components/RedeemModal';
import { calculatePointsForCoupon } from '@/lib/calculatePoints';
import CoinRedeemSuccess from '@/components/CoinRedeemSuccess';
import { useParams } from 'react-router';
import { jwtDecode } from 'jwt-decode';


interface CouponRedemption {
  customerId: string;
  couponId: string;
  usedAt: Date;
  Coupons: Coupon;
}
interface CustomerDetails {
  customer: {
    id: string;
    CouponRedemption: CouponRedemption;
    name: string;
    email: string;
    CustomerCoupons: [Coupon];
  }
  points: number;
}
interface CustomJwtPayload {
  userType?: string;
}

const CouponScanner: React.FC = () => {
  const [couponCode, setCouponCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [qrError, setQRError] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [coupons, setCoupons] = useState<Coupon>();
  const [isLoading, setIsLoading] = useState<{ coupon: boolean, redeem: boolean }>({
    coupon: false,
    redeem: false
  });
  const { id } = useParams()
  const { client } = useClient();
  const client_id = id || client?.id || '';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [redeemMessage, setRedeemMessage] = useState('');
  const [points, setPoints] = useState('')
  const [pointsToAdd, setPointsToAdd] = useState(0)
  const [isBillSuccess, setIsBillSuccess] = useState(false)
  const token = localStorage.getItem('token');
  const previewStyle = {
    height: 240,
    width: 240,
  };
  let userType: any;

  if (token) {
    try {
      const decode = jwtDecode<CustomJwtPayload>(token);
      userType = decode.userType;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }


  const handleScan = async (data: { text: string } | null) => {
    if (data?.text) {
      setCouponCode(data.text);
      setIsScanning(false);
      setError('');
      await verifyCoupon(data.text);
    }
  };

  const verifyCoupon = async (code: string, e?: FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    try {
      setIsLoading(prev => ({ ...prev, coupon: true }));

      const response = await getCustomer(code, client_id);
      console.log(response.data.customer)

      if (response.status !== 200) {
        setError('Invalid or expired coupon code');
        setCustomerDetails(null);
      } else {
        setCustomerDetails(response.data);
        setCoupons(response.data.customer.Coupon);



      }
    } catch (err: any) {
      setError('Error verifying coupon: ' + (err.response?.data?.message || 'Unknown error'));
      setCustomerDetails(null);
      console.log(err)
    } finally {
      setIsLoading(prev => ({ ...prev, coupon: false }));
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    setQRError('Error scanning QR code: ' + (err.message || 'Unknown error'));
  };

  const resetScanner = () => {
    setCouponCode('');
    setError('');
    setPoints('');
    setPointsToAdd(0);
    setCustomerDetails(null);
    setIsScanning(true);
    setIsBillSuccess(false);
  };


  const openRedeemModal = () => {
    setCoupons(prev => (prev ? { ...prev, isUsed: true } : undefined));
    setRedeemMessage(`${coupons?.maxDiscount}% Coupon Redeemed successfully for ${customerDetails?.customer.name}`);
    setIsModalOpen(true);
  }



  const handleSubmitAmount = async (amount: number) => {
    try {
      const points = calculatePointsForCoupon(amount || 0, coupons?.coinRatio || 0, coupons?.minOrderValue || 0)
      console.log(coupons?.maxDiscount, coupons?.minOrderValue)
      setPointsToAdd(points);
      setIsLoading(prev => ({ ...prev, redeem: true }));
      const response = await updatePoints({
        customerId: customerDetails?.customer.id || '',
        name: customerDetails?.customer.name || '',
        email: customerDetails?.customer.email || '',
        amount: amount || 0,
        maxDiscount: coupons?.maxDiscount || 0,
        minOrderValue: coupons?.minOrderValue || 0,
        clientId: client_id,
        points: points,
        code: couponCode,
        coinRatio: coupons?.coinRatio || 0,
        assignedBy: userType === 'staff' ? 'STAFF' : 'OWNER'
      })

      if (response.status !== 200) {
        toast.error('Failed to process payment');
      } else {
        setIsModalOpen(false);
        setIsBillSuccess(true);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to process payment');
    } finally {
      setIsLoading(prev => ({ ...prev, redeem: false }));
    }
  };
  const handleRedeemPoints = async (points: string) => {
    try {
      const response = await redeemPoints({
        customerId: customerDetails?.customer.id || '',
        clientId: client_id,
        points: parseFloat(points),
        code: couponCode,
        coinRatio: coupons?.coinRatio || 0,
        assignedBy: userType === 'staff' ? 'STAFF' : 'OWNER'
      });
      if (response.status !== 200) {
        toast.error('Something went wrong');
      } else {
        toast.success('Points redeemed successfully');
        setRedeemMessage(`${points} Points Redeemed for ${customerDetails?.customer.name}`);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to redeem points');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(98vh-80px)] p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">QR Coupon Scanner</h2>


        {isScanning ? (

          <form className="flex flex-col items-center" onSubmit={(e) => { setIsScanning(false); verifyCoupon(couponCode, e) }}>
            <div className='flex flex-col gap-4 w-full mb-4'>
              <Input type='text' placeholder='Enter Coupon Code' value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
              <Button variant='default' className='w-full' >Verify Coupon</Button>
            </div>
            <QrReader
              delay={300}
              style={previewStyle}
              onError={handleError}
              onScan={handleScan}
              constraints={{ video: { facingMode: 'environment' } }}
              className="rounded-lg border-4 border-blue-500 shadow-md"
            />
            <p className="mt-2 text-gray-600 text-center text-sm">Position the QR code within the frame</p>
          </form>

        ) : (
          <div className="flex flex-col items-center animate-fade-in relative">
            {isLoading.coupon ? (
              <div className="text-gray-600">Verifying coupon...</div>
            ) : isLoading.redeem ? (
              <div className="text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
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

                {
                  coupons?.isUsed ? (
                    <>
                      {customerDetails && (
                        <div className="w-full bg-gray-50 p-4 rounded-lg mb-4">
                          <h4 className="text-md font-semibold text-gray-700 mb-2">Customer Details</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p><span className="font-medium">Name:</span> {customerDetails.customer.name}</p>
                            <p><span className="font-medium">Total Coins for Redeem:</span> {customerDetails.points} Tugo Coins</p>
                          </div>
                        </div>
                      )}

                      {coupons?.isUsed && customerDetails && customerDetails?.points > 0 ? (
                        <div className='flex flex-col gap-4 w-full'>

                          {/* Amount Input */}
                          <div className='border-2 border-blue-300 rounded-lg p-4 shadow-inner'>
                            <div className='flex w-full mb-4'>
                              <div className='relative flex items-center w-full'>
                                <span className='absolute left-3 text-gray-500'><Coins className='h-4 w-4 text-gray-500' /></span>
                                <Input
                                  type='number'
                                  placeholder='Enter Amount'
                                  className='pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                  value={points}
                                  onKeyDown={(e) => {
                                    if (e.key === 'e' || e.key === '-' || e.key === '+' || e.key === '.') {
                                      e.preventDefault();
                                    }
                                  }}
                                  onChange={(e) => setPoints(e.target.value)}
                                />
                              </div>
                            </div>

                            <div className='flex justify-center mb-3'>
                              <Button variant='default' className='w-full' onClick={() => handleRedeemPoints(points)}>Redeem Points</Button>
                            </div>
                          </div>
                          <div className='flex justify-center mb-8'>
                            <Button variant='default' className='w-full' onClick={() => openRedeemModal()}>Add Points</Button>
                          </div>
                        </div>
                      ) : (
                        <div className='flex justify-center mb-8'>
                          <Button variant='default' className='w-full' onClick={() => openRedeemModal()}>Add Points</Button>
                        </div>
                      )}

                    </>
                  ) : (

                    <CouponCard coupon={coupons} />
                  )
                }
                <button
                  onClick={resetScanner}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-full font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 mt-6"
                >
                  Scan Another
                </button>
              </>
            ) : null}

            {isBillSuccess && <CoinRedeemSuccess
              amount={pointsToAdd}
              name={customerDetails?.customer.name || ''}
              onClose={() => resetScanner()}
            />}
          </div>
        )}

        {error || qrError && (
          <div className="mt-3 p-2 bg-red-100 text-red-700 rounded-lg text-center animate-fade-in text-sm">
            {error || qrError}
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

      <RedeemModal
        message={redeemMessage}
        onSubmit={handleSubmitAmount}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      {/* <RedeemModal
        message={redeemMessage}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      /> */}
    </div>
  );
};

export default CouponScanner;