import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, QrCode, Calendar, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import DashboardLayout from '@/layout/Layout';
import { getClient, getCoupons, redeemCoupon } from '../../../services/api';
import toast from 'react-hot-toast';
import { Client, Coupon } from '../../../types';
import { Button } from '@/components/ui/button';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [client, setClient] = React.useState<Client>();
  const [coupons, setCoupons] = React.useState<Coupon[]>();
  const [loadingRedeems, setLoadingRedeems] = useState<{ [key: string]: boolean }>({});

  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState({
    client: false,
    coupons: false,
  });
  const FORM_BASE_URL = import.meta.env.VITE_FORM_BASE_URL;

  // Redirect if id doesn't match clientId
  useEffect(() => {
    const clientId = localStorage.getItem('clientId');
    if (clientId && id && id !== clientId) {
      navigate(`/${clientId}`, { replace: true });
    }
  }, [id, navigate]);

  // Load client and coupons when id changes
  useEffect(() => {
    if (id) {
      loadClient();
      loadCoupons();
    }
  }, [id]);

  const filteredCoupons = coupons?.filter((coupon: any) =>
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
      //   toast.error('Something went wrong');
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
      //   toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    console.log(filteredCoupons);
  }, [filteredCoupons]);

  const handleQRClick = (id: number): void => {
    navigate(`/customer-details/${id}`);
  };

  const handleDateFormat = (date: Date): string => {
    return new Date(date).toLocaleDateString();
  };
  const handleRedeemClick = async (id: string): Promise<void> => {
    try {
      setLoadingRedeems(prev => ({ ...prev, [id]: true }));
      const response = await redeemCoupon(id);
      if (response.status !== 200) {
        toast.error('Something went wrong');
      } else {
        await loadCoupons();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to redeem coupon');
    } finally {
      setLoadingRedeems(prev => ({ ...prev, [id]: false }));
    }
  };

  const isValidDate = (date: Date): boolean => {
    const couponDate = new Date(date);
    const currentDate = new Date();
    return couponDate >= currentDate;
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
                            <span>{handleDateFormat(coupon.validFrom)} - {handleDateFormat(coupon.validTill)}</span>
                          </div>
                          <h4>
                            {coupon.customer}
                          </h4>
                        </div>
                        <div className='flex items-center gap-2 flex-col justify-between'>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${isValidDate(coupon.validTill) && !coupon.isUsed
                              ? coupon.validFrom < new Date() ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {isValidDate(coupon.validTill) && !coupon.isUsed ? coupon.validFrom < new Date() ? 'Valid' : 'Valid Soon' : 'Expired'}
                          </span>

                          {coupon.isUsed ? (
                            <span className='text-sm text-gray-500'>Redeemed</span>
                          ) : (
                            <Button
                              variant="redeem"
                              size="sm"
                              onClick={() => handleRedeemClick(coupon.id)}
                              type='button'
                              disabled={loadingRedeems[coupon.id]}
                            >
                              {loadingRedeems[coupon.id] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                'Redeem'
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : coupons && coupons.length > 0 ? (
                  coupons.map((coupon: any) => (
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
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${isValidDate(coupon.validTill) && !coupon.isUsed
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {isValidDate(coupon.validTill) && !coupon.isUsed ? 'Valid' : 'Expired'}
                          </span>
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