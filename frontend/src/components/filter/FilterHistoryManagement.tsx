import React from 'react';
import { Search, Download } from 'lucide-react';
import { FilterState } from '../../pages/teller/historyManagement/HistoryManagementPage';

interface FilterSectionProps {
    filters: FilterState;
    onFilterChange: (filters: Partial<FilterState>) => void;
    onExport: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ filters, onFilterChange, onExport }) => {
    return (
        <div className="filters-container">
            <div className="filters-row">
                <div className="search-container">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan rekening, nama, referensi..."
                        value={filters.searchTerm}
                        onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
                        className="search-input"
                    />
                </div>

                <select
                    value={filters.typeFilter}
                    onChange={(e) => onFilterChange({ typeFilter: e.target.value })}
                    className="filter-select"
                >
                    <option value="all">Semua Tipe</option>
                    <option value="DEPOSIT">Setoran</option>
                    <option value="WITHDRAWAL">Penarikan</option>
                    <option value="TRANSFER_DEBIT">Transfer Keluar</option>
                    <option value="TRANSFER_CREDIT">Transfer Masuk</option>
                </select>

                <select
                    value={filters.statusFilter}
                    onChange={(e) => onFilterChange({ statusFilter: e.target.value })}
                    className="filter-select"
                >
                    <option value="all">Semua Status</option>
                    <option value="SUCCESS">Berhasil</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Gagal</option>
                </select>

                <input
                    type="text"
                    placeholder="Filter nomor rekening"
                    value={filters.accountFilter}
                    onChange={(e) => onFilterChange({ accountFilter: e.target.value })}
                    className="filter-input"
                />
            </div>

            <div className="filters-row">
                <select
                    value={filters.dateFilter}
                    onChange={(e) => onFilterChange({ dateFilter: e.target.value })}
                    className="filter-select"
                >
                    <option value="today">Hari Ini</option>
                    <option value="week">Minggu Ini</option>
                    <option value="month">Bulan Ini</option>
                    <option value="custom">Custom Range</option>
                </select>

                {filters.dateFilter === 'custom' && (
                    <>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => onFilterChange({ startDate: e.target.value })}
                            className="date-input"
                        />
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => onFilterChange({ endDate: e.target.value })}
                            className="date-input"
                        />
                    </>
                )}

                <button onClick={onExport} className="export-btn">
                    <Download className="w-4 h-4" />
                    Export
                </button>
            </div>
        </div>
    );
};

export default FilterSection;