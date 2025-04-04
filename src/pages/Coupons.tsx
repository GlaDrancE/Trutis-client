import React, { useState } from 'react';
import { Gift, Calendar, DollarSign, AlertCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useClient from '../hooks/client-hook';
import toast from 'react-hot-toast';
import { redeemCoupon } from '../../services/api';
import { useClientStore } from '@/store/clientStore';

const CouponsPage = () => {
  const navigate = useNavigate();
  const { coupons, isLoading, client } = useClient();
  const clientStore = useClientStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingRedeems, setLoadingRedeems] = useState<Record<string, boolean>>({});

  const handleRedeemClick = async (id: string, e: React.MouseEvent): Promise<void> => {
    e.stopPropagation();
    try {
      setLoadingRedeems(prev => ({ ...prev, [id]: true }));
      const response = await redeemCoupon(id);
      if (response.status !== 200) {
        toast.error('Something went wrong');
      } else {
        await clientStore.loadCoupons(client?.id || '');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to redeem coupon');
    } finally {
      setLoadingRedeems(prev => ({ ...prev, [id]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading.coupons) {
    return (
      <div className="bg-background flex items-center justify-center h-[93vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-background container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Adjusted Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Available Coupons</h1>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full self-start sm:self-center">
            {filteredCoupons.length} Active Coupons
          </span>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search coupons..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 bg-background focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((coupon) => (
            <div
              key={coupon.id}
              onClick={() => navigate(`/${client?.id}/customer/${coupon.id}`)}
              className="bg-background rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-5 w-5 text-blue-500" />
                    <span className="text-lg font-semibold">{coupon.code}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${coupon.isUsed
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-green-100 text-green-700'
                      }`}
                  >
                    {coupon.isUsed ? 'Used' : 'Active'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      Valid from {formatDate(coupon.validFrom)}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      Max discount: {coupon.maxDiscount}%
                    </span>
                  </div>

                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      Min order: {coupon.minOrderValue} ₹
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      Created on {formatDate(coupon.createdAt)}
                    </p>
                    {/* {!coupon.isUsed && (
                      <button
                        onClick={(e) => handleRedeemClick(coupon.id.toString(), e)}
                        disabled={loadingRedeems[coupon.id]}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors 
                          bg-black text-white hover:bg-gray-800 
                          dark:bg-white dark:text-black dark:hover:bg-gray-200 
                          disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed`}
                      >
                        {loadingRedeems[coupon.id] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent dark:border-black dark:border-t-transparent" />
                        ) : (
                          'Claim'
                        )}
                      </button>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCoupons.length === 0 && (
          <div className="text-center py-12">
            <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No Coupons Available</h3>
            <p className="mt-2 text-gray-400">
              {searchTerm ? 'No coupons match your search' : 'No coupons have been created yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponsPage;