import { useState } from 'react';
import { Gift, Search } from 'lucide-react';
import useClient from '../hooks/client-hook';
import { CouponCard } from '@/components/CouponCard';
import { useCouponStore } from '@/store';

const CouponsPage = () => {
  const { isLoading } = useClient();
  const { coupons } = useCouponStore();
  const [searchTerm, setSearchTerm] = useState('');


  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //   });
  // };

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
            <CouponCard coupon={coupon} hide={true} />
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