import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { fetchCustomerFromCouponID } from '../../services/api';

// Define interfaces based on the API response
interface Customer {
  id: string;
  email: string;
  name: string;
  phone: string;
  DOB: string;
  reviewDescription?: string;
  reviewImage: string;
  createdAt: string;
  updatedAt: string;
}

interface Coupon {
  id: string;
  code: string;
  validFrom: string;
  validTill: string;
  maxDiscount: number;
  minOrderValue: number;
  isUsed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CouponCustomer {
  customer: Customer | null;
  coupon: Coupon;
}

const CustomerDetailsPage: React.FC = () => {
  const { couponId } = useParams<{ couponId: string }>();
  const [couponCustomer, setCouponCustomer] = useState<CouponCustomer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        if (couponId) {
          const response = await fetchCustomerFromCouponID(couponId);
          const data = response.data; // { customer: {...}, coupon: {...} }
          setCouponCustomer(data);
        } else {
          console.error('Coupon ID is undefined');
        }
      } catch (error) {
        console.error('Failed to fetch customer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [couponId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!couponCustomer || !couponCustomer.customer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-background rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Customer Details</h1>
              <ExternalLink className="text-blue-600 cursor-pointer" size={20} />
            </div>
          </div>
          <div className="p-6 text-center py-12">
            <p className="text-gray-400">No customer has used this coupon yet.</p>
          </div>
        </div>
      </div>
    );
  }

  const { customer, coupon } = couponCustomer;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-background rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Customer Details</h1>
            <ExternalLink className="text-blue-600 cursor-pointer" size={20} />
          </div>
        </div>

        <div className="p-6">
          <div className="border rounded-lg p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-400">Customer Information</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Name:</span> {customer.name}</p>
                  <p><span className="font-medium">Email:</span> {customer.email}</p>
                  <p><span className="font-medium">Phone:</span> {customer.phone}</p>
                  <p><span className="font-medium">Date of Birth:</span> {new Date(customer.DOB).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-400">Review Information</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Review:</span> {customer.reviewDescription || 'No review provided'}</p>
                  {customer.reviewImage && (
                    <div>
                      <span className="font-medium">Review Image:</span>
                      <img
                        src={customer.reviewImage}
                        alt="Review"
                        className="mt-2 rounded-lg max-w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-400">
                Coupon used on: {new Date(customer.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-400">
                Coupon Code: {coupon.code}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsPage;