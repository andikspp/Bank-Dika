import React from 'react';

interface AccountInfoDisplayProps {
    customerName: string;
    balance: number;
}

const AccountInfoDisplay: React.FC<AccountInfoDisplayProps> = ({
    customerName,
    balance
}) => (
    <>
        <div className="account-info">
            <span className="info-icon">👤</span>
            <span className="info-text">Atas Nama: <strong>{customerName}</strong></span>
        </div>

        <div className="balance-display">
            <div className="balance-card">
                <span className="balance-label">💰 Saldo Tersedia</span>
                <span className="balance-amount">
                    {balance.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                </span>
            </div>
        </div>
    </>
);

export default AccountInfoDisplay;