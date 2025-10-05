import React from "react";
import { useDepositTransaction } from "../../../hooks/useDepositTransaction";
import { validateTransactionAmount, validateAccountNumber } from "../../../utils/validators";
import { showError } from "../../../utils/alerts";

import DepositHeader from "../../../components/header/DepositHeader";
import AccountInfoDisplay from "../../../components/transactionComponent/AccountInfoDisplay";
import SecurityNotice from "../../../components/ui/SecurityNotice";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import AmountPreview from "../../../components/transactionComponent/AmountPreview";

import "../../../styles/depositManagementPage.css";

const DepositManagementPage: React.FC = () => {
    const {
        accountNumber,
        amount,
        accountInfo,
        loading,
        setAccountNumber,
        setAmount,
        searchAccount,
        processDeposit
    } = useDepositTransaction();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        const accountError = validateAccountNumber(accountNumber);
        if (accountError) {
            showError('Peringatan!', accountError);
            return;
        }

        const amountError = validateTransactionAmount(amount);
        if (amountError) {
            showError('Peringatan!', amountError);
            return;
        }

        // Search account if not already searched
        if (!accountInfo) {
            const found = await searchAccount(accountNumber);
            if (!found) return;
        }

        // Process deposit
        await processDeposit();
    };

    const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccountNumber(e.target.value);
        // Reset account info when account number changes
        if (accountInfo) {
            // Could add debounced search here
        }
    };

    return (
        <div className="deposit-page">
            <div className="deposit-container">
                <DepositHeader />

                <div className="deposit-form-container">
                    <form className="deposit-form" onSubmit={handleSubmit}>
                        {/* Account Number Input */}
                        <div className="form-group">
                            <label htmlFor="accountNumber" className="form-label">
                                <span className="label-icon">🏦</span>
                                Nomor Rekening
                            </label>
                            <div className="input-container">
                                <input
                                    id="accountNumber"
                                    type="text"
                                    className="form-input"
                                    value={accountNumber}
                                    onChange={handleAccountNumberChange}
                                    required
                                    placeholder="Masukkan nomor rekening"
                                    disabled={loading}
                                />
                                <div className="input-border"></div>
                            </div>

                            {accountInfo && (
                                <AccountInfoDisplay
                                    customerName={accountInfo.customerName}
                                    balance={accountInfo.balance}
                                />
                            )}
                        </div>

                        {/* Amount Input */}
                        <div className="form-group">
                            <label htmlFor="amount" className="form-label">
                                <span className="label-icon">💵</span>
                                Jumlah Setoran
                            </label>
                            <div className="input-container">
                                <div className="currency-input">
                                    <span className="currency-symbol">Rp</span>
                                    <input
                                        id="amount"
                                        type="number"
                                        className="form-input currency-field"
                                        value={amount || ""}
                                        onChange={e => setAmount(Number(e.target.value))}
                                        required
                                        min={1}
                                        placeholder="0"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="input-border"></div>
                            </div>

                            {amount > 0 && accountInfo && (
                                <AmountPreview
                                    amount={amount}
                                    currentBalance={accountInfo.balance}
                                    transactionType="deposit"
                                />
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`submit-btn ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <LoadingSpinner size="small" message="Memproses..." />
                            ) : (
                                <>
                                    <span className="btn-icon">💸</span>
                                    <span>Setor Sekarang</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <SecurityNotice />
            </div>
        </div>
    );
};

export default DepositManagementPage;