export const validateTransactionAmount = (amount: number): string | null => {
    if (amount <= 0) {
        return 'Jumlah setoran harus lebih dari Rp 0';
    }

    if (amount > 1000000000) { // 1 Miliar
        return 'Jumlah setoran terlalu besar';
    }

    return null;
};

export const validateAccountNumber = (accountNumber: string): string | null => {
    if (!accountNumber.trim()) {
        return 'Nomor rekening tidak boleh kosong';
    }

    if (accountNumber.length < 10) {
        return 'Nomor rekening minimal 10 digit';
    }

    return null;
};