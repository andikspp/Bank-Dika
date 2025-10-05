export const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR'
    });
};

export const formatNumber = (value: number): string => {
    return value.toLocaleString('id-ID');
};