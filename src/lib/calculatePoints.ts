

export const calculatePointsForCoupon = (amount: number, maxDiscount: number, minOrderValue: number) => {
    const calculatePoints = (maxDiscount / 100) * amount;
    return calculatePoints;
}
