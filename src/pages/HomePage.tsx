import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, QrCode, Calendar, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import DashboardLayout from '@/layout/Layout';
import { getClient, getCoupons, claimCoupon } from '../../../services/api';
import toast from 'react-hot-toast';
import { Client, Coupon } from '../../../types';
import axios from 'axios'; // Add axios for API calls

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [client, setClient] = React.useState<Client>();
  const [coupons, setCoupons] = React.useState<Coupon[]>();
  const navigate = useNavigate();
  const { id } = useParams();
  console.log('Current id:', id);

  const [isLoading, setIsLoading] = useState({
    client: false,
    coupons: false,
  });
  const FORM_BASE_URL = import.meta.env.VITE_FORM_BASE_URL;

  useEffect(() => {
    const clientId = localStorage.getItem('clientId');
    if (clientId && id && id !== clientId) {
      navigate(`/${clientId}`, { replace: true });
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) {
      loadClient();
      loadCoupons();
    }
  }, [id]);

  const filteredCoupons = coupons
    ?.flatMap(coupon => coupon.Coupon)
    .filter((coupon: any) =>
      coupon.code.toLowerCase() === searchTerm.toLowerCase()
    );

  const loadCoupons = async () => {
    try {
      setIsLoading(prev => ({ ...prev, coupons: true }));
      if (id) {
        const response = await getCoupons(id);
        setCoupons(response.data);
      }
      setIsLoading(prev => ({ ...prev, coupons: false }));
    } catch (error) {
      setIsLoading(prev => ({ ...prev, coupons: false }));
      console.error('Something went wrong', error);
    }
  };

  const loadClient = async () => {
    try {
      setIsLoading(prev => ({ ...prev, client: true }));
      if (!id) {
        return <>Failed to load client</>;
      }

      const client = await getClient(id);
      if (client && client.status !== 200) {
        return <>Failed to load client</>;
      }
      setIsLoading(prev => ({ ...prev, client: false }));
      setClient(client.data);
    } catch (error) {
      setIsLoading(prev => ({ ...prev, client: false }));
      console.error(error);
    }
  };

  const handleQRClick = (id: number): void => {
    navigate(`/customer-details/${id}`);
  };

  const handleDateFormat = (date: Date): string => {
    return new Date(date).toLocaleDateString();
  };

  const isValidDate = (date: Date): boolean => {
    const couponDate = new Date(date);
    const currentDate = new Date();
    return couponDate >= currentDate;
  };

  const handleClaimCoupon = async (couponId: string) => {
    try {
      const response = await claimCoupon(couponId);

      toast.success('Coupon claimed successfully!');

      setCoupons(prevCoupons =>
        prevCoupons?.map(coupon => ({
          ...coupon,
          Coupon: {
            ...coupon.Coupon,
            isActive: coupon.Coupon.id === couponId ? false : coupon.Coupon.isActive,
          },
        }))
      );
    } catch (error) {
      console.error('Error claiming coupon:', error);
      toast.error('Failed to claim coupon. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search coupons..."
            className="pl-10"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="text-blue-600" size={20} />
              Shop QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleQRClick(1)}
            >
              {!isLoading.client ? (
                client?.qr_id ? (
                  <QRCodeCanvas
                    value={`${FORM_BASE_URL + '/?c_id=' + client.qr_id}`}
                    color="red"
                    bgColor="white"
                    size={200}
                  />
                ) : (
                  'Failed to load QR'
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Coupons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isLoading.coupons ? (
              filteredCoupons ? (
                filteredCoupons.length > 0 ? (
                  filteredCoupons.map((coupon: any) => (
                    <div
                      key={coupon.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{coupon.code}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar size={16} />
                            <span>Created: {handleDateFormat(coupon.validFrom)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar size={16} />
                            <span>Expires: {handleDateFormat(coupon.validTill)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              isValidDate(coupon.validTill)
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {isValidDate(coupon.validTill) ? 'Valid' : 'Expired'}
                          </span>
                          <button
                            onClick={() => handleClaimCoupon(coupon.id)}
                            disabled={!coupon.isActive || !isValidDate(coupon.validTill)}
                            className={`mt-2 px-3 py-1 rounded text-sm ${
                              coupon.isActive && isValidDate(coupon.validTill)
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {coupon.isActive ? 'Claim' : 'Claimed'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : coupons && coupons.length > 0 ? (
                  coupons.flatMap(coupon => coupon.Coupon).map((coupon: any) => (
                    <div
                      key={coupon.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{coupon.code}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar size={16} />
                            <span>Created: {handleDateFormat(coupon.validFrom)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar size={16} />
                            <span>Expires: {handleDateFormat(coupon.validTill)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              isValidDate(coupon.validTill)
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {isValidDate(coupon.validTill) ? 'Valid' : 'Expired'}
                          </span>
                          <button
                            onClick={() => handleClaimCoupon(coupon.id)}
                            disabled={!coupon.isActive || !isValidDate(coupon.validTill)}
                            className={`mt-2 px-3 py-1 rounded text-sm ${
                              coupon.isActive && isValidDate(coupon.validTill)
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {coupon.isActive ? 'Claim' : 'Claimed'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex w-full h-full items-center justify-center">
                    No coupons found
                  </div>
                )
              ) : (
                <div className="flex w-full h-full items-center justify-center">
                  Failed to load coupons
                </div>
              )
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <Loader2 className="animate-spin" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HomePage;