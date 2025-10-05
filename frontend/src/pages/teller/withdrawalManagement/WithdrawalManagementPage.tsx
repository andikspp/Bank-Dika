import React from "react";
import { useWithdrawalTransaction } from "../../../hooks/useWithdrawalTransaction";
import { validateTransactionAmount, validateAccountNumber } from "../../../utils/validators";
import { showError } from "../../../utils/alerts";

import WithdrawalHeader from "../../../components/header/WithdrawalHeader";
import AmountPreview from "../../../components/transactionComponent/AmountPreview";
import SecurityNotice from "../../../components/ui/SecurityNotice";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import AccountInfoDisplay from "../../../components/transactionComponent/AccountInfoDisplay";

import "../../../styles/withdrawalManagementPage.css";
import "../../../styles/modal.css";

const WithdrawalManagementPage: React.FC = () => {
    const {
        accountNumber,
        amount,
        accountInfo,
        loading,
        setAccountNumber,
        setAmount,
        searchAccount,
        processWithdrawal
    } = useWithdrawalTransaction();

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

        // Process withdrawal
        await processWithdrawal();
    };

    const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccountNumber(e.target.value);
    };

    return (
        <div className="withdrawal-page">
            <div className="withdrawal-container">
                <WithdrawalHeader />

                <div className="withdrawal-form-container">
                    <form className="withdrawal-form" onSubmit={handleSubmit}>
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

                            {/* Account Info Display */}
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
                                Jumlah Penarikan
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
                                        max={accountInfo?.balance || undefined}
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
                                    transactionType="withdrawal"
                                />
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`submit-btn withdrawal-btn ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <LoadingSpinner size="small" message="Memproses..." />
                            ) : (
                                <>
                                    <span className="btn-icon">💸</span>
                                    <span>Tarik Tunai</span>
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

export default WithdrawalManagementPage;