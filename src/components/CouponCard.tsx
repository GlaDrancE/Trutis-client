import React, { FC, useEffect, useState } from 'react'
import { Coupon } from 'types'
import { AlertCircle, Calendar, DollarSign, Gift, IndianRupee } from 'lucide-react';
import { redeemCoupon } from '../../services/api';
import { useParams } from 'react-router';
import useClient from '@/hooks/client-hook';
import toast from 'react-hot-toast';
import { useCouponStore } from '@/store';

interface CouponRedemption {
    customerId: string;
    couponId: string;
    usedAt: Date;
    coupon: Coupon;
}
interface CustomerDetails {
    customer: {
        CouponRedemption: CouponRedemption;
        name: string;
        Customercoupon: [Coupon];
    }
    points: number;
}
interface CouponCardProps {
    coupon: Coupon | null | undefined
    hide?: boolean
    customerDetails?: CustomerDetails | null | undefined
}

export const CouponCard: FC<CouponCardProps> = ({ coupon, hide }) => {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

    };
    const { id } = useParams();
    // const { client } = useClient();
    const { loadCoupons } = useCouponStore();
    const [_coupon, _setCoupon] = useState<Coupon>(coupon as Coupon)

    const [loadingRedeems, setLoadingRedeems] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (coupon) {
            _setCoupon(coupon)
        }
    }, [coupon])

    const client_id = id || '';


    const handleRedeemClick = async (id: string, e: React.MouseEvent): Promise<void> => {
        e.stopPropagation();
        try {
            setLoadingRedeems(prev => ({ ...prev, [id]: true }));
            const response = await redeemCoupon(id, client_id);
            if (response.status !== 200) {
                toast.error('Something went wrong');
            } else {
                _setCoupon({ ..._coupon, isUsed: true })
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to redeem coupon');
        } finally {
            setLoadingRedeems(prev => ({ ...prev, [id]: false }));
        }
    };
    return (
        <div
            className="bg-background rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer w-full"
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <Gift className="h-5 w-5 text-blue-500" />
                        <span className="text-lg font-semibold">{_coupon?.code}</span>
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${_coupon?.isUsed
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-green-100 text-green-700'
                            }`}
                    >
                        {_coupon?.isUsed ? 'Used' : 'Active'}
                    </span>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                            Valid from {formatDate(_coupon?.validFrom || '')}
                        </span>
                    </div>

                    <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                            Max discount: {_coupon?.maxDiscount}%
                        </span>
                    </div>

                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                            Created on {formatDate(_coupon?.createdAt || '')}
                        </p>
                        {!hide && (
                            <button
                                onClick={(e) => handleRedeemClick(_coupon?.id.toString() || '', e)}
                                disabled={loadingRedeems[_coupon?.id.toString() || ''] || _coupon?.isUsed}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors 
                          bg-black text-white hover:bg-gray-800 
                          dark:bg-white dark:text-black dark:hover:bg-gray-200 
                          disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed`}
                            >
                                {loadingRedeems[_coupon?.id.toString() || ''] ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent dark:border-black dark:border-t-transparent" />
                                ) : (
                                    !_coupon?.isUsed ? <span>Claim</span> : <span>Claimed</span>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
