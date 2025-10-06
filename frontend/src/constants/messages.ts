export const MESSAGES = {
    LOADING: 'Memuat data nasabah...',
    ERROR: 'Gagal memuat data nasabah. Silakan coba lagi.',
    NO_CUSTOMERS: 'Tidak ada nasabah ditemukan',
    NO_SEARCH_RESULTS: 'Coba ubah kata kunci pencarian Anda',
    NO_REGISTERED_CUSTOMERS: 'Belum ada nasabah yang terdaftar'
} as const;

export const PLACEHOLDERS = {
    SEARCH: 'Cari berdasarkan nama, email, telepon, atau nomor KTP...'
} as const;

export const TRANSFER_CONSTANTS = {
    API_BASE_URL: 'http://localhost:8080/api',
    CURRENCY: 'IDR',
    MIN_TRANSFER_AMOUNT: 1,
    TRANSFER_TYPES: {
        INTERNAL: 'internal',
        EXTERNAL: 'external'
    },
    STATUS: {
        PENDING: 'pending',
        COMPLETED: 'completed',
        FAILED: 'failed'
    }
} as const;

export const TRANSFER_MESSAGES = {
    INVALID_AMOUNT: 'Jumlah transfer harus lebih dari Rp 0',
    SAME_ACCOUNT: 'Rekening pengirim dan penerima tidak boleh sama',
    ACCOUNT_NOT_FOUND: 'Rekening tidak ditemukan. Silakan periksa kembali nomor rekening.',
    INSUFFICIENT_BALANCE: 'Saldo tidak mencukupi',
    ACCOUNT_INACTIVE: 'tidak aktif',
    TRANSFER_SUCCESS: 'Transfer telah berhasil diproses',
    TRANSFER_ERROR: 'Terjadi kesalahan saat memproses transfer'
} as const;

export type TransferMessage = typeof TRANSFER_MESSAGES[keyof typeof TRANSFER_MESSAGES];