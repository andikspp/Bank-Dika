import React from "react";
import "../../../styles/modal.css";
import Select from "react-select";

interface AddAccountModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    newAccount: {
        accountType: string;
        balance: number;
        status: string;
        customerId: number;
    };
    loading?: boolean;
    hideCustomerIdInput?: boolean;
    customers?: { id: number; fullName: string }[];
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({
    open,
    onClose,
    onSubmit,
    onChange,
    newAccount,
    loading = false,
    hideCustomerIdInput = false,
    customers = [],
}) => {
    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h3>Tambah Rekening Baru</h3>
                    <button className="close-btn" onClick={onClose} type="button">
                        ✕
                    </button>
                </div>
                <form onSubmit={onSubmit} className="add-form">
                    {!hideCustomerIdInput && (
                        <div className="form-group">
                            <label>Nasabah</label>
                            <Select
                                options={customers.map(c => ({
                                    value: c.id,
                                    label: c.fullName
                                }))}
                                value={customers
                                    .filter(c => c.id === newAccount.customerId)
                                    .map(c => ({ value: c.id, label: c.fullName }))}
                                onChange={(option: any) => {
                                    onChange({
                                        target: {
                                            name: "customerId",
                                            value: option ? option.value : 0
                                        }
                                    } as any);
                                }}
                                placeholder="Pilih nasabah..."
                                isClearable
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Jenis Rekening</label>
                        <select
                            name="accountType"
                            value={newAccount.accountType}
                            onChange={onChange}
                            required
                        >
                            <option value="">Pilih Jenis</option>
                            <option value="SAVINGS">💰 Tabungan</option>
                            <option value="CURRENT">🏦 Giro</option>
                        </select>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Saldo Awal</label>
                            <input
                                name="balance"
                                type="number"
                                placeholder="0"
                                value={newAccount.balance}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select
                                name="status"
                                value={newAccount.status}
                                onChange={onChange}
                            >
                                <option value="ACTIVE">Aktif</option>
                                <option value="INACTIVE">Nonaktif</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                            Batal
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAccountModal;