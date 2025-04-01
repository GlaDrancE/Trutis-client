import React, { FC } from 'react'
import { Coupon } from 'types'
import { AlertCircle, Calendar, DollarSign, Gift, IndianRupee } from 'lucide-react';

interface CouponRedemption {
    customerId: string;
    couponId: string;
    usedAt: Date;
    Coupons: Coupon;
}
interface CustomerDetails {
    customer: {
        CouponRedemption: CouponRedemption;
        name: string;
        CustomerCoupons: [Coupon];
    }
    points: number;
}
interface CouponCardProps {
    coupons: Coupon | null | undefined
    customerDetails: CustomerDetails | null | undefined
    handleRedeemClick: (couponId: string, e: React.MouseEvent) => void;
    loadingRedeems: Record<string, boolean>;
}

export const CouponCard: FC<CouponCardProps> = ({
    coupons, customerDetails, handleRedeemClick, loadingRedeems
}) => {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

    };
    const validateDate = () => {
        const currentDate = new Date();
        const couponDate = new Date(coupons?.validFrom || '');
        console.log(couponDate, currentDate)
        return couponDate > currentDate;
    }
    return (
        <div
            className="bg-background rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer w-full"
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <Gift className="h-5 w-5 text-blue-500" />
                        <span className="text-lg font-semibold">{coupons?.code}</span>
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${coupons?.isUsed
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-green-100 text-green-700'
                            }`}
                    >
                        {coupons?.isUsed ? 'Used' : 'Active'}
                    </span>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                            Valid from {formatDate(coupons?.validFrom || '')}
                        </span>
                    </div>

                    <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                            Max discount: {coupons?.maxDiscount}%
                        </span>
                    </div>

                    <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                            Min order value: {coupons?.minOrderValue}
                        </span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                            Created on {formatDate(coupons?.createdAt || '')}
                        </p>
                        {!coupons?.isUsed && validateDate() && (
                            <button
                                onClick={(e) => handleRedeemClick(coupons?.id.toString() || '', e)}
                                disabled={loadingRedeems[coupons?.id.toString() || '']}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors 
                          bg-black text-white hover:bg-gray-800 
                          dark:bg-white dark:text-black dark:hover:bg-gray-200 
                          disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed`}
                            >
                                {loadingRedeems[coupons?.id.toString() || ''] ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent dark:border-black dark:border-t-transparent" />
                                ) : (
                                    'Claim'
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
