import React from 'react';

const SecurityNotice: React.FC = () => (
    <div className="security-notice">
        <div className="notice-header">
            <span className="security-icon">🔐</span>
            <h3>Protokol Keamanan</h3>
        </div>
        <ul className="security-list">
            <li>✓ Verifikasi identitas nasabah (KTP/SIM)</li>
            <li>✓ Pastikan tanda tangan sesuai</li>
            <li>✓ Catat nomor transaksi</li>
            <li>✓ Hitung uang di depan nasabah</li>
        </ul>
    </div>
);

export const TransferSecurityNotice: React.FC = () => {
    return (
        <div className="security-notice">
            <div className="notice-header">
                <span className="security-icon">🔐</span>
                <h3>Protokol Keamanan Transfer</h3>
            </div>
            <ul className="security-list">
                <li>✓ Verifikasi kedua rekening (pengirim & penerima)</li>
                <li>✓ Pastikan saldo mencukupi</li>
                <li>✓ Konfirmasi data sebelum memproses</li>
                <li>✓ Simpan bukti transaksi</li>
            </ul>
        </div>
    );
};

export default SecurityNotice;