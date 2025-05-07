

export const calculatePointsForCoupon = (amount: number, coinRatio: number, minOrderValue: number) => {
    const calculatePoints = (coinRatio / 100) * amount;
    return calculatePoints;
}
