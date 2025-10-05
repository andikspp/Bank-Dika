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

export default SecurityNotice;